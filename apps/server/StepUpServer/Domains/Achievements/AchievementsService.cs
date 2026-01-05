using StepUpServer.Common;
using StepUpServer.Common.Events;

namespace StepUpServer.Domains.Achievements;

public interface IAchievementsService
{
    public Task<AchievementsProgress> GetByUser(string userId);
}

public class AchievementsService(IAchievementsRepository repository)
    : IAchievementsService,
        IEventHandler<UserCreatedEvent>,
        IEventHandler<ProgressUpdatedEvent>
{
    private readonly IAchievementsRepository _repository = repository;

    public async Task<AchievementsProgress> GetByUser(string userId)
    {
        var achievements =
            await _repository.GetByUserId(userId)
            ?? throw new ApiException("errors.achievementsNotFound");

        return new AchievementsProgress
            {
            Id = achievements.Id,
            UserId = achievements.UserId,
            TotalDistance = new AchievementProgress
            {
                Tier = achievements.TotalDistance.Tier,
                Progress = achievements.TotalDistance.Progress,
                NextTierProgress = AchievementsData.GetNextTier(
                    AchievementsData.TotalDistanceThresholds,
                    achievements.TotalDistance.Tier
                ).requirement,
                AchievedAt = achievements.TotalDistance.AchievedAt,
            },
            TotalDuration = new AchievementProgress
            {
                Tier = achievements.TotalDuration.Tier,
                Progress = achievements.TotalDuration.Progress,
                NextTierProgress = AchievementsData.GetNextTier(
                    AchievementsData.TotalDurationThresholds,
                    achievements.TotalDuration.Tier
                ).requirement,
                AchievedAt = achievements.TotalDuration.AchievedAt,
            },
            TotalActivities = new AchievementProgress
            {
                Tier = achievements.TotalActivities.Tier,
                Progress = achievements.TotalActivities.Progress,
                NextTierProgress = AchievementsData.GetNextTier(
                    AchievementsData.TotalActivitiesThresholds,
                    achievements.TotalActivities.Tier
                ).requirement,
                AchievedAt = achievements.TotalActivities.AchievedAt,
            },
            MaxCurrentStreak = new AchievementProgress
            {
                Tier = achievements.MaxCurrentStreak.Tier,
                Progress = achievements.MaxCurrentStreak.Progress,
                NextTierProgress = AchievementsData.GetNextTier(
                    AchievementsData.MaxCurrentStreakThresholds,
                    achievements.MaxCurrentStreak.Tier
                ).requirement,
                AchievedAt = achievements.MaxCurrentStreak.AchievedAt,
            },
            MaxActivitySpeed = new AchievementProgress
            {
                Tier = achievements.MaxActivitySpeed.Tier,
                Progress = achievements.MaxActivitySpeed.Progress,
                NextTierProgress = AchievementsData.GetNextTier(
                    AchievementsData.MaxActivitySpeedTrasholds,
                    achievements.MaxActivitySpeed.Tier
                ).requirement,
                AchievedAt = achievements.MaxActivitySpeed.AchievedAt,
            },
            MaxActivityDistance = new AchievementProgress
            {
                Tier = achievements.MaxActivityDistance.Tier,
                Progress = achievements.MaxActivityDistance.Progress,
                NextTierProgress = AchievementsData.GetNextTier(
                    AchievementsData.MaxActivityDistanceThreshold,
                    achievements.MaxActivityDistance.Tier
                ).requirement,
                AchievedAt = achievements.MaxActivityDistance.AchievedAt,
            },
            Greenhorn = new AchievementProgress
            {
                Tier = achievements.Greenhorn.Tier,
                Progress = achievements.Greenhorn.Progress,
                AchievedAt = achievements.Greenhorn.AchievedAt,
            },
            Marathoner = new AchievementProgress
            {
                Tier = achievements.Marathoner.Tier,
                Progress = achievements.Marathoner.Progress,
                AchievedAt = achievements.Marathoner.AchievedAt,
            },
        };
    }

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
            achievements.Greenhorn.Tier == AchievementTier.None
            && progressEvent.ActivityDistance >= AchievementsData.GreenhornThreshold
        )
        {
            achievements.Greenhorn.Tier = AchievementTier.Achieved;
            achievements.Greenhorn.AchievedAt = Utils.GetCurrentTimestamp();
        }
        if (
            achievements.Marathoner.Tier == AchievementTier.None
            && progressEvent.ActivityDistance >= AchievementsData.MarathonerThreshold
        )
        {
            achievements.Marathoner.Tier = AchievementTier.Achieved;
            achievements.Marathoner.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.Marathoner.Progress = Math.Max(
            progressEvent.ActivityDistance,
            achievements.Marathoner.Progress
        );

        var newMaxActivitySpeedTier = AchievementsData.CalculateTier(
            AchievementsData.MaxActivitySpeedTrasholds,
            progressEvent.ActivityAverageSpeed
        );
        if (
            progressEvent.ActivityDistance >= AchievementsData.MaxActivitySpeedRequiredDistance
            && newMaxActivitySpeedTier > achievements.MaxActivitySpeed.Tier
        )
        {
            achievements.MaxActivitySpeed.Tier = newMaxActivitySpeedTier;
            achievements.MaxActivitySpeed.AchievedAt = Utils.GetCurrentTimestamp();
        }
        if (progressEvent.ActivityDistance >= AchievementsData.MaxActivitySpeedRequiredDistance)
        {
            achievements.MaxActivitySpeed.Progress = Math.Max(
                progressEvent.ActivityAverageSpeed,
                achievements.MaxActivitySpeed.Progress
            );
        }

        var newMaxActivityDistanceTier = AchievementsData.CalculateTier(
            AchievementsData.MaxActivityDistanceThreshold,
            progressEvent.ActivityDistance
        );
        if (newMaxActivityDistanceTier > achievements.MaxActivityDistance.Tier)
        {
            achievements.MaxActivityDistance.Tier = newMaxActivityDistanceTier;
            achievements.MaxActivityDistance.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.MaxActivityDistance.Progress = Math.Max(
            progressEvent.ActivityDistance,
            achievements.MaxActivityDistance.Progress
        );

        // cumulative, monotonic achievements
        var newTotalDistanceTier = AchievementsData.CalculateTier(
            AchievementsData.TotalDistanceThresholds,
            progressEvent.TotalDistance
        );
        if (newTotalDistanceTier > achievements.TotalDistance.Tier)
        {
            achievements.TotalDistance.Tier = newTotalDistanceTier;
            achievements.TotalDistance.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.TotalDistance.Progress = progressEvent.TotalDistance;

        var newTotalDurationTier = AchievementsData.CalculateTier(
            AchievementsData.TotalDurationThresholds,
            progressEvent.TotalDuration
        );
        if (newTotalDurationTier > achievements.TotalDuration.Tier)
        {
            achievements.TotalDuration.Tier = newTotalDurationTier;
            achievements.TotalDuration.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.TotalDuration.Progress = progressEvent.TotalDuration;

        var newTotalActivitiesTier = AchievementsData.CalculateTier(
            AchievementsData.TotalActivitiesThresholds,
            progressEvent.TotalActivities
        );
        if (newTotalActivitiesTier > achievements.TotalActivities.Tier)
        {
            achievements.TotalActivities.Tier = newTotalActivitiesTier;
            achievements.TotalActivities.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.TotalActivities.Progress = progressEvent.TotalActivities;

        // non-monotonic achievements
        var newMaxCurrentStreakTier = AchievementsData.CalculateTier(
            AchievementsData.MaxCurrentStreakThresholds,
            progressEvent.CurrentStreak
        );
        if (newMaxCurrentStreakTier > achievements.MaxCurrentStreak.Tier)
        {
            achievements.MaxCurrentStreak.Tier = newMaxCurrentStreakTier;
            achievements.MaxCurrentStreak.AchievedAt = Utils.GetCurrentTimestamp();
        }
        achievements.MaxCurrentStreak.Progress = Math.Max(
            progressEvent.CurrentStreak,
            achievements.MaxCurrentStreak.Progress
        );

        await _repository.Update(achievements);
    }
}
