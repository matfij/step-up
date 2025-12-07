using MongoDB.Driver;
using StepUpServer.Common;

namespace StepUpServer.Users;

public interface IUserRepository
{
    Task<User> Create(User user);
    Task<User?> GetById(string id);
    Task<User?> GetByEmail(string email);
    Task<User?> GetByUsername(string username);
    Task<User?> GetByApiToken(string apiToken);
    Task<User> Update(User user);
}

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("Users");

        var emailIndex = Builders<User>.IndexKeys.Ascending(u => u.Email);
        var usernameIndex = Builders<User>.IndexKeys.Ascending(u => u.Username);

        _users.Indexes.CreateOneAsync(
            new CreateIndexModel<User>(
                emailIndex,
                new CreateIndexOptions { Unique = true, Background = true }
            )
        );
        _users.Indexes.CreateOneAsync(
            new CreateIndexModel<User>(
                usernameIndex,
                new CreateIndexOptions { Unique = true, Background = true }
            )
        );
    }

    public async Task<User> Create(User user)
    {
        await _users.InsertOneAsync(user);
        return user;
    }

    public async Task<User?> GetById(string id)
    {
        return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByEmail(string email)
    {
        return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByUsername(string username)
    {
        return await _users.Find(u => u.Username == username).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByApiToken(string apiToken)
    {
        return await _users
            .Find(u => u.ApiToken == apiToken && u.IsConfirmed == true)
            .FirstOrDefaultAsync();
    }

    public async Task<User> Update(User user)
    {
        var result = await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
        if (result.MatchedCount == 0)
        {
            throw new ApiException("User not found", ApiErrorCode.NotFound);
        }
        return user;
    }
}
