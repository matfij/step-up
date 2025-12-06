var builder = WebApplication.CreateSlimBuilder(args);

var app = builder.Build();

var rootApi = app.MapGroup("/");

rootApi.MapGet("/", () => "ok");

app.Run();
