using StepUpServer.Common;
using StepUpServer.Common.Events;

namespace StepUpServer.Domains.Progress;

public interface IProgressService
{
    Task<Progress> GetByUser(string userId);
}

public class ProgressService(IProgressRepository repository, IEventPublisher publisher)
    : IProgressService,
        IEventHandler<UserCreatedEvent>,
        IEventHandler<ActivityCreatedEvent>
{
    private readonly IProgressRepository _repository = repository;
    private readonly IEventPublisher _publisher = publisher;

    private const ulong _nextLevelExpGain = 100;

    public async Task<Progress> GetByUser(string userId)
    {
        var progress =
            await _repository.GetByUserId(userId)
            ?? throw new ApiException("errors.progressNotFound");
        return progress;
    }

    public async Task HandleAsync(UserCreatedEvent userEvent)
    {
        var progress = new Progress { Id = Utils.GenerateId(), UserId = userEvent.UserId };

        await _repository.Create(progress);
    }

    public async Task HandleAsync(ActivityCreatedEvent activityEvent)
    {
        var progress =
            await _repository.GetByUserId(activityEvent.UserId)
            ?? throw new ApiException("errors.progressNotFound");

        progress.TotalActivities += 1;
        progress.TotalDuration += activityEvent.Duration;
        progress.TotalDistance += activityEvent.Distance;

        var currentActivityDate = DateTimeOffset.FromUnixTimeMilliseconds((long)activityEvent.StartTime).Date;

        if (activityEvent.LastActivityStartTime != 0)
        {
            var lastActivityDate = DateTimeOffset.FromUnixTimeMilliseconds((long)activityEvent.LastActivityStartTime).Date;
            var daysDifference = (currentActivityDate - lastActivityDate).Days;
            progress.CurrentStreak = daysDifference switch
            {
                0 => progress.CurrentStreak,      // Same day - keep current
                1 => progress.CurrentStreak + 1,  // Next day - increment
                _ => 1                            // Gap - reset
            };
        }
        else
        {
            progress.CurrentStreak = 1;
        }
        progress.BestStreak = Math.Max(progress.BestStreak, progress.CurrentStreak);

        var expGain = (ulong)(activityEvent.Duration / 60_000f + activityEvent.Distance / 100f);
        progress.Experience += expGain;
        progress.Level = CalculateLevel(progress.Experience);

        await _repository.Update(progress);

        await _publisher.PublishAsync(new ProgressUpdatedEvent
        {
            UserId = activityEvent.UserId,
            ActivityDuration = activityEvent.Duration,
            ActivityDistance = activityEvent.Distance,
            ActivityAverageSpeed = activityEvent.AverageSpeed,
            TotalDistance = progress.TotalDistance,
            TotalDuration = progress.TotalDuration,
            TotalActivities = progress.TotalActivities,
            CurrentStreak = progress.CurrentStreak
        });
    }

    private uint CalculateLevel(ulong experience)
    {
        var level = 1u;
        ulong nextLevelExp = _nextLevelExpGain;

        while (experience >= nextLevelExp)
        {
            level++;
            experience -= nextLevelExp;
            nextLevelExp += _nextLevelExpGain;
        }

        return level;
    }
}
