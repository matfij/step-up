using MongoDB.Driver;
using StepUpServer.Common;

namespace StepUpServer.Domains.Activity;

public interface IActivityRepository
{
    Task<Activity> Create(Activity activity);
    Task<Activity?> GetById(string id);
    Task<Activity[]> GetByUserId(string userId, int skip, int take);
    Task<Activity> Update(Activity activity);
}

public class ActivityRepository : IActivityRepository
{
    private readonly IMongoCollection<Activity> _activities;

    public ActivityRepository(IMongoDatabase database)
    {
        _activities = database.GetCollection<Activity>("Activities");

        var userIdIndex = Builders<Activity>.IndexKeys.Ascending(a => a.UserId);

        _activities.Indexes.CreateOneAsync(
            new CreateIndexModel<Activity>(
                userIdIndex,
                new CreateIndexOptions { Background = true }
            )
        );
    }

    public async Task<Activity> Create(Activity activity)
    {
        await _activities.InsertOneAsync(activity);
        return activity;
    }

    public async Task<Activity?> GetById(string id)
    {
        return await _activities.Find(a => a.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Activity[]> GetByUserId(string userId, int skip, int take)
    {
        var query = _activities
            .Find(a => a.UserId == userId)
            .SortByDescending(a => a.StartTime)
            .Skip(skip)
            .Limit(take);
        return [.. await query.ToListAsync()];
    }

    public async Task<Activity> Update(Activity activity)
    {
        var result = await _activities.ReplaceOneAsync(u => u.Id == activity.Id, activity);
        if (result.MatchedCount == 0)
        {
            throw new ApiException("errors.activityNotFound");
        }
        return activity;
    }
}
