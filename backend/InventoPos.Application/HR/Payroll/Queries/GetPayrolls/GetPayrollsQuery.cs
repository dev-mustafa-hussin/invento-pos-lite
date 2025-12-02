using MediatR;

namespace InventoPos.Application.HR.Payroll.Queries.GetPayrolls;

public record GetPayrollsQuery(int? Month, int? Year) : IRequest<List<PayrollDto>>;

public class PayrollDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal Bonuses { get; set; }
    public decimal Deductions { get; set; }
    public decimal NetSalary { get; set; }
    public bool IsPaid { get; set; }
    public DateTime GeneratedDate { get; set; }
}
