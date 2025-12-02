using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoPos.Domain.Entities.Licensing;

public class SubscriptionPlan
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal PriceMonthly { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal PriceYearly { get; set; }

    // Limits
    public int MaxUsers { get; set; }
    public int MaxBranches { get; set; }
    public int MaxInvoicesPerMonth { get; set; }
    public bool AllowApiAccess { get; set; }

    public bool IsActive { get; set; } = true;
}
