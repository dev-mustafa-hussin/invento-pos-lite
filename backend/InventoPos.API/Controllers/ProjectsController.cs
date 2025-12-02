using InventoPos.Application.Projects.Commands.CreateProject;
using InventoPos.Application.Projects.Queries.GetProjects;
using InventoPos.Application.Projects.Tasks.Commands.CreateTask;
using InventoPos.Application.Projects.Tasks.Commands.UpdateTaskStatus;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoPos.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProjectsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProjectDto>>> GetProjects()
    {
        return await _mediator.Send(new GetProjectsQuery());
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectCommand command)
    {
        var projectId = await _mediator.Send(command);
        return Ok(new { ProjectId = projectId });
    }

    [HttpPost("tasks")]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskCommand command)
    {
        var taskId = await _mediator.Send(command);
        return Ok(new { TaskId = taskId });
    }

    [HttpPut("tasks/{taskId}/status")]
    public async Task<IActionResult> UpdateTaskStatus(int taskId, [FromBody] UpdateTaskStatusCommand command)
    {
        if (taskId != command.TaskId) return BadRequest();
        await _mediator.Send(command);
        return NoContent();
    }
}
