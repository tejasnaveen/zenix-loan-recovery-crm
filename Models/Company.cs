using System.ComponentModel.DataAnnotations;

namespace LoanRecoveryCRM.Models
{
    public class Company
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string CompanyName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string ProprietorName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(15)]
        public string Contact { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(15)]
        public string GSTNo { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual ICollection<CompanyAdmin> CompanyAdmins { get; set; } = new List<CompanyAdmin>();
    }
}