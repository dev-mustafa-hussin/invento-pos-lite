using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.HR;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.HR.Payroll.Commands.GeneratePayroll;

public class GeneratePayrollCommandHandler : IRequestHandler<GeneratePayrollCommand, int>
{
    private readonly IApplicationDbContext _context;

    public GeneratePayrollCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(GeneratePayrollCommand request, CancellationToken cancellationToken)
    {
        var employees = await _context.Employees
            .Where(e => e.IsActive)
            .ToListAsync(cancellationToken);

        int generatedCount = 0;

        foreach (var employee in employees)
        {
            // Check if payroll already exists for this month
            var existingPayroll = await _context.Payrolls
                .AnyAsync(p => p.EmployeeId == employee.Id && p.Month == request.Month && p.Year == request.Year, cancellationToken);

            if (existingPayroll) continue;

            // Simple calculation logic (can be expanded)
            decimal bonus = 0; 
            decimal deduction = 0;
            
            // Example: Deduct for absence (simplified)
            // In a real system, we'd query Attendance for this month and calculate deductions based on absent days.

            var payroll = new Domain.Entities.HR.Payroll
            {
                EmployeeId = employee.Id,
                Month = request.Month,
                Year = request.Year,
                BaseSalary = employee.BaseSalary,
                Bonuses = bonus,
                Deductions = deduction,
                NetSalary = employee.BaseSalary + bonus - deduction,
                GeneratedDate = DateTime.UtcNow,
                IsPaid = false
            };

            _context.Payrolls.Add(payroll);
            generatedCount++;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return generatedCount;
    }
}
