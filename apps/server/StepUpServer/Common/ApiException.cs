namespace StepUpServer.Common;

public enum ApiErrorCode
{
    Fatal = 0,

    // 1xx - Resource errors
    NotFound = 100,
    AlreadyExists = 101,

    // 2xx - Authentication errors
    Unauthorized = 200,
    InvalidAuthCode = 201,

    // 3xx - Validation errors
    ValidationError = 300,
}

public class ApiException(
    string message,
    ApiErrorCode code,
    string? field = null
    ) : Exception(message)
{
    public ApiErrorCode Code { get; } = code;
    public string? Field { get; } = field;
}
