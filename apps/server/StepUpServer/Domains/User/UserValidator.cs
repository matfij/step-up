using System.Text.RegularExpressions;
using StepUpServer.Common;

namespace StepUpServer.Domains.User;

public interface IUserValidator
{
    public Task<User> EnsureEmailExists(string email);

    public Task ValidateEmail(string email);

    public Task ValidateUsername(string username);

    void EnsureIsNotConfirmed(User user);

    void EnsureIsConfirmed(User user);

    void EnsureAuthTokenIsValid(User user, string authToken);
}

public partial class UserValidator(IUserRepository _repository) : IUserValidator
{
    private const int _emailMaxLength = 255;

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    private static partial Regex EmailPattern();

    public const int UsernameMinLength = 4;
    public const int UsernameMaxLength = 16;

    public async Task<User> EnsureEmailExists(string email)
    {
        var user =
             await _repository.GetByEmail(email)
             ?? throw new ApiException("errors.userNotFound");
        return user;
    }

    public async Task ValidateEmail(string email)
    {
        if (email.Length > _emailMaxLength || !EmailPattern().IsMatch(email))
        {
            throw new ApiException("errors.emailInvalid", nameof(email));
        }

        var userWithSameEmail = await _repository.GetByEmail(email);

        if (userWithSameEmail is not null)
        {
            throw new ApiException("errors.emailNotUnique", nameof(email));
        }
    }

    public async Task ValidateUsername(string username)
    {
        if (username.Length < UsernameMinLength || username.Length > UsernameMaxLength)
        {
            throw new ApiException("errors.usernameInvalid", nameof(username));
        }

        var userWithSameUsername = await _repository.GetByUsername(username);

        if (userWithSameUsername is not null)
        {
            throw new ApiException("errors.usernameNotUnique", nameof(username));
        }
    }

    public void EnsureIsNotConfirmed(User user)
    {
        if (user.IsConfirmed)
        {
            throw new ApiException("errors.userAlreadyConfirmed");
        }
    }

    public void EnsureIsConfirmed(User user)
    {
        if (!user.IsConfirmed)
        {
            throw new ApiException("errors.userNotConfirmed");
        }
    }

    public void EnsureAuthTokenIsValid(User user, string authToken)
    {
        if (user.AuthToken != authToken)
        {
            throw new ApiException("errors.authTokenNotValid", nameof(authToken));
        }
    }
}
