using StepUpServer.Common;
using StepUpServer.Common.Events;

namespace StepUpServer.Domains.User;

public interface IUserService
{
    Task StartSignUp(string email, string username);
    Task<User> CompleteSignUp(string email, string authCode);
    Task StartSignIn(string email);
    Task<User> CompleteSignIn(string email, string authCode);
    Task<string> UpdateAvatar(string userId, IFormFile? file);
}

public partial class UserService(
    IUserRepository repository,
    IUserValidator validator,
    IEventPublisher eventPublisher,
    IFileService fileService
) : IUserService
{
    private const string _avatarFolder = "avatars";

    private readonly IUserRepository _repository = repository;
    private readonly IUserValidator _validator = validator;
    private readonly IEventPublisher _eventPublisher = eventPublisher;
    private readonly IFileService _fileService = fileService;

    public async Task StartSignUp(string email, string username)
    {
        await _validator.ValidateEmail(email);
        await _validator.ValidateUsername(username);
        var authToken = GenerateAuthToken();
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
        // TODO: Send authToken to user's email
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
        var authToken = GenerateAuthToken();
        user.AuthToken = authToken;
        await _repository.Update(user);
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

    public async Task<string> UpdateAvatar(string userId, IFormFile? file)
    {
        var validFile = _validator.ValidateAvatar(file);

        var user = await _validator.EnsureIdExists(userId);

        var fileName = userId + Path.GetExtension(validFile.FileName);

        await using var stream = validFile.OpenReadStream();

        var avatarUri = await _fileService.SaveAsync(_avatarFolder, fileName, stream);

        user.AvatarUri = avatarUri;

        await _repository.Update(user);

        await _eventPublisher.PublishAsync(
            new UserUpdatedEvent
            {
                UserId = user.Id,
                Username = user.Username,
                AvatarUri = avatarUri
            });

        return avatarUri;
    }

    private static string GenerateAuthToken() => Random.Shared.Next(100_000, 999_999).ToString();

    private static string GenerateApiToken() =>
        Convert.ToBase64String(Guid.NewGuid().ToByteArray());
}
