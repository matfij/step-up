using StepUpServer.Common;
using StepUpServer.Common.Events;

namespace StepUpServer.Domains.Achievements;

public interface IAchievementsService
{
    // Define service methods here
}

public class AchievementsService(IAchievementsRepository repository)
    : IAchievementsService,
        IEventHandler<UserCreatedEvent>,
        IEventHandler<ProgressUpdatedEvent>
{
    private readonly IAchievementsRepository _repository = repository;

    public async Task HandleAsync(UserCreatedEvent userEvent)
    {
        var progress = new Achievements { Id = Utils.GenerateId(), UserId = userEvent.UserId };

        await _repository.Create(progress);
    }

    public async Task HandleAsync(ProgressUpdatedEvent progressEvent)
    {
        var achievements =
            await _repository.GetByUserId(progressEvent.UserId)
            ?? throw new ApiException("errors.achievementsNotFound");

        // single-activity achievements
        if (
            achievements.Marathonner.Tier == AchievementTier.None
            && progressEvent.ActivityDistance >= AchievementsData.MarathonnerThreshold
        )
        {
            achievements.Marathonner.Tier = AchievementTier.Achieved;
            achievements.Marathonner.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.Marathonner.Progress = Math.Max(
            progressEvent.ActivityDistance,
            achievements.Marathonner.Progress
        );

        var newSwiftTier = AchievementsData.CalculateTier(
            AchievementsData.SwiftThresholds,
            progressEvent.ActivityAverageSpeed
        );
        if (
            progressEvent.ActivityDistance >= AchievementsData.MinSwiftDistance
            && newSwiftTier > achievements.Swift.Tier
        )
        {
            achievements.Swift.Tier = newSwiftTier;
            achievements.Swift.AchievedAt = Utils.GetCurrentTimestamp();
        }
        if (progressEvent.ActivityDistance >= AchievementsData.MinSwiftDistance)
        {
            achievements.Swift.Progress = Math.Max(
                progressEvent.ActivityAverageSpeed,
                achievements.Swift.Progress
            );
        }

        var newSteadfastTier = AchievementsData.CalculateTier(
            AchievementsData.SteadfastThresholds,
            progressEvent.ActivityDistance
        );
        if (newSteadfastTier > achievements.Steadfast.Tier)
        {
            achievements.Steadfast.Tier = newSteadfastTier;
            achievements.Steadfast.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.Steadfast.Progress = Math.Max(
            progressEvent.ActivityDistance,
            achievements.Steadfast.Progress
        );

        // cumulative, monotonic achievements
        var newTravelerTier = AchievementsData.CalculateTier(
            AchievementsData.TravelerThresholds,
            progressEvent.TotalDistance
        );
        if (newTravelerTier > achievements.Traveler.Tier)
        {
            achievements.Traveler.Tier = newTravelerTier;
            achievements.Traveler.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.Traveler.Progress = progressEvent.TotalDistance;

        var newEnduringTier = AchievementsData.CalculateTier(
            AchievementsData.EnduringThresholds,
            progressEvent.TotalDuration
        );
        if (newEnduringTier > achievements.Enduring.Tier)
        {
            achievements.Enduring.Tier = newEnduringTier;
            achievements.Enduring.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.Enduring.Progress = progressEvent.TotalDuration;

        var newCumulativeTier = AchievementsData.CalculateTier(
            AchievementsData.CumulativeThresholds,
            progressEvent.TotalActivities
        );
        if (newCumulativeTier > achievements.Cumulative.Tier)
        {
            achievements.Cumulative.Tier = newCumulativeTier;
            achievements.Cumulative.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.Cumulative.Progress = progressEvent.TotalActivities;

        // non-monotonic achievements
        var newConsistentTier = AchievementsData.CalculateTier(
            AchievementsData.ConsistentThresholds,
            progressEvent.CurrentStreak
        );
        if (newConsistentTier > achievements.Consistent.Tier)
        {
            achievements.Consistent.Tier = newConsistentTier;
            achievements.Consistent.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.Consistent.Progress = Math.Max(
            progressEvent.CurrentStreak,
            achievements.Consistent.Progress
        );

        await _repository.Update(achievements);
    }
}
