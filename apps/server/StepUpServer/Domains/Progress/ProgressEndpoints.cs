using StepUpServer.Common;

namespace StepUpServer.Domains.Progress;

public static class ProgressEndpoints
{
    public static void MapProgressEndpoints(this WebApplication app)
    {
        app.MapGet(
                "/progress/byUserId/{userId}",
                async (string userId, IProgressService progressService) =>
                {
                    var progress = await progressService.GetByUser(userId);
                    return Results.Ok(
                        new ProgressResponse
                        {
                            Id = progress.Id,
                            UserId = progress.UserId,
                            Username = progress.Username,
                            Level = progress.Level,
                            Experience = progress.Experience,
                            CurrentStreak = progress.CurrentStreak,
                            BestStreak = progress.BestStreak,
                            TotalDuration = progress.TotalDuration,
                            TotalDistance = progress.TotalDistance,
                            TotalActivities = progress.TotalActivities,
                            MonthlyDuration = progress.MonthlyDuration,
                            MonthlyDistance = progress.MonthlyDistance,
                        }
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/progress/bestDuration",
                async (IProgressService progressService) =>
                {
                    var progresses = await progressService.GetBestDuration();
                    return Results.Ok(
                        progresses.Select(
                            progress =>
                                new ProgressResponse
                                {
                                    Id = progress.Id,
                                    UserId = progress.UserId,
                                    Username = progress.Username,
                                    Level = progress.Level,
                                    Experience = progress.Experience,
                                    CurrentStreak = progress.CurrentStreak,
                                    BestStreak = progress.BestStreak,
                                    TotalDuration = progress.TotalDuration,
                                    TotalDistance = progress.TotalDistance,
                                    TotalActivities = progress.TotalActivities,
                                    MonthlyDuration = progress.MonthlyDuration,
                                    MonthlyDistance = progress.MonthlyDistance,
                                }
                        )
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/progress/bestDistance",
                async (IProgressService progressService) =>
                {
                    var progresses = await progressService.GetBestDistance();
                    return Results.Ok(
                        progresses.Select(
                            progress =>
                                new ProgressResponse
                                {
                                    Id = progress.Id,
                                    UserId = progress.UserId,
                                    Username = progress.Username,
                                    Level = progress.Level,
                                    Experience = progress.Experience,
                                    CurrentStreak = progress.CurrentStreak,
                                    BestStreak = progress.BestStreak,
                                    TotalDuration = progress.TotalDuration,
                                    TotalDistance = progress.TotalDistance,
                                    TotalActivities = progress.TotalActivities,
                                    MonthlyDuration = progress.MonthlyDuration,
                                    MonthlyDistance = progress.MonthlyDistance,
                                }
                        )
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/progress/bestMonthlyDuration",
                async (IProgressService progressService) =>
                {
                    var progresses = await progressService.GetBestMonthlyDuration();
                    return Results.Ok(
                        progresses.Select(
                            progress =>
                                new ProgressResponse
                                {
                                    Id = progress.Id,
                                    UserId = progress.UserId,
                                    Username = progress.Username,
                                    Level = progress.Level,
                                    Experience = progress.Experience,
                                    CurrentStreak = progress.CurrentStreak,
                                    BestStreak = progress.BestStreak,
                                    TotalDuration = progress.TotalDuration,
                                    TotalDistance = progress.TotalDistance,
                                    TotalActivities = progress.TotalActivities,
                                    MonthlyDuration = progress.MonthlyDuration,
                                    MonthlyDistance = progress.MonthlyDistance,
                                }
                        )
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/progress/bestMonthlyDistance",
                async (IProgressService progressService) =>
                {
                    var progresses = await progressService.GetBestMonthlyDistance();
                    return Results.Ok(
                        progresses.Select(
                            progress =>
                                new ProgressResponse
                                {
                                    Id = progress.Id,
                                    UserId = progress.UserId,
                                    Username = progress.Username,
                                    Level = progress.Level,
                                    Experience = progress.Experience,
                                    CurrentStreak = progress.CurrentStreak,
                                    BestStreak = progress.BestStreak,
                                    TotalDuration = progress.TotalDuration,
                                    TotalDistance = progress.TotalDistance,
                                    TotalActivities = progress.TotalActivities,
                                    MonthlyDuration = progress.MonthlyDuration,
                                    MonthlyDistance = progress.MonthlyDistance,
                                }
                        )
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());
    }
}
