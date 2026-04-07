This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

The app is orchestrated by .NET Aspire. From the repo root:

```bash
./run.sh
```

This starts the Aspire AppHost which launches PostgreSQL, Azurite (blob storage), and the Next.js frontend in Docker containers.

The Aspire dashboard is available at the URL printed on startup (usually `https://localhost:17275`).

## Debugging

### Connecting to PostgreSQL

Aspire assigns random host ports on each restart. To find the current port and credentials:

```bash
# 1. Find the postgres container name and mapped port
docker ps --format '{{.Names}} {{.Ports}}' | grep db

# Example output: db-5929e0ae 127.0.0.1:57998->5432/tcp
#                                        ^^^^^ use this port

# 2. Get the auto-generated password
docker exec <container-name> env | grep POSTGRES_PASSWORD

# 3. Connect
psql -h localhost -p <port> -U postgres -d personasync

# Or as a one-liner
PGPASSWORD='<password>' psql -h localhost -p <port> -U postgres -d personasync
```

### Connecting to Azurite (Blob Storage)

Azurite runs as an emulator with the well-known development credentials:

```bash
# Find the mapped port
docker ps --format '{{.Names}} {{.Ports}}' | grep storage

# Use Azure Storage Explorer or az CLI with the default dev connection string:
# DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:<port>/devstoreaccount1
```

### Viewing Frontend Logs

```bash
docker logs -f <frontend-container-name>
```

### Data Persistence

Both PostgreSQL and Azurite use named Docker volumes (`personasync-pgdata`, `personasync-azurite`) with persistent lifetimes, so data survives container and Aspire restarts.

To wipe data and start fresh:

```bash
docker volume rm personasync-pgdata personasync-azurite
```

### Hot Reload

The frontend source (`src/` and `public/`) is bind-mounted into the container. Changes to files in `front-end/src/` are picked up automatically by Next.js dev server inside Docker.
