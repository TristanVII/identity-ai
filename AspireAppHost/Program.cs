var builder = DistributedApplication.CreateBuilder(args);

// PostgreSQL — Azure Flexible Server, runs as container locally
// WithDataVolume persists data across restarts; WithLifetime keeps container alive
var db = builder.AddAzurePostgresFlexibleServer("db")
    .RunAsContainer(c =>
    {
        c.WithDataVolume("personasync-pgdata");
        c.WithLifetime(ContainerLifetime.Persistent);
    })
    .AddDatabase("personasync");

// Azure Blob Storage — runs Azurite emulator in Docker locally
// WithDataVolume persists blobs across restarts
var blobs = builder.AddAzureStorage("storage")
    .RunAsEmulator(c =>
    {
        c.WithDataVolume("personasync-azurite");
        c.WithLifetime(ContainerLifetime.Persistent);
    })
    .AddBlobs("blobs");

// Next.js frontend — runs inside Docker via Dockerfile
// WithBindMount maps host source into container for hot-reload (npm run dev watches files)
var frontend = builder.AddDockerfile("frontend", "../front-end")
    .WithHttpEndpoint(targetPort: 3000, env: "PORT")
    .WithBindMount("../front-end/src", "/app/src", isReadOnly: true)
    .WithBindMount("../front-end/public", "/app/public", isReadOnly: true)
    .WithReference(db)
    .WithReference(blobs)
    .WithEnvironment("GOOGLE_AI_API_KEY", builder.Configuration["GoogleAI:ApiKey"] ?? "")
    .WithEnvironment("KLING_API_KEY", builder.Configuration["KlingAI:ApiKey"] ?? "")
    .WithEnvironment("KLING_API_BASE_URL", builder.Configuration["KlingAI:BaseUrl"] ?? "https://api.klingai.com");

builder.Build().Run();
