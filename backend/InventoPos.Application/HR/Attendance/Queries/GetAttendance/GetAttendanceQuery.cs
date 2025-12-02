using MediatR;

namespace InventoPos.Application.HR.Attendance.Queries.GetAttendance;

public record GetAttendanceQuery(DateTime? Date) : IRequest<List<AttendanceDto>>;

public class AttendanceDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public TimeSpan CheckInTime { get; set; }
    public TimeSpan? CheckOutTime { get; set; }
    public double? HoursWorked { get; set; }
}
