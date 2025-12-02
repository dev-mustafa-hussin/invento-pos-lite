using System.ComponentModel.DataAnnotations.Schema;

namespace InventoPos.Domain.Entities.HR;

public class Attendance
{
    public int Id { get; set; }

    public int EmployeeId { get; set; }
    [ForeignKey(nameof(EmployeeId))]
    public Employee Employee { get; set; } = null!;

    public DateTime Date { get; set; }

    public TimeSpan CheckInTime { get; set; }

    public TimeSpan? CheckOutTime { get; set; }

    public double? HoursWorked { get; set; }
}
