using System.Text.RegularExpressions;
using StepUpServer.Common;

namespace StepUpServer.Users;

public interface IUserValidator
{
    public Task ValidateEmail(string email);

    public Task ValidateUsername(string username);
}

public partial class UserValidator(IUserRepository _repository) : IUserValidator
{
    public const int EmailMaxLength = 255;

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    private static partial Regex EmailPattern();

    public const int UsernameMinLength = 4;
    public const int UsernameMaxLength = 16;

    public async Task ValidateEmail(string email)
    {
        if (email.Length > EmailMaxLength || !EmailPattern().IsMatch(email))
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
            throw new ApiException("errors.emailNotUnique", nameof(username));
        }
    }
}
