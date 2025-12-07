namespace StepUpServer.Common;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ExceptionMiddleware> _logger = logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ApiException ex)
        {
            _logger.LogWarning(ex, $"API Exception ({ex.Code}): {ex.Message}");
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(
                new
                {
                    error = new
                    {
                        code = ex.Code,
                        message = ex.Message,
                        metadata = ex.Field,
                    },
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Unhandled Exception: {ex.Message}");
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(
                new
                {
                    error = new
                    {
                        code = ApiErrorCode.Fatal,
                        message = "An unexpected error occurred.",
                    },
                }
            );
        }
    }
}
