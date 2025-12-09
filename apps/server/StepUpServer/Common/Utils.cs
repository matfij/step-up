namespace StepUpServer.Common;

public static class Utils
{
    public static string GenerateId()
    {
        return Guid.NewGuid().ToString();
    }

    public static ulong GetCurrentTimestamp()
    {
        return (ulong)DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    }
}
