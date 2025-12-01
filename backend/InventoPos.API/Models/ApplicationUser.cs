using Microsoft.AspNetCore.Identity;

namespace InventoPos.API.Models;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
    public string? JobTitle { get; set; }
}
