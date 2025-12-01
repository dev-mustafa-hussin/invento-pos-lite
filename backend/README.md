# Invento POS Backend

This is the ASP.NET Core Web API backend for Invento POS.

## Prerequisites

- .NET 8.0 SDK or later
- SQL Server (LocalDB or Developer Edition)

## Setup

1. Navigate to `backend/InventoPos.API`.
2. Update the connection string in `appsettings.json` if needed.
3. Run migrations:
   ```bash
   dotnet ef database update
   ```

## Running the API

```bash
dotnet run
```

The API will be available at `http://localhost:5000` (or similar, check output).
Swagger UI is available at `/swagger/index.html`.
