using System.ComponentModel.DataAnnotations.Schema;

namespace InventoPos.Domain.Entities.HR;

public class Payroll
{
    public int Id { get; set; }

    public int EmployeeId { get; set; }
    [ForeignKey(nameof(EmployeeId))]
    public Employee Employee { get; set; } = null!;

    public int Month { get; set; }
    public int Year { get; set; }

    public decimal BaseSalary { get; set; }
    public decimal Bonuses { get; set; }
    public decimal Deductions { get; set; }
    public decimal NetSalary { get; set; }

    public DateTime GeneratedDate { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
}
