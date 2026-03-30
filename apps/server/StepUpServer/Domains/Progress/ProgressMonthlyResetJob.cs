using static System.Net.Mime.MediaTypeNames;

namespace StepUpServer.Domains.Progress;

public class ProgressMonthlyResetJob(
    IServiceScopeFactory serviceScopeFactory,
    ILogger<ProgressMonthlyResetJob> logger
    ) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken token)
    {
        while (!token.IsCancellationRequested)
        {
            try
            {
                var now = DateTime.UtcNow;
                var next = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
                while (now <= next)
                {
                    next = next.AddMonths(1);
                }
                var delay = next - now;
                logger.LogInformation($"Next monthly reset scheduled at {next} (in {delay})");
                await Task.Delay(delay, token);
                await ResetMonthlyProgressAsync();
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                logger.LogInformation(ex, "Monthly progress reset failed");
                await Task.Delay(TimeSpan.FromSeconds(10), token);
            }
        }

    }

    private async Task ResetMonthlyProgressAsync()
    {
        using var scope = serviceScopeFactory.CreateScope();
        var progressRepository = scope.ServiceProvider.GetRequiredService<IProgressRepository>();

        for (int i = 1; i <= 3; i++)
        {
            try
            {
                await progressRepository.ResetMonthlyProgress();
                logger.LogInformation("Monthly progress reset success");
                return;
            }
            catch (Exception ex)
            {
                logger.LogInformation(ex, "Monthly progress reset failed");
                await Task.Delay(TimeSpan.FromSeconds(i * 10));
            }
        }

    }
}
