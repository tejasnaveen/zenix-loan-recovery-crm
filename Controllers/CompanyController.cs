using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoanRecoveryCRM.Data;
using LoanRecoveryCRM.Models;
using System.Text.Json;

namespace LoanRecoveryCRM.Controllers
{
    public class CompanyController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CompanyController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var companies = await _context.Companies
                .Include(c => c.CompanyAdmins)
                .OrderBy(c => c.CompanyName)
                .ToListAsync();

            return View(companies);
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _context.Companies
                .Include(c => c.CompanyAdmins)
                .Select(c => new
                {
                    c.Id,
                    c.CompanyName,
                    c.ProprietorName,
                    c.Contact,
                    c.Email,
                    c.GSTNo,
                    c.IsActive,
                    c.CreatedAt,
                    AdminCount = c.CompanyAdmins.Count(a => a.IsActive)
                })
                .OrderBy(c => c.CompanyName)
                .ToListAsync();

            return Json(companies);
        }

        [HttpGet]
        public async Task<IActionResult> GetCompany(int id)
        {
            var company = await _context.Companies
                .Include(c => c.CompanyAdmins)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (company == null)
            {
                return Json(new { success = false, message = "Company not found." });
            }

            return Json(new { success = true, company = company });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] Company company)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return Json(new { success = false, message = "Validation failed.", errors = errors });
                }

                // Check for unique GST No
                var existingGST = await _context.Companies
                    .AnyAsync(c => c.GSTNo == company.GSTNo);
                
                if (existingGST)
                {
                    return Json(new { success = false, message = "GST Number already exists." });
                }

                // Check for unique Email
                var existingEmail = await _context.Companies
                    .AnyAsync(c => c.Email == company.Email);
                
                if (existingEmail)
                {
                    return Json(new { success = false, message = "Email already exists." });
                }

                company.CreatedAt = DateTime.UtcNow;
                company.UpdatedAt = DateTime.UtcNow;

                _context.Companies.Add(company);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Company created successfully!", company = company });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error creating company: " + ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCompany(int id, [FromBody] Company company)
        {
            try
            {
                var existingCompany = await _context.Companies.FindAsync(id);
                if (existingCompany == null)
                {
                    return Json(new { success = false, message = "Company not found." });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return Json(new { success = false, message = "Validation failed.", errors = errors });
                }

                // Check for unique GST No (excluding current company)
                var existingGST = await _context.Companies
                    .AnyAsync(c => c.GSTNo == company.GSTNo && c.Id != id);
                
                if (existingGST)
                {
                    return Json(new { success = false, message = "GST Number already exists." });
                }

                // Check for unique Email (excluding current company)
                var existingEmail = await _context.Companies
                    .AnyAsync(c => c.Email == company.Email && c.Id != id);
                
                if (existingEmail)
                {
                    return Json(new { success = false, message = "Email already exists." });
                }

                existingCompany.CompanyName = company.CompanyName;
                existingCompany.ProprietorName = company.ProprietorName;
                existingCompany.Contact = company.Contact;
                existingCompany.Email = company.Email;
                existingCompany.GSTNo = company.GSTNo;
                existingCompany.IsActive = company.IsActive;
                existingCompany.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Company updated successfully!", company = existingCompany });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error updating company: " + ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            try
            {
                var company = await _context.Companies
                    .Include(c => c.CompanyAdmins)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (company == null)
                {
                    return Json(new { success = false, message = "Company not found." });
                }

                // Check if company has active admins
                if (company.CompanyAdmins.Any(a => a.IsActive))
                {
                    return Json(new { success = false, message = "Cannot delete company with active administrators. Please deactivate all admins first." });
                }

                _context.Companies.Remove(company);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Company deleted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error deleting company: " + ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            try
            {
                var company = await _context.Companies.FindAsync(id);
                if (company == null)
                {
                    return Json(new { success = false, message = "Company not found." });
                }

                company.IsActive = !company.IsActive;
                company.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Json(new { success = true, message = $"Company {(company.IsActive ? "activated" : "deactivated")} successfully!", isActive = company.IsActive });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error updating company status: " + ex.Message });
            }
        }

        // Company Admin Management
        [HttpGet]
        public async Task<IActionResult> GetCompanyAdmins(int companyId)
        {
            var admins = await _context.CompanyAdmins
                .Where(a => a.CompanyId == companyId)
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.EmployeeId,
                    a.Username,
                    a.IsActive,
                    a.CreatedAt,
                    a.LastLogin
                })
                .OrderBy(a => a.Name)
                .ToListAsync();

            return Json(admins);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAdmin([FromBody] CompanyAdmin admin)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return Json(new { success = false, message = "Validation failed.", errors = errors });
                }

                // Check for unique username
                var existingUsername = await _context.CompanyAdmins
                    .AnyAsync(a => a.Username == admin.Username);
                
                if (existingUsername)
                {
                    return Json(new { success = false, message = "Username already exists." });
                }

                // Check for unique employee ID within company
                var existingEmployeeId = await _context.CompanyAdmins
                    .AnyAsync(a => a.CompanyId == admin.CompanyId && a.EmployeeId == admin.EmployeeId);
                
                if (existingEmployeeId)
                {
                    return Json(new { success = false, message = "Employee ID already exists in this company." });
                }

                // In production, hash the password
                admin.Password = BCrypt.Net.BCrypt.HashPassword(admin.Password);
                admin.CreatedAt = DateTime.UtcNow;
                admin.UpdatedAt = DateTime.UtcNow;

                _context.CompanyAdmins.Add(admin);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Admin created successfully!", admin = new { admin.Id, admin.Name, admin.EmployeeId, admin.Username, admin.IsActive } });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error creating admin: " + ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAdmin(int id, [FromBody] CompanyAdmin admin)
        {
            try
            {
                var existingAdmin = await _context.CompanyAdmins.FindAsync(id);
                if (existingAdmin == null)
                {
                    return Json(new { success = false, message = "Admin not found." });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return Json(new { success = false, message = "Validation failed.", errors = errors });
                }

                // Check for unique username (excluding current admin)
                var existingUsername = await _context.CompanyAdmins
                    .AnyAsync(a => a.Username == admin.Username && a.Id != id);
                
                if (existingUsername)
                {
                    return Json(new { success = false, message = "Username already exists." });
                }

                existingAdmin.Name = admin.Name;
                existingAdmin.EmployeeId = admin.EmployeeId;
                existingAdmin.Username = admin.Username;
                existingAdmin.IsActive = admin.IsActive;
                existingAdmin.UpdatedAt = DateTime.UtcNow;

                // Only update password if provided
                if (!string.IsNullOrEmpty(admin.Password))
                {
                    existingAdmin.Password = BCrypt.Net.BCrypt.HashPassword(admin.Password);
                }

                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Admin updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error updating admin: " + ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            try
            {
                var admin = await _context.CompanyAdmins.FindAsync(id);
                if (admin == null)
                {
                    return Json(new { success = false, message = "Admin not found." });
                }

                _context.CompanyAdmins.Remove(admin);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Admin deleted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error deleting admin: " + ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] string newPassword)
        {
            try
            {
                var admin = await _context.CompanyAdmins.FindAsync(id);
                if (admin == null)
                {
                    return Json(new { success = false, message = "Admin not found." });
                }

                admin.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                admin.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Password reset successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error resetting password: " + ex.Message });
            }
        }
    }
}