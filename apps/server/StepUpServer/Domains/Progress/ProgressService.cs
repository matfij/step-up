using StepUpServer.Common;
using StepUpServer.Common.Events;

namespace StepUpServer.Domains.Progress;

public interface IProgressService
{
    // Define service methods here
}

public class ProgressService(IProgressRepository repository)
    : IProgressService,
        IEventHandler<UserCreatedEvent>
{
    private readonly IProgressRepository _repository = repository;

    public async Task HandleAsync(UserCreatedEvent @event)
    {
        var progress = new Progress { Id = Utils.GenerateId(), UserId = @event.UserId };

        await _repository.Create(progress);
    }
}
