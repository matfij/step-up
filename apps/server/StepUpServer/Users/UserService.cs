using StepUpServer.Common;

namespace StepUpServer.Users;

public interface IUserService
{
    Task StartSignUp(string email, string username);
    Task<User> CompleteSignUp(string email, string authCode);
    Task StartSignIn(string email);
    Task<User> CompleteSignIn(string email, string authCode);
    Task<User> Me(string id);
}

public partial class UserService(IUserRepository repository, IUserValidator validator)
    : IUserService
{
    private readonly IUserRepository _repository = repository;
    private readonly IUserValidator _validator = validator;

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
        var user =
            await _repository.GetByEmail(email)
            ?? throw new ApiException("errors.fieldNotFound", nameof(email));
        if (user.AuthToken != authToken)
        {
            throw new ApiException("errors.authTokenNotValid", nameof(authToken));
        }
        if (user.IsConfirmed)
        {
            throw new ApiException("errors.userAlreadyConfirmed");
        }
        user.AuthToken = null;
        user.ApiToken = GenerateApiToken();
        user.IsConfirmed = true;
        await _repository.Update(user);
        return user;
    }

    public async Task StartSignIn(string email)
    {
        var user =
            await _repository.GetByEmail(email)
            ?? throw new ApiException("errors.userNotFound", nameof(email));
        if (!user.IsConfirmed)
        {
            throw new ApiException("errors.userNotConfirmed");
        }
        var authToken = GenerateAuthToken();
        user.AuthToken = authToken;
        await _repository.Update(user);
    }

    public async Task<User> CompleteSignIn(string email, string authToken)
    {
        var user =
            await _repository.GetByEmail(email)
            ?? throw new ApiException("errors.userNotFound");
        if (!user.IsConfirmed)
        {
            throw new ApiException("errors.userNotConfirmed");
        }
        if (user.AuthToken != authToken)
        {
            throw new ApiException("errors.authTokenNotValid", nameof(authToken));
        }
        user.AuthToken = null;
        user.ApiToken = GenerateApiToken();
        user.LastSeenAt = Utils.GetCurrentTimestamp();
        await _repository.Update(user);
        return user;
    }

    public async Task<User> Me(string id)
    {
        var user =
            await _repository.GetById(id)
            ?? throw new ApiException("errors.userNotFound");
        return user;
    }

    private static string GenerateAuthToken() => Random.Shared.Next(100_000, 999_999).ToString();

    private static string GenerateApiToken() =>
        Convert.ToBase64String(Guid.NewGuid().ToByteArray());
}
