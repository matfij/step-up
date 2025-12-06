using System.Text.RegularExpressions;
using StepUpServer.Common;

namespace StepUpServer.Users;

public interface IUserService
{
    Task<User> StartRegister(string email, string username);
    Task<User> CompleteRegister(string email, string username);
}

public partial class UserService(IUserRepository repository, IUserValidator validator)
    : IUserService
{
    private readonly IUserRepository _repository = repository;
    private readonly IUserValidator _validator = validator;

    public async Task<User> StartRegister(string email, string username)
    {
        await _validator.ValidateEmail(email);
        await _validator.ValidateUsername(username);
        var authToken = Random.Shared.NextInt64(100000, 999999).ToString();
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            Username = username,
            IsConfirmed = false,
            AuthToken = authToken,
        };
        await _repository.Create(user);
        // TODO: Send authToken to user's email
        return user;
    }

    public async Task<User> CompleteRegister(string email, string authCode)
    {
        var user =
            await _repository.GetByEmail(email)
            ?? throw new ApiException("User not found", ApiErrorCode.NotFound);
        if (user.AuthToken != authCode)
        {
            throw new ApiException("Invalid auth code", ApiErrorCode.InvalidAuthCode);
        }
        user.AuthToken = null;
        user.ApiToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        user.IsConfirmed = true;
        await _repository.Update(user);
        return user;
    }
}
