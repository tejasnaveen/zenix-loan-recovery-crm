using Microsoft.EntityFrameworkCore;
using LoanRecoveryCRM.Models;

namespace LoanRecoveryCRM.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<CustomColumn> CustomColumns { get; set; }
        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure CustomColumn
            modelBuilder.Entity<CustomColumn>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ColumnName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.DisplayName).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => new { e.CompanyId, e.ColumnName }).IsUnique();
            });

            // Configure Customer
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LoanId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.MobileNo).IsRequired().HasMaxLength(15);
                entity.Property(e => e.LoanAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Outstanding).HasColumnType("decimal(18,2)");
                entity.Property(e => e.POSAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.EMIAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PendingDues).HasColumnType("decimal(18,2)");
            });

            // Seed default custom columns
            modelBuilder.Entity<CustomColumn>().HasData(
                new CustomColumn { Id = 1, CompanyId = 1, ColumnName = "CustomerName", DisplayName = "Customer Name", IsActive = true, IsCustom = false, SortOrder = 1 },
                new CustomColumn { Id = 2, CompanyId = 1, ColumnName = "LoanId", DisplayName = "Loan ID", IsActive = true, IsCustom = false, SortOrder = 2 },
                new CustomColumn { Id = 3, CompanyId = 1, ColumnName = "LoanAmount", DisplayName = "Loan Amount", IsActive = true, IsCustom = false, SortOrder = 3 },
                new CustomColumn { Id = 4, CompanyId = 1, ColumnName = "MobileNo", DisplayName = "Mobile No", IsActive = true, IsCustom = false, SortOrder = 4 },
                new CustomColumn { Id = 5, CompanyId = 1, ColumnName = "DPD", DisplayName = "DPD", IsActive = true, IsCustom = false, SortOrder = 5 },
                new CustomColumn { Id = 6, CompanyId = 1, ColumnName = "Outstanding", DisplayName = "Outstanding", IsActive = true, IsCustom = false, SortOrder = 6 },
                new CustomColumn { Id = 7, CompanyId = 1, ColumnName = "POSAmount", DisplayName = "POS Amount", IsActive = true, IsCustom = false, SortOrder = 7 },
                new CustomColumn { Id = 8, CompanyId = 1, ColumnName = "EMIAmount", DisplayName = "EMI Amount", IsActive = true, IsCustom = false, SortOrder = 8 },
                new CustomColumn { Id = 9, CompanyId = 1, ColumnName = "PendingDues", DisplayName = "Pending Dues", IsActive = true, IsCustom = false, SortOrder = 9 },
                new CustomColumn { Id = 10, CompanyId = 1, ColumnName = "PaymentLink", DisplayName = "Payment Link", IsActive = true, IsCustom = false, SortOrder = 10 },
                new CustomColumn { Id = 11, CompanyId = 1, ColumnName = "Actions", DisplayName = "Actions", IsActive = true, IsCustom = false, SortOrder = 11 }
            );
        }
    }
}