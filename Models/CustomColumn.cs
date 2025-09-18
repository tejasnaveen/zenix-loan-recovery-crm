using System.ComponentModel.DataAnnotations;

namespace LoanRecoveryCRM.Models
{
    public class CustomColumn
    {
        public int Id { get; set; }
        
        [Required]
        public int CompanyId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string ColumnName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string DisplayName { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public bool IsCustom { get; set; } = false;
        
        public int SortOrder { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}