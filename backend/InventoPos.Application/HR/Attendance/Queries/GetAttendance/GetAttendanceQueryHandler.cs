using InventoPos.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.HR.Attendance.Queries.GetAttendance;

public class GetAttendanceQueryHandler : IRequestHandler<GetAttendanceQuery, List<AttendanceDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAttendanceQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AttendanceDto>> Handle(GetAttendanceQuery request, CancellationToken cancellationToken)
    {
        var date = request.Date ?? DateTime.UtcNow.Date;

        return await _context.Attendances
            .Include(a => a.Employee)
            .Where(a => a.Date == date)
            .Select(a => new AttendanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee.FullName,
                Date = a.Date,
                CheckInTime = a.CheckInTime,
                CheckOutTime = a.CheckOutTime,
                HoursWorked = a.HoursWorked
            })
            .ToListAsync(cancellationToken);
    }
}
