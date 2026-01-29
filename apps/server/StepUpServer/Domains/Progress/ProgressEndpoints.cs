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
                    return Results.Ok(progress);
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/progress/bestDuration",
                async (IProgressService progressService) =>
                {
                    var progresses = await progressService.GetBestDuration();
                    return Results.Ok(progresses);
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/progress/bestDistance",
                async (IProgressService progressService) =>
                {
                    var progresses = await progressService.GetBestDistance();
                    return Results.Ok(progresses);
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/progress/bestMonthlyDuration",
                async (IProgressService progressService) =>
                {
                    var progresses = await progressService.GetBestMonthlyDuration();
                    return Results.Ok(progresses);
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/progress/bestMonthlyDistance",
                async (IProgressService progressService) =>
                {
                    var progresses = await progressService.GetBestMonthlyDistance();
                    return Results.Ok(progresses);
                }
            )
            .WithMetadata(new RequireAuthAttribute());
    }
}
