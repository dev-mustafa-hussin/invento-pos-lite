using MediatR;

namespace InventoPos.Application.HR.Attendance.Commands.CheckIn;

public record CheckInCommand(int EmployeeId) : IRequest<int>;
