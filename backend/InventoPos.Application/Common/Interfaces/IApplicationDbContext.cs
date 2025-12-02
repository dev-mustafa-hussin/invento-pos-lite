using InventoPos.Domain.Entities.Identity;
using InventoPos.Domain.Entities.Inventory;
using InventoPos.Domain.Entities.Inventory.Attributes;
using InventoPos.Domain.Entities.Licensing;
using InventoPos.Domain.Entities.Sales;
using InventoPos.Domain.Entities.HR;
using InventoPos.Domain.Entities.Projects;
using InventoPos.Domain.Entities.Purchases;
using InventoPos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InventoPos.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Product> Products { get; }
    DbSet<Category> Categories { get; }
    
    // Inventory
    DbSet<Warehouse> Warehouses { get; }
    DbSet<ProductAttribute> ProductAttributes { get; }
    DbSet<ProductAttributeValue> ProductAttributeValues { get; }
    DbSet<Stock> Stocks { get; }
    DbSet<StockMovement> StockMovements { get; }

    // Sales
    DbSet<Customer> Customers { get; }
    DbSet<Quotation> Quotations { get; }
    DbSet<QuotationItem> QuotationItems { get; }
    DbSet<SalesOrder> SalesOrders { get; }
    DbSet<SalesOrderItem> SalesOrderItems { get; }
    DbSet<Invoice> Invoices { get; }
    DbSet<InvoiceItem> InvoiceItems { get; }

    // Licensing
    DbSet<Tenant> Tenants { get; }
    DbSet<SubscriptionPlan> SubscriptionPlans { get; }
    DbSet<CompanySubscription> CompanySubscriptions { get; }

    // HR
    DbSet<Employee> Employees { get; }
    DbSet<Attendance> Attendances { get; }
    DbSet<Payroll> Payrolls { get; }

    // Projects
    DbSet<Project> Projects { get; }
    DbSet<ProjectTask> ProjectTasks { get; }

    // Purchases
    DbSet<Supplier> Suppliers { get; }
    DbSet<PurchaseOrder> PurchaseOrders { get; }
    DbSet<PurchaseOrderItem> PurchaseOrderItems { get; }

    // System
    DbSet<SystemSetting> SystemSettings { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
