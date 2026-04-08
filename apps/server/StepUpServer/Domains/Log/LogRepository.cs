using MongoDB.Driver;

namespace StepUpServer.Domains.Log;

public interface ILogRepository
{
    Task<Log> Create(Log log);
    Task<IEnumerable<Log>> ReadByUserId(string id);
    Task<IEnumerable<Log>> ReadAll();
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
                new CreateIndexOptions { Unique = true, Background = true }
            )
        );
    }

    public async Task<Log> Create(Log log)
    {
        await _collection.InsertOneAsync(log);
        return log;
    }

    public async Task<IEnumerable<Log>> ReadByUserId(string id)
    {
        return await _collection.Find(log => log.UserId == id).ToListAsync();
    }

    public Task<IEnumerable<Log>> ReadAll()
    {
        return _collection.Find(_ => true).ToListAsync().ContinueWith(t => t.Result.AsEnumerable());
    }
}
