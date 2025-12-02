using MediatR;

namespace InventoPos.Application.HR.Attendance.Commands.CheckOut;

public record CheckOutCommand(int EmployeeId) : IRequest<Unit>;
