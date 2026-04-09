using StepUpServer.Common;

namespace StepUpServer.Domains.Log;

public interface ILogService
{
    public Task Create(CreateLogRequest createLogRequest);
    public Task<IEnumerable<Log>> Get(string? userId, int skip, int take);
}

public class LogService(ILogRepository repository) : ILogService
{
    private readonly ILogRepository _repository = repository;

    public async Task Create(CreateLogRequest createLogRequest)
    {
        var log = new Log
        {
            Id = Utils.GenerateId(),
            Type = createLogRequest.Type,
            UserId = createLogRequest.UserId ?? String.Empty,
            Details = createLogRequest.Details ?? String.Empty,
            Timestamp = Utils.GetCurrentTimestamp()
        };

        await _repository.Create(log);
    }

    public async Task<IEnumerable<Log>> Get(string? userId, int skip, int take)
    {
        if (userId is not null)
        {
            return await _repository.ReadByUserId(userId, skip, Math.Min(100, take));
        }
        else
        {
            return await _repository.ReadAll(skip, Math.Min(100, take));
        }
    }
}
