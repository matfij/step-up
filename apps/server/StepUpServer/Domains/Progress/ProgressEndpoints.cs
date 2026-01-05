using StepUpServer.Common;

namespace StepUpServer.Domains.Progress;

public static class ProgressEndpoints
{
    public static void MapProgressEndpoints(this WebApplication app)
    {
        app.MapGet(
                "/progressByUserId/{userId}",
                async (string userId, IProgressService progressService) =>
                {
                    var progress = await progressService.GetByUser(userId);
                    return Results.Ok(progress);
                }
            )
            .WithMetadata(new RequireAuthAttribute());
    }
}
