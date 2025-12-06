using MongoDB.Driver;

namespace StepUpServer.Users;

public interface IUserRepository
{
    Task<User> Create(User user);
    Task<User?> GetById(string id);
    Task<User?> GetByEmail(string email);
    Task<User> Update(User user);
}

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("Users");
    }

    public async Task<User> Create(User user)
    {
        await _users.InsertOneAsync(user);
        return user;
    }

    public Task<User?> GetById(string id)
    {
        throw new NotImplementedException();
    }

    public Task<User?> GetByEmail(string email)
    {
        throw new NotImplementedException();
    }

    public Task<User> Update(User user)
    {
        throw new NotImplementedException();
    }
}
