using InventoPos.Application.Common.Interfaces;
using InventoPos.Domain.Entities.Identity;
using InventoPos.Domain.Entities.Inventory;
using InventoPos.Domain.Entities.Inventory.Attributes;
using InventoPos.Domain.Entities.Licensing;
using InventoPos.Domain.Entities.Sales;
using InventoPos.Domain.Entities.HR;
using InventoPos.Domain.Entities.Projects;
using InventoPos.Domain.Entities.Purchases;
using InventoPos.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    // Inventory
    public DbSet<Warehouse> Warehouses { get; set; }
    public DbSet<ProductAttribute> ProductAttributes { get; set; }
    public DbSet<ProductAttributeValue> ProductAttributeValues { get; set; }
    public DbSet<Stock> Stocks { get; set; }
    public DbSet<StockMovement> StockMovements { get; set; }

    // Sales
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Quotation> Quotations { get; set; }
    public DbSet<QuotationItem> QuotationItems { get; set; }
    public DbSet<SalesOrder> SalesOrders { get; set; }
    public DbSet<SalesOrderItem> SalesOrderItems { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<InvoiceItem> InvoiceItems { get; set; }

    // Licensing
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
    public DbSet<CompanySubscription> CompanySubscriptions { get; set; }

    // HR
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Attendance> Attendances { get; set; }
    public DbSet<Payroll> Payrolls { get; set; }

    // Projects
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectTask> ProjectTasks { get; set; }

    // Purchases
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }

    // System
    public DbSet<SystemSetting> SystemSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Additional configuration if needed
        builder.Entity<Product>()
            .HasIndex(p => p.Barcode)
            .IsUnique();
    }
}
