using MongoDB.Driver;
using StepUpServer.Common;

namespace StepUpServer.Domains.Follower;

public interface IFollowerRepository
{
    Task<Follower> Create(Follower follower);
    Task<Follower?> GetById(string id);
    Task<Follower?> GetByFollowerAndFollowing(string followerId, string followingId);
    Task<List<Follower>> GetFollowers(string userId);
    Task<List<Follower>> GetFollowing(string userId);
    Task<Follower> Update(Follower follower);
    Task SyncFollowerSnapshot(string userId, string username, string? avatarUri);
    Task SyncFollowingSnapshot(string userId, string username, string? avatarUri);
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

    public async Task<Follower?> GetByFollowerAndFollowing(string followerId, string followingId)
    {
        var filter = Builders<Follower>.Filter.Eq(f => f.FollowerId, followerId)
            & Builders<Follower>.Filter.Eq(f => f.FollowingId, followingId);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<Follower>> GetFollowers(string userId)
    {
        return await _collection.Find(f => f.FollowingId == userId).ToListAsync();
    }

    public async Task<List<Follower>> GetFollowing(string userId)
    {
        return await _collection.Find(f => f.FollowerId == userId).ToListAsync();
    }

    public async Task<Follower> Update(Follower follower)
    {
        var result = await _collection.ReplaceOneAsync(f => f.Id == follower.Id, follower);
        if (result.MatchedCount == 0)
        {
            throw new ApiException("errors.followerNotFound");
        }
        return follower;
    }

    public async Task SyncFollowingSnapshot(string userId, string username, string? avatarUri)
    {
        var filter = Builders<Follower>.Filter.Eq(follower => follower.FollowingId, userId);
        var update = Builders<Follower>.Update
            .Set(follower => follower.FollowingUsername, username)
            .Set(follower => follower.FollowingAvatarUri, avatarUri);
        await _collection.UpdateManyAsync(filter, update);
    }

    public async Task SyncFollowerSnapshot(string userId, string username, string? avatarUri)
    {
        var filter = Builders<Follower>.Filter.Eq(f => f.FollowerId, userId);
        var update = Builders<Follower>.Update
            .Set(f => f.FollowerUsername, username)
            .Set(f => f.FollowerAvatarUri, avatarUri);
        await _collection.UpdateManyAsync(filter, update);
    }

    public async Task Delete(string id)
    {
        await _collection.DeleteOneAsync(f => f.Id == id);
    }
}
