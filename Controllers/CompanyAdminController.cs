using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoanRecoveryCRM.Data;
using LoanRecoveryCRM.Models;
using System.Text.Json;

namespace LoanRecoveryCRM.Controllers
{
    public class CompanyAdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CompanyAdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> CustomColumnManagement()
        {
            int companyId = 1; // In real app, get from user session
            var columns = await _context.CustomColumns
                .Where(c => c.CompanyId == companyId)
                .OrderBy(c => c.SortOrder)
                .ToListAsync();

            return View(columns);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateColumns([FromBody] List<CustomColumn> columns)
        {
            try
            {
                int companyId = 1; // In real app, get from user session

                foreach (var column in columns)
                {
                    var existingColumn = await _context.CustomColumns
                        .FirstOrDefaultAsync(c => c.Id == column.Id && c.CompanyId == companyId);

                    if (existingColumn != null)
                    {
                        existingColumn.DisplayName = column.DisplayName;
                        existingColumn.IsActive = column.IsActive;
                        existingColumn.SortOrder = column.SortOrder;
                        existingColumn.UpdatedAt = DateTime.UtcNow;
                    }
                }

                await _context.SaveChangesAsync();
                return Json(new { success = true, message = "Columns updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error updating columns: " + ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddCustomColumn([FromBody] CustomColumn column)
        {
            try
            {
                int companyId = 1; // In real app, get from user session
                
                column.CompanyId = companyId;
                column.IsCustom = true;
                column.IsActive = true;
                column.CreatedAt = DateTime.UtcNow;
                column.UpdatedAt = DateTime.UtcNow;

                // Get max sort order
                var maxSortOrder = await _context.CustomColumns
                    .Where(c => c.CompanyId == companyId)
                    .MaxAsync(c => (int?)c.SortOrder) ?? 0;
                
                column.SortOrder = maxSortOrder + 1;

                _context.CustomColumns.Add(column);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Custom column added successfully!", column = column });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error adding custom column: " + ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCustomColumn(int id)
        {
            try
            {
                int companyId = 1; // In real app, get from user session
                
                var column = await _context.CustomColumns
                    .FirstOrDefaultAsync(c => c.Id == id && c.CompanyId == companyId && c.IsCustom);

                if (column == null)
                {
                    return Json(new { success = false, message = "Custom column not found or cannot be deleted." });
                }

                _context.CustomColumns.Remove(column);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Custom column deleted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error deleting custom column: " + ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetActiveColumns()
        {
            int companyId = 1; // In real app, get from user session
            
            var columns = await _context.CustomColumns
                .Where(c => c.CompanyId == companyId && c.IsActive)
                .OrderBy(c => c.SortOrder)
                .Select(c => new { c.ColumnName, c.DisplayName, c.IsCustom })
                .ToListAsync();

            return Json(columns);
        }
    }
}