using InventoPos.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Settings.Queries.GetSettings;

public class GetSettingsQueryHandler : IRequestHandler<GetSettingsQuery, Dictionary<string, string>>
{
    private readonly IApplicationDbContext _context;

    public GetSettingsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Dictionary<string, string>> Handle(GetSettingsQuery request, CancellationToken cancellationToken)
    {
        return await _context.SystemSettings
            .ToDictionaryAsync(s => s.Key, s => s.Value, cancellationToken);
    }
}
