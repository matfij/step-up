using System.Text.Json.Serialization.Metadata;
using Microsoft.Extensions.FileProviders;
using MongoDB.Driver;
using Resend;
using StepUpServer.Common;
using StepUpServer.Common.Events;
using StepUpServer.Domains.Achievements;
using StepUpServer.Domains.Activity;
using StepUpServer.Domains.Follower;
using StepUpServer.Domains.Progress;
using StepUpServer.Domains.User;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.TypeInfoResolver = new DefaultJsonTypeInfoResolver();
});

builder.Services.AddSingleton(provider =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    return new MongoClient(connectionString);
});

builder.Services.AddSingleton(provider =>
{
    var client = provider.GetRequiredService<MongoClient>();
    var databaseName = builder.Configuration.GetValue<string>("DatabaseName");
    return client.GetDatabase(databaseName);
});

builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(options =>
{
    var apiKey = builder.Configuration["Email:ApiKey"]
        ?? throw new InvalidOperationException("Email:ApiKey configuration is required");
    options.ApiToken = apiKey;
});
builder.Services.AddTransient<IResend, ResendClient>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IEventPublisher, EventPublisher>();
builder.Services.AddSingleton<IFileService, FileService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserValidator, UserValidator>();
builder.Services.AddSingleton<IUserEmailService, UserEmailService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IActivityRepository, ActivityRepository>();
builder.Services.AddScoped<IActivityValidator, ActivityValidator>();
builder.Services.AddScoped<IActivityService, ActivityService>();

builder.Services.AddScoped<IProgressRepository, ProgressRepository>();
builder.Services.AddScoped<IProgressService, ProgressService>();
builder.Services.AddScoped<IEventHandler<UserCreatedEvent>, ProgressReactor>();
builder.Services.AddScoped<IEventHandler<UserUpdatedEvent>, ProgressReactor>();
builder.Services.AddScoped<IEventHandler<ActivityCreatedEvent>, ProgressReactor>();

builder.Services.AddScoped<IAchievementsRepository, AchievementsRepository>();
builder.Services.AddScoped<IAchievementsService, AchievementsService>();
builder.Services.AddScoped<IEventHandler<UserCreatedEvent>, AchievementsService>();
builder.Services.AddScoped<IEventHandler<ProgressUpdatedEvent>, AchievementsService>();

builder.Services.AddScoped<IFollowerRepository, FollowerRepository>();
builder.Services.AddScoped<IFollowerService, FollowerService>();
builder.Services.AddScoped<IEventHandler<UserUpdatedEvent>, FollowerReactor>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<AuthMiddleware>();

app.MapUserEndpoints();
app.MapActivityEndpoints();
app.MapProgressEndpoints();
app.MapAchievementsEndpoints();
app.MapFollowerEndpoints();

var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.Run();
