using Microsoft.Data.SqlClient;

var connectionString = "Server=db33961.public.databaseasp.net;Database=db33961;User Id=db33961;Password=j%6L5K_nd#4S;Encrypt=False;MultipleActiveResultSets=True;TrustServerCertificate=True;";

try
{
    using var connection = new SqlConnection(connectionString);
    Console.WriteLine("Attempting to connect to SQL Server...");
    await connection.OpenAsync();
    Console.WriteLine("✓ Connection successful!");
    Console.WriteLine($"Server Version: {connection.ServerVersion}");
    await connection.CloseAsync();
}
catch (Exception ex)
{
    Console.WriteLine($"✗ Connection failed: {ex.Message}");
    Console.WriteLine($"Details: {ex}");
}
