using StepUpServer.Common;

namespace StepUpServer.Domains.Achievements;

public static class AchievementsEndpoints
{
    public static void MapAchievementsEndpoints(this WebApplication app)
    {
        app.MapGet(
                "/achievements/byUserId/{userId}",
                async (string userId, IAchievementsService achievementsService) =>
                {
                    var achievements = await achievementsService.GetByUser(userId);
                    return Results.Ok(
                        new AchievementsProgressResponse
                        {
                            Id = achievements.Id,
                            UserId = achievements.UserId,
                            Achievements = achievements.Achievements,
                        }
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());
    }
}
