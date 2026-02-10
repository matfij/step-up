using MongoDB.Driver;

namespace StepUpServer.Domains.Follower;

public interface IFollowerRepository
{
    Task<Follower> Create(Follower follower);
    Task<Follower?> GetById(string id);
    Task<List<Follower>> GetFollowers(string userId);
    Task<List<Follower>> GetFollowing(string userId);
    Task Delete(string id);
}

public class FollowerRepository : IFollowerRepository
{
    private readonly IMongoCollection<Follower> _collection;

    public FollowerRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<Follower>("Followers");

        var followerIndex = Builders<Follower>.IndexKeys.Ascending(f => f.FollowerId);
        var followingIndex = Builders<Follower>.IndexKeys.Ascending(f => f.FollowingId);

        _collection.Indexes.CreateOneAsync(
            new CreateIndexModel<Follower>(
                followerIndex,
                new CreateIndexOptions { Background = true }
            )
        );
        _collection.Indexes.CreateOneAsync(
            new CreateIndexModel<Follower>(
                followingIndex,
                new CreateIndexOptions { Background = true }
            )
        );
    }

    public async Task<Follower> Create(Follower follower)
    {
        await _collection.InsertOneAsync(follower);
        return follower;
    }

    public async Task<Follower?> GetById(string id)
    {
        return await _collection.Find(f => f.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<Follower>> GetFollowers(string userId)
    {
        return await _collection.Find(f => f.FollowingId == userId).ToListAsync();
    }

    public async Task<List<Follower>> GetFollowing(string userId)
    {
        return await _collection.Find(f => f.FollowerId == userId).ToListAsync();
    }

    public async Task Delete(string id)
    {
        await _collection.DeleteOneAsync(f => f.Id == id);
    }
}
