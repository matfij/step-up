using StepUpServer.Common.Events;

namespace StepUpServer.Domains.Follower;

public class FollowerReactor(IFollowerRepository repository) : IEventHandler<UserUpdatedEvent>
{
    private readonly IFollowerRepository _repository = repository;

    public async Task HandleAsync(UserUpdatedEvent userUpdatedEvent)
    {
        await _repository.SyncFollowingSnapshot(
            userUpdatedEvent.UserId,
            userUpdatedEvent.Username,
            userUpdatedEvent.AvatarUri);
        await _repository.SyncFollowerSnapshot(
            userUpdatedEvent.UserId,
            userUpdatedEvent.Username,
            userUpdatedEvent.AvatarUri);
    }
}
