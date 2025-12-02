using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Projects;
using MediatR;

namespace InventoPos.Application.Projects.Commands.CreateProject;

public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateProjectCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            CustomerId = request.CustomerId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = request.Status
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync(cancellationToken);

        return project.Id;
    }
}
