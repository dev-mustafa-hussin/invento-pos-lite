using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.HR;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.HR.Attendance.Commands.CheckIn;

public class CheckInCommandHandler : IRequestHandler<CheckInCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CheckInCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CheckInCommand request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var existingAttendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.EmployeeId == request.EmployeeId && a.Date == today, cancellationToken);

        if (existingAttendance != null)
        {
            throw new Exception("Employee already checked in for today.");
        }

        var attendance = new Domain.Entities.HR.Attendance
        {
            EmployeeId = request.EmployeeId,
            Date = today,
            CheckInTime = DateTime.UtcNow.TimeOfDay
        };

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync(cancellationToken);

        return attendance.Id;
    }
}
