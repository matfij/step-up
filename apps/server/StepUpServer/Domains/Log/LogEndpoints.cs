using Microsoft.AspNetCore.Mvc;
using StepUpServer.Common;

namespace StepUpServer.Domains.Log;

public static class LogEndpoints
{
    public static void MapLogEndpoints(this WebApplication app)
    {
        app.MapPost(
            "/logs",
            async (
                CreateLogRequest request,
                ILogService logService
            ) =>
            {
                await logService.Create(request);
                return Results.Ok();
            }
        );

        app.MapGet(
            "/logs",
            async (
                ILogService logService,
                [FromQuery] string? userId = null,
                [FromQuery] int skip = 0,
                [FromQuery] int take = 100
            ) =>
            {
                var logs = await logService.Get(userId, skip, take);
                return Results.Ok(logs.Select(
                    log =>
                        new LogResponse(
                            log.Id,
                            log.Type,
                            log.UserId ?? String.Empty,
                            log.Details,
                            log.Timestamp
                        )
                    )
                );
            }
        )
        .WithMetadata(new RequireAuthAttribute());
    }
}
