// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// Global utility functions
window.CRM = {
    // Format currency in Indian Rupees
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0);
    },

    // Format date
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-IN');
    },

    // Show toast notification
    showToast: function(message, type = 'info') {
        var toastClass = type === 'success' ? 'bg-success' : 
                        type === 'error' ? 'bg-danger' : 
                        type === 'warning' ? 'bg-warning' : 'bg-info';
        
        var icon = type === 'success' ? 'fa-check-circle' : 
                  type === 'error' ? 'fa-exclamation-circle' : 
                  type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        var toastHtml = `
            <div class="toast align-items-center text-white ${toastClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas ${icon} me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        var toastContainer = $('.toast-container');
        if (toastContainer.length === 0) {
            $('body').append('<div class="toast-container position-fixed top-0 end-0 p-3"></div>');
            toastContainer = $('.toast-container');
        }
        
        var $toast = $(toastHtml);
        toastContainer.append($toast);
        
        var toast = new bootstrap.Toast($toast[0], {
            autohide: true,
            delay: 5000
        });
        toast.show();
        
        // Remove toast element after it's hidden
        $toast.on('hidden.bs.toast', function() {
            $(this).remove();
        });
    },

    // Confirm dialog
    confirm: function(message, callback) {
        if (confirm(message)) {
            callback();
        }
    },

    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Loading state management
    setLoading: function(element, loading = true) {
        var $element = $(element);
        if (loading) {
            $element.prop('disabled', true);
            var originalText = $element.text();
            $element.data('original-text', originalText);
            $element.html('<span class="spinner-border spinner-border-sm me-2" role="status"></span>Loading...');
        } else {
            $element.prop('disabled', false);
            $element.html($element.data('original-text') || 'Submit');
        }
    }
};

// Initialize tooltips and popovers
$(document).ready(function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Bootstrap popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    $('.alert').each(function() {
        var $alert = $(this);
        if (!$alert.hasClass('alert-permanent')) {
            setTimeout(function() {
                $alert.fadeOut();
            }, 5000);
        }
    });

    // Add loading state to forms
    $('form').on('submit', function() {
        var $submitBtn = $(this).find('button[type="submit"]');
        CRM.setLoading($submitBtn, true);
    });

    // Handle AJAX errors globally
    $(document).ajaxError(function(event, xhr, settings, thrownError) {
        console.error('AJAX Error:', thrownError);
        CRM.showToast('An error occurred while processing your request.', 'error');
    });
});