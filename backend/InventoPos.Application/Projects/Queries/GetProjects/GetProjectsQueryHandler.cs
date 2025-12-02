using InventoPos.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Projects.Queries.GetProjects;

public class GetProjectsQueryHandler : IRequestHandler<GetProjectsQuery, List<ProjectDto>>
{
    private readonly IApplicationDbContext _context;

    public GetProjectsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProjectDto>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Projects
            .Include(p => p.Customer)
            .Include(p => p.Tasks)
                .ThenInclude(t => t.AssignedEmployee)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                CustomerId = p.CustomerId,
                CustomerName = p.Customer != null ? p.Customer.Name : null,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Status = p.Status,
                TaskCount = p.Tasks.Count,
                CompletedTaskCount = p.Tasks.Count(t => t.Status == Domain.Entities.Projects.TaskStatus.Done),
                Tasks = p.Tasks.Select(t => new ProjectTaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    AssignedEmployeeId = t.AssignedEmployeeId,
                    AssignedEmployeeName = t.AssignedEmployee != null ? t.AssignedEmployee.FullName : null,
                    DueDate = t.DueDate
                }).ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
