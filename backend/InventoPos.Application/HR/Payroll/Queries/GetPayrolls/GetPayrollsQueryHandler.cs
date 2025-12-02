using InventoPos.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.HR.Payroll.Queries.GetPayrolls;

public class GetPayrollsQueryHandler : IRequestHandler<GetPayrollsQuery, List<PayrollDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPayrollsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PayrollDto>> Handle(GetPayrollsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Payrolls
            .Include(p => p.Employee)
            .AsQueryable();

        if (request.Month.HasValue)
        {
            query = query.Where(p => p.Month == request.Month.Value);
        }

        if (request.Year.HasValue)
        {
            query = query.Where(p => p.Year == request.Year.Value);
        }

        return await query
            .OrderByDescending(p => p.Year)
            .ThenByDescending(p => p.Month)
            .Select(p => new PayrollDto
            {
                Id = p.Id,
                EmployeeId = p.EmployeeId,
                EmployeeName = p.Employee.FullName,
                Month = p.Month,
                Year = p.Year,
                BaseSalary = p.BaseSalary,
                Bonuses = p.Bonuses,
                Deductions = p.Deductions,
                NetSalary = p.NetSalary,
                IsPaid = p.IsPaid,
                GeneratedDate = p.GeneratedDate
            })
            .ToListAsync(cancellationToken);
    }
}
