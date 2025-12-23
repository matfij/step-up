using MongoDB.Driver;

namespace StepUpServer.Domains.Progress;

public interface IProgressRepository
{
    Task<Progress> Create(Progress progress);
    Task<Progress?> GetById(string id);
    Task<Progress?> GetByUserId(string userId);
    Task<Progress> Update(Progress progress);
}

public class ProgressRepository : IProgressRepository
{
    private readonly IMongoCollection<Progress> _collection;

    public ProgressRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<Progress>("Progress");

        var userIdIndex = Builders<Progress>.IndexKeys.Ascending(p => p.UserId);

        _collection.Indexes.CreateOneAsync(
            new CreateIndexModel<Progress>(
                userIdIndex,
                new CreateIndexOptions { Unique = true, Background = true }
            )
        );
    }

    public async Task<Progress> Create(Progress progress)
    {
        await _collection.InsertOneAsync(progress);
        return progress;
    }

    public async Task<Progress?> GetById(string id)
    {
        return await _collection.Find(p => p.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Progress?> GetByUserId(string userId)
    {
        return await _collection.Find(p => p.UserId == userId).FirstOrDefaultAsync();
    }

    public async Task<Progress> Update(Progress progress)
    {
        await _collection.ReplaceOneAsync(p => p.Id == progress.Id, progress);
        return progress;
    }
}
