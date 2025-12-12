namespace StepUpServer.Common;

public class ApiException(string key, string? field = null)
    : Exception(String.Empty)
{
    public string Key { get; } = key;
    public string? Field { get; } = field;
}
