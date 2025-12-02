using Microsoft.AspNetCore.Identity;

namespace InventoPos.Domain.Entities.Identity;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
    public string? JobTitle { get; set; }
}
