using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoanRecoveryCRM.Data;
using LoanRecoveryCRM.Models;
using ClosedXML.Excel;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Text;

namespace LoanRecoveryCRM.Controllers
{
    public class TelecallerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TelecallerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            int companyId = 1; // In real app, get from user session
            
            var activeColumns = await _context.CustomColumns
                .Where(c => c.CompanyId == companyId && c.IsActive)
                .OrderBy(c => c.SortOrder)
                .ToListAsync();

            ViewBag.ActiveColumns = activeColumns;
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers(int page = 1, int pageSize = 10, string search = "")
        {
            int companyId = 1; // In real app, get from user session

            var query = _context.Customers.Where(c => c.CompanyId == companyId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.CustomerName.Contains(search) || 
                                       c.LoanId.Contains(search) || 
                                       c.MobileNo.Contains(search));
            }

            var totalRecords = await query.CountAsync();
            var customers = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var activeColumns = await _context.CustomColumns
                .Where(c => c.CompanyId == companyId && c.IsActive)
                .OrderBy(c => c.SortOrder)
                .ToListAsync();

            return Json(new
            {
                data = customers,
                columns = activeColumns,
                totalRecords = totalRecords,
                totalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                currentPage = page
            });
        }

        [HttpGet]
        public async Task<IActionResult> ExportCustomers(string format = "csv", string search = "")
        {
            int companyId = 1; // In real app, get from user session

            var query = _context.Customers.Where(c => c.CompanyId == companyId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.CustomerName.Contains(search) || 
                                       c.LoanId.Contains(search) || 
                                       c.MobileNo.Contains(search));
            }

            var customers = await query.ToListAsync();
            var activeColumns = await _context.CustomColumns
                .Where(c => c.CompanyId == companyId && c.IsActive && c.ColumnName != "Actions")
                .OrderBy(c => c.SortOrder)
                .ToListAsync();

            switch (format.ToLower())
            {
                case "excel":
                    return ExportToExcel(customers, activeColumns);
                case "pdf":
                    return ExportToPdf(customers, activeColumns);
                default:
                    return ExportToCsv(customers, activeColumns);
            }
        }

        private IActionResult ExportToCsv(List<Customer> customers, List<CustomColumn> columns)
        {
            var csv = new StringBuilder();
            
            // Add headers
            csv.AppendLine(string.Join(",", columns.Select(c => $"\"{c.DisplayName}\"")));

            // Add data
            foreach (var customer in customers)
            {
                var values = new List<string>();
                foreach (var column in columns)
                {
                    var value = GetCustomerPropertyValue(customer, column.ColumnName);
                    values.Add($"\"{value}\"");
                }
                csv.AppendLine(string.Join(",", values));
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            return File(bytes, "text/csv", $"customers_{DateTime.Now:yyyyMMdd_HHmmss}.csv");
        }

        private IActionResult ExportToExcel(List<Customer> customers, List<CustomColumn> columns)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Customers");

            // Add headers
            for (int i = 0; i < columns.Count; i++)
            {
                worksheet.Cell(1, i + 1).Value = columns[i].DisplayName;
                worksheet.Cell(1, i + 1).Style.Font.Bold = true;
            }

            // Add data
            for (int row = 0; row < customers.Count; row++)
            {
                for (int col = 0; col < columns.Count; col++)
                {
                    var value = GetCustomerPropertyValue(customers[row], columns[col].ColumnName);
                    worksheet.Cell(row + 2, col + 1).Value = value;
                }
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                       $"customers_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx");
        }

        private IActionResult ExportToPdf(List<Customer> customers, List<CustomColumn> columns)
        {
            using var stream = new MemoryStream();
            var document = new Document(PageSize.A4.Rotate(), 10, 10, 10, 10);
            PdfWriter.GetInstance(document, stream);
            document.Open();

            // Add title
            var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
            var title = new Paragraph("Customer List", titleFont);
            title.Alignment = Element.ALIGN_CENTER;
            document.Add(title);
            document.Add(new Paragraph(" "));

            // Create table
            var table = new PdfPTable(columns.Count);
            table.WidthPercentage = 100;

            // Add headers
            foreach (var column in columns)
            {
                var headerCell = new PdfPCell(new Phrase(column.DisplayName, FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10)));
                headerCell.BackgroundColor = BaseColor.LIGHT_GRAY;
                table.AddCell(headerCell);
            }

            // Add data
            foreach (var customer in customers)
            {
                foreach (var column in columns)
                {
                    var value = GetCustomerPropertyValue(customer, column.ColumnName);
                    table.AddCell(new PdfPCell(new Phrase(value, FontFactory.GetFont(FontFactory.HELVETICA, 8))));
                }
            }

            document.Add(table);
            document.Close();

            return File(stream.ToArray(), "application/pdf", $"customers_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");
        }

        private string GetCustomerPropertyValue(Customer customer, string columnName)
        {
            return columnName switch
            {
                "CustomerName" => customer.CustomerName ?? "",
                "LoanId" => customer.LoanId ?? "",
                "LoanAmount" => customer.LoanAmount.ToString("C"),
                "MobileNo" => customer.MobileNo ?? "",
                "DPD" => customer.DPD.ToString(),
                "Outstanding" => customer.Outstanding.ToString("C"),
                "POSAmount" => customer.POSAmount.ToString("C"),
                "EMIAmount" => customer.EMIAmount.ToString("C"),
                "PendingDues" => customer.PendingDues.ToString("C"),
                "PaymentLink" => customer.PaymentLink ?? "",
                "BranchName" => customer.BranchName ?? "",
                "LoanType" => customer.LoanType ?? "",
                "Remarks" => customer.Remarks ?? "",
                _ => ""
            };
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCustomerStatus(int customerId, string status)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(customerId);
                if (customer == null)
                {
                    return Json(new { success = false, message = "Customer not found." });
                }

                // In a real application, you might have a separate Status field
                customer.Remarks = $"Status updated to: {status} on {DateTime.Now:yyyy-MM-dd HH:mm}";
                customer.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Json(new { success = true, message = "Status updated successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error updating status: " + ex.Message });
            }
        }
    }
}