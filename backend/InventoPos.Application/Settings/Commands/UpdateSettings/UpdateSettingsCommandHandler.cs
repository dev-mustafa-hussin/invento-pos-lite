using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Settings.Commands.UpdateSettings;

public class UpdateSettingsCommandHandler : IRequestHandler<UpdateSettingsCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateSettingsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateSettingsCommand request, CancellationToken cancellationToken)
    {
        var existingSettings = await _context.SystemSettings.ToListAsync(cancellationToken);

        foreach (var setting in request.Settings)
        {
            var existing = existingSettings.FirstOrDefault(s => s.Key == setting.Key);
            if (existing != null)
            {
                existing.Value = setting.Value;
            }
            else
            {
                _context.SystemSettings.Add(new SystemSetting
                {
                    Key = setting.Key,
                    Value = setting.Value
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
