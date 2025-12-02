using System.ComponentModel.DataAnnotations;

namespace InventoPos.Domain.Entities.Licensing;

public class Tenant
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? TaxNumber { get; set; }

    public string? Address { get; set; }
    public string? Phone { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Navigation
    public CompanySubscription? CurrentSubscription { get; set; }
}
