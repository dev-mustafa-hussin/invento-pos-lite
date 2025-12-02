using InventoPos.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.HR.Attendance.Commands.CheckOut;

public class CheckOutCommandHandler : IRequestHandler<CheckOutCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public CheckOutCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(CheckOutCommand request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.EmployeeId == request.EmployeeId && a.Date == today, cancellationToken);

        if (attendance == null)
        {
            throw new Exception("Employee has not checked in today.");
        }

        if (attendance.CheckOutTime.HasValue)
        {
            throw new Exception("Employee already checked out.");
        }

        attendance.CheckOutTime = DateTime.UtcNow.TimeOfDay;
        attendance.HoursWorked = (attendance.CheckOutTime.Value - attendance.CheckInTime).TotalHours;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
