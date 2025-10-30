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

    // View student details
    const viewButtons = document.querySelectorAll('.btn-view-details, .student-info.clickable');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const enrollmentId = this.getAttribute('data-enrollment-id');
            viewStudentDetails(enrollmentId);
        });
    });

    // Function to load and display student details
    function viewStudentDetails(enrollmentId) {
        fetch(`/staff/enrollment_acceptance/details/${enrollmentId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }
                displayStudentDetails(data);
            })
            .catch(error => {
                console.error('Error fetching student details:', error);
                alert('Error loading student details');
            });
    }

    // Function to display student details in modal
    function displayStudentDetails(data) {
        const modalContent = document.getElementById('student-details-content');
        
        // Format requirements status
        const requirements = [
            { name: 'Birth Certificate', value: data.birth_certificate },
            { name: 'Educational Credentials', value: data.educational_credentials },
            { name: 'ID Photos', value: data.id_photos },
            { name: 'Barangay Clearance', value: data.barangay_clearance },
            { name: 'Medical Certificate', value: data.medical_certificate },
            { name: 'Marriage Certificate', value: data.marriage_certificate },
            { name: 'Valid ID', value: data.valid_id },
            { name: 'Transcript Form', value: data.transcript_form },
            { name: 'Good Moral Certificate', value: data.good_moral_certificate },
            { name: 'Brown Envelope', value: data.brown_envelope }
        ];

        const requirementsHtml = requirements.map(req => `
            <div class="requirement-item">
                <span class="requirement-name">${req.name}:</span>
                <span class="requirement-status ${req.value ? 'completed' : 'missing'}">
                    ${req.value ? '<i class="fas fa-check"></i> Submitted' : '<i class="fas fa-times"></i> Missing'}
                </span>
            </div>
        `).join('');

        modalContent.innerHTML = `
            <div class="student-details-grid">
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> Personal Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Full Name:</span>
                        <span class="detail-value">${data.first_name} ${data.middle_name || ''} ${data.last_name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${data.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Contact Number:</span>
                        <span class="detail-value">${data.contact_number || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date of Birth:</span>
                        <span class="detail-value">${data.date_of_birth ? new Date(data.date_of_birth).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Gender:</span>
                        <span class="detail-value">${data.gender || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Address:</span>
                        <span class="detail-value">${data.baranggay}, ${data.municipality}, ${data.province}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4><i class="fas fa-book"></i> Course Information</h4>
                    <div class="detail-row">
                        <span class="detail-label">Course:</span>
                        <span class="detail-value">${data.course_title}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Class:</span>
                        <span class="detail-value">${data.class_title}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Schedule:</span>
                        <span class="detail-value">${data.schedule}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Venue:</span>
                        <span class="detail-value">${data.venue}</span>
                    </div>
                </div>

                <div class="detail-section full-width">
                    <h4><i class="fas fa-file-alt"></i> Requirements Status</h4>
                    <div class="requirements-grid">
                        ${requirementsHtml}
                    </div>
                    ${data.additional_notes ? `
                    <div class="detail-row">
                        <span class="detail-label">Additional Notes:</span>
                        <span class="detail-value">${data.additional_notes}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Show the modal
        document.getElementById('student-details-modal').style.display = 'block';
    }

    // Responsive table adjustments
    function handleResponsiveTable() {
        const table = document.querySelector('.enrollment-table');
        if (!table) return;

        const container = table.closest('.table-responsive');
        if (container.scrollWidth > container.clientWidth) {
            container.classList.add('scrollable');
        } else {
            container.classList.remove('scrollable');
        }
    }

    // Initialize tooltips
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                
                this._tooltip = tooltip;
            });
            
            el.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    this._tooltip.remove();
                }
            });
        });
    }

    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('.enrollment-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    // Date formatting for better display
    const dateCells = document.querySelectorAll('[data-label="Start Date"], [data-label="End Date"]');
    dateCells.forEach(cell => {
        const dateText = cell.textContent.trim();
        if (dateText && dateText !== 'N/A') {
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

    // Initial setup
    handleResponsiveTable();
    initTooltips();
    window.addEventListener('resize', handleResponsiveTable);
});