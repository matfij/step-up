namespace StepUpServer.Common.Events;

public interface IEventPublisher
{
    Task PublishAsync<TEvent>(TEvent domainEvent) where TEvent : IDomainEvent;
}

public interface IEventHandler<in TEvent> where TEvent : IDomainEvent
{
    Task HandleAsync(TEvent domainEvent);
}

public class EventPublisher(IServiceProvider serviceProvider) : IEventPublisher
{
    private readonly IServiceProvider _serviceProvider = serviceProvider;

    public async Task PublishAsync<TEvent>(TEvent domainEvent) where TEvent : IDomainEvent
    {
        var handlers = _serviceProvider.GetServices<IEventHandler<TEvent>>();

        foreach (var handler in handlers)
        {
            await handler.HandleAsync(domainEvent);
        }
    }
}
