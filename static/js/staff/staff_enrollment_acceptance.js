// enrollment_acceptance.js

document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.enrollment-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Handle flash message closing
    const closeButtons = document.querySelectorAll('.close-flash');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.style.display = 'none';
        });
    });

    // Auto-hide flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.style.display = 'none';
            }, 500);
        }, 5000);
    });

    // Confirmation for enrollment actions
    const actionForms = document.querySelectorAll('.action-form');
    actionForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const actionButton = e.submitter;
            const action = actionButton.value;
            const studentName = this.closest('tr').querySelector('[data-label="Student Name"]').textContent.trim();
            
            if (!confirm(`Are you sure you want to ${action} the enrollment for ${studentName}?`)) {
                e.preventDefault();
            }
        });
    });

    // Responsive table adjustments
    function handleResponsiveTable() {
        const table = document.querySelector('.enrollment-table');
        if (!table) return;

        // Check if table is overflowing its container
        const container = table.closest('.table-responsive');
        if (container.scrollWidth > container.clientWidth) {
            container.classList.add('scrollable');
        } else {
            container.classList.remove('scrollable');
        }
    }

    // Initial check and window resize listener
    handleResponsiveTable();
    window.addEventListener('resize', handleResponsiveTable);

    // Initialize tooltips for action buttons
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            
            this.tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
            }
        });
    });

    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('.enrollment-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f5f5f5';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    // Date formatting for better display
    const dateCells = document.querySelectorAll('[data-label="Start Date"], [data-label="End Date"]');
    dateCells.forEach(cell => {
        const dateText = cell.textContent.trim();
        if (dateText) {
            try {
                const date = new Date(dateText);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                cell.textContent = formattedDate;
            } catch (e) {
                console.error('Error formatting date:', e);
            }
        }
    });
});