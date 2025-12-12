using StepUpServer.Users;

namespace StepUpServer.Common;

[AttributeUsage(AttributeTargets.Method)]
public class RequireAuthAttribute : Attribute { }

public class AuthMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context, IUserRepository userRepository)
    {
        var endpoint = context.GetEndpoint();
        var requiresAuth = endpoint?.Metadata.GetMetadata<RequireAuthAttribute>() != null;

        if (!requiresAuth)
        {
            await _next(context);
            return;
        }

        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
        if (authHeader is null)
        {
            await context.Response.WriteAsJsonAsync(
                new { error = new { key = "errors.unauthorized" } }
            );
            return;
        }

        var user = await userRepository.GetByApiToken(authHeader);
        if (user is null)
        {
            await context.Response.WriteAsJsonAsync(
                new { error = new { key = "errors.unauthorized" } }
            );
            return;
        }

        user.LastSeenAt = Utils.GetCurrentTimestamp();
        await userRepository.Update(user);

        context.Items["User"] = user;
        await _next(context);
    }
}
