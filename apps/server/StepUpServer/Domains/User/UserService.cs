using StepUpServer.Common;
using StepUpServer.Common.Events;

namespace StepUpServer.Domains.User;

public interface IUserService
{
    Task StartSignUp(string email, string username);
    Task<User> CompleteSignUp(string email, string authCode);
    Task StartSignIn(string email);
    Task<User> CompleteSignIn(string email, string authCode);
    Task<User> Update(string userId, string? username, IFormFile? file);
}

public partial class UserService(
    IUserRepository repository,
    IUserValidator validator,
    IEventPublisher eventPublisher,
    IFileService fileService,
    IEmailService emailService,
    IUserEmailService userEmailService
) : IUserService
{
    private const string _avatarFolder = "avatars";

    private readonly IUserRepository _repository = repository;
    private readonly IUserValidator _validator = validator;
    private readonly IEventPublisher _eventPublisher = eventPublisher;
    private readonly IFileService _fileService = fileService;
    private readonly IEmailService _emailService = emailService;
    private readonly IUserEmailService _userEmailService = userEmailService;

    public async Task StartSignUp(string email, string username)
    {
        await _validator.ValidateEmail(email);
        await _validator.ValidateUsername(username);
        var authToken = GenerateNumberString();
        var user = new User
        {
            Id = Utils.GenerateId(),
            Email = email,
            Username = username,
            IsConfirmed = false,
            AuthToken = authToken,
            CreatedAt = Utils.GetCurrentTimestamp(),
            LastSeenAt = 0,
        };
        await _repository.Create(user);
        try
        {
            var emailContent = _userEmailService.GetSignUpEmailContent(username, authToken);
            await _emailService.SendEmailAsync(email, "Welcome to Step Up", emailContent);
        }
        catch (Exception ex)
        {
            await _repository.Delete(user.Id);
            throw new ApiException("errors.serviceUnavailable");
        }
    }

    public async Task<User> CompleteSignUp(string email, string authToken)
    {
        var user = await _validator.EnsureEmailExists(email);
        _validator.EnsureIsNotConfirmed(user);
        _validator.EnsureAuthTokenIsValid(user, authToken);
        user.AuthToken = null;
        user.ApiToken = GenerateApiToken();
        user.IsConfirmed = true;
        await _repository.Update(user);
        await _eventPublisher.PublishAsync(new UserCreatedEvent { UserId = user.Id, Username = user.Username });
        return user;
    }

    public async Task StartSignIn(string email)
    {
        var user = await _validator.EnsureEmailExists(email);
        _validator.EnsureIsConfirmed(user);
        var authToken = GenerateNumberString();
        user.AuthToken = authToken;
        await _repository.Update(user);
        try
        {
            var emailContent = _userEmailService.GetSignInEmailContent(user.Username, authToken);
            await _emailService.SendEmailAsync(email, "Log in to Step Up", emailContent);
        }
        catch
        {
            throw new ApiException("errors.serviceUnavailable");
        }
    }

    public async Task<User> CompleteSignIn(string email, string authToken)
    {
        var user = await _validator.EnsureEmailExists(email);
        _validator.EnsureIsConfirmed(user);
        _validator.EnsureAuthTokenIsValid(user, authToken);
        user.AuthToken = null;
        user.ApiToken = GenerateApiToken();
        user.LastSeenAt = Utils.GetCurrentTimestamp();
        await _repository.Update(user);
        return user;
    }

    public async Task<User> Update(string userId, string? username, IFormFile? file)
    {
        var user = await _validator.EnsureIdExists(userId);
        var updated = false;

        if (username is not null && username != user.Username)
        {
            await _validator.ValidateUsername(username);
            user.Username = username;
            updated = true;
        }

        if (file is not null)
        {
            var validFile = _validator.ValidateAvatar(file);
            var fileName = userId + GenerateNumberString() + Path.GetExtension(validFile.FileName);
            await using var stream = validFile.OpenReadStream();
            var avatarUri = await _fileService.SaveAsync(_avatarFolder, fileName, stream);
            user.AvatarUri = avatarUri;
            updated = true;
        }

        if (updated)
        {
            await _repository.Update(user);
            await _eventPublisher.PublishAsync(
                new UserUpdatedEvent
                {
                    UserId = user.Id,
                    Username = user.Username,
                    AvatarUri = user.AvatarUri,
                }
            );
        }

        return user;
    }

    private static string GenerateNumberString(int length = 6)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(length);

        var result = new char[length];

        for (int i = 0; i < length; i++)
        {
            result[i] = (char)('0' + Random.Shared.Next(0, 10));
        }

        return new string(result);
    }

    private static string GenerateApiToken() =>
        Convert.ToBase64String(Guid.NewGuid().ToByteArray());
}
