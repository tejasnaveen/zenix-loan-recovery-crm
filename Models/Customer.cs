using System.ComponentModel.DataAnnotations;

namespace LoanRecoveryCRM.Models
{
    public class Customer
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string LoanId { get; set; } = string.Empty;
        
        [Required]
        public decimal LoanAmount { get; set; }
        
        [Required]
        [StringLength(15)]
        public string MobileNo { get; set; } = string.Empty;
        
        public int DPD { get; set; } // Days Past Due
        
        public decimal Outstanding { get; set; }
        
        public decimal POSAmount { get; set; } // Principal Outstanding
        
        public decimal EMIAmount { get; set; }
        
        public decimal PendingDues { get; set; }
        
        public string? PaymentLink { get; set; }
        
        // Custom columns
        public string? BranchName { get; set; }
        
        public string? LoanType { get; set; }
        
        public string? Remarks { get; set; }
        
        public int CompanyId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}