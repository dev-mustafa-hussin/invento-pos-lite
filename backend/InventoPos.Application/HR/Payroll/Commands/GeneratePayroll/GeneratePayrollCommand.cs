using MediatR;

namespace InventoPos.Application.HR.Payroll.Commands.GeneratePayroll;

public record GeneratePayrollCommand(int Month, int Year) : IRequest<int>;
