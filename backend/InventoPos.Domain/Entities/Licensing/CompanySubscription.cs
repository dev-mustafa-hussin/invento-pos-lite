using System.ComponentModel.DataAnnotations.Schema;

namespace InventoPos.Domain.Entities.Licensing;

public class CompanySubscription
{
    public Guid Id { get; set; }

    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public int PlanId { get; set; }
    public SubscriptionPlan? Plan { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public bool IsTrial { get; set; }
    public bool IsActive { get; set; } = true;

    [Column(TypeName = "decimal(18,2)")]
    public decimal AmountPaid { get; set; }
}
