using MongoDB.Driver;

namespace StepUpServer.Domains.Log;

public interface ILogRepository
{
    Task<Log> Create(Log log);
    Task<IEnumerable<Log>> ReadByUserId(string id, int skip, int take);
    Task<IEnumerable<Log>> ReadAll(int skip, int take);
}

public class LogRepository : ILogRepository
{
    private readonly IMongoCollection<Log> _collection;

    public LogRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<Log>("Logs");

        var userIdIndex = Builders<Log>.IndexKeys.Ascending(log => log.UserId);

        _collection.Indexes.CreateOneAsync(
            new CreateIndexModel<Log>(
                userIdIndex,
                new CreateIndexOptions { Background = true }
            )
        );
    }

    public async Task<Log> Create(Log log)
    {
        await _collection.InsertOneAsync(log);
        return log;
    }

    public async Task<IEnumerable<Log>> ReadByUserId(string id, int skip, int take)
    {
        return await _collection
            .Find(log => log.UserId == id)
            .Skip(skip)
            .Limit(take)
            .ToListAsync();
    }

    public async Task<IEnumerable<Log>> ReadAll(int skip, int take)
    {
        return await _collection
            .Find(_ => true)
            .Skip(skip)
            .Limit(take)
            .ToListAsync();
    }
}
