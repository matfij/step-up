using StepUpServer.Common;

namespace StepUpServer.Domains.Progress;

public static class ProgressEndpoints
{
    public static void MapProgressEndpoints(this WebApplication app)
    {
        app.MapGet(
                "/progress",
                async (HttpContext context, IProgressService progressService) =>
                {
                    var userId = context.GetUserId();
                    var progress = await progressService.GetByUser(userId);
                    return Results.Ok(progress);
                }
            )
            .WithMetadata(new RequireAuthAttribute());
    }
}
