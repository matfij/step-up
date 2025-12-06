namespace StepUpServer.Users;

public interface IUserService
{
    Task<User> StartRegister(string email, string username);
    Task<User> CompleteRegister(string email, string username);
}

public class UserService(IUserRepository repository) : IUserService
{
    private readonly IUserRepository _repository = repository;

    public async Task<User> StartRegister(string email, string username)
    {
        var authToken = Random.Shared.NextInt64(100000, 999999).ToString();
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            Username = username,
            IsConfirmed = false,
            AuthToken = authToken
        };
        await _repository.Create(user);

        // TODO: Send authToken to user's email

        return user;
    }

    public async Task<User> CompleteRegister(string email, string authCode)
    {
        var user = await _repository.GetByEmail(email) ?? throw new Exception("User not found");
        if(user.AuthToken != authCode)
        {
            throw new Exception("Invalid auth code");
        }
        user.AuthToken = null;
        user.ApiToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        user.IsConfirmed = true;
        await _repository.Update(user);
        return user;
    }
}
