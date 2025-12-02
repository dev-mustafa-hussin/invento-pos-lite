using MediatR;

namespace InventoPos.Application.HR.Employees.Commands.CreateEmployee;

public record CreateEmployeeCommand : IRequest<int>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public DateTime JoinDate { get; set; }
    public decimal BaseSalary { get; set; }
}
