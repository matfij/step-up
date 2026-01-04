using MongoDB.Driver;

namespace StepUpServer.Domains.Achievements;

public interface IAchievementsRepository
{
    Task<Achievements> Create(Achievements achievements);
    Task<Achievements?> GetById(string id);
    Task<Achievements?> GetByUserId(string userId);
    Task<Achievements> Update(Achievements achievements);
}

public class AchievementsRepository : IAchievementsRepository
{
    private readonly IMongoCollection<Achievements> _collection;

    public AchievementsRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<Achievements>("Achievements");

        var userIdIndex = Builders<Achievements>.IndexKeys.Ascending(a => a.UserId);

        _collection.Indexes.CreateOneAsync(
            new CreateIndexModel<Achievements>(
                userIdIndex,
                new CreateIndexOptions { Unique = true, Background = true }
            )
        );
    }

    public async Task<Achievements> Create(Achievements achievements)
    {
        await _collection.InsertOneAsync(achievements);
        return achievements;
    }

    public async Task<Achievements?> GetById(string id)
    {
        return await _collection.Find(a => a.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Achievements?> GetByUserId(string userId)
    {
        return await _collection.Find(a => a.UserId == userId).FirstOrDefaultAsync();
    }

    public async Task<Achievements> Update(Achievements achievements)
    {
        await _collection.ReplaceOneAsync(a => a.Id == achievements.Id, achievements);
        return achievements;
    }
}
