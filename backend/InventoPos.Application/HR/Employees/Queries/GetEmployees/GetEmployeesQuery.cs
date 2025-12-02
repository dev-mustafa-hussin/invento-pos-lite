using MediatR;

namespace InventoPos.Application.HR.Employees.Queries.GetEmployees;

public record GetEmployeesQuery : IRequest<List<EmployeeDto>>;

public class EmployeeDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public DateTime JoinDate { get; set; }
    public decimal BaseSalary { get; set; }
    public bool IsActive { get; set; }
}
