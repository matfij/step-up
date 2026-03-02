using StepUpServer.Common;
using StepUpServer.Common.Events;

namespace StepUpServer.Domains.Progress;

public interface IProgressService
{
    Task<Progress> GetByUser(string userId);
    Task<List<Progress>> GetBestDuration();
    Task<List<Progress>> GetBestDistance();
    Task<List<Progress>> GetBestMonthlyDuration();
    Task<List<Progress>> GetBestMonthlyDistance();
}

public class ProgressService(IProgressRepository repository) : IProgressService

{
    private readonly IProgressRepository _repository = repository;

    public async Task<Progress> GetByUser(string userId)
    {
        var progress =
            await _repository.GetByUserId(userId)
            ?? throw new ApiException("errors.progressNotFound");
        return progress;
    }

    public Task<List<Progress>> GetBestDuration()
    {
        return _repository.GetBestBy(p => p.TotalDuration);
    }

    public Task<List<Progress>> GetBestDistance()
    {
        return _repository.GetBestBy(p => p.TotalDistance);
    }

    public Task<List<Progress>> GetBestMonthlyDuration()
    {
        return _repository.GetBestBy(p => p.MonthlyDuration);
    }

    public Task<List<Progress>> GetBestMonthlyDistance()
    {
        return _repository.GetBestBy(p => p.MonthlyDistance);
    }
}
