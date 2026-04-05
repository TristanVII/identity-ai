var builder = DistributedApplication.CreateBuilder(args);

// PostgreSQL — runs as a Docker container locally
var db = builder.AddAzurePostgresFlexibleServer("db")
    .RunAsContainer()
    .AddDatabase("personasync");

// Azure Blob Storage — runs Azurite emulator in Docker locally
var blobs = builder.AddAzureStorage("storage")
    .RunAsEmulator()
    .AddBlobs("blobs");

// Next.js frontend (+ API routes)
var frontend = builder.AddJavaScriptApp("frontend", "../src")
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithReference(db)       // injects DATABASE_URL
    .WithReference(blobs);   // injects AZURE_STORAGE_CONNECTION_STRING

builder.Build().Run();
