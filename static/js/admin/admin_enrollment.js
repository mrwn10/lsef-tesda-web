document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let currentEnrollmentId = null;
    let currentAction = null;

    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const courseFilter = document.getElementById('course-filter');
    const resetFilters = document.getElementById('reset-filters');
    const showAllEnrollments = document.getElementById('show-all-enrollments');
    
    // Modal elements
    const logoutModal = document.getElementById('logout-modal');
    const enrollmentDetailsModal = document.getElementById('enrollmentDetailsModal');
    const statusUpdateModal = document.getElementById('statusUpdateModal');
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const loadingModal = document.getElementById('loadingModal');

    // Initialize the page
    initializeEventListeners();
    initializeModals();

    function initializeEventListeners() {
        // Filter event listeners
        [statusFilter, courseFilter].forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
        
        // Search functionality
        searchInput.addEventListener('input', debounce(applyFilters, 300));
        
        // Reset filters
        resetFilters.addEventListener('click', resetAllFilters);
        
        // Show all enrollments
        if (showAllEnrollments) {
            showAllEnrollments.addEventListener('click', resetAllFilters);
        }
        
        // Close flash messages
        document.querySelectorAll('.close-alert').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.alert').style.display = 'none';
            });
        });
        
        // Auto-hide flash messages after 5 seconds
        setTimeout(() => {
            document.querySelectorAll('.alert').forEach(alert => {
                alert.style.opacity = '0';
                setTimeout(() => alert.style.display = 'none', 500);
            });
        }, 5000);
    }

    function initializeModals() {
        // Logout modal
        document.getElementById('logout-trigger').addEventListener('click', function(e) {
            e.preventDefault();
            showModal(logoutModal);
        });
        
        document.getElementById('confirm-logout').addEventListener('click', function() {
            window.location.href = window.appUrls.logoutUrl;
        });

        // Close modal events
        document.querySelectorAll('.modal-close, .close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                hideAllModals();
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    hideAllModals();
                }
            });
        });

        // Status update confirmation
        document.getElementById('confirm-status-update').addEventListener('click', function() {
            if (currentEnrollmentId && currentAction) {
                updateEnrollmentStatus(currentEnrollmentId, currentAction);
            }
            hideModal(statusUpdateModal);
        });

        // Handle enrollment action buttons
        document.addEventListener('click', function(e) {
            const actionButton = e.target.closest('.btn-action');
            if (actionButton) {
                const row = actionButton.closest('tr');
                const enrollmentId = row.dataset.enrollmentId;
                const action = actionButton.dataset.action;
                const studentName = row.querySelector('.student-name').textContent;
                const currentStatus = row.querySelector('.status-badge').textContent.toLowerCase();
                
                if (actionButton.classList.contains('btn-details')) {
                    // View details action
                    viewEnrollmentDetails(enrollmentId);
                } else if (action) {
                    // Status update action
                    showStatusUpdateModal(enrollmentId, action, studentName, currentStatus);
                }
            }
        });
    }

    function showModal(modal) {
        hideAllModals();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function hideModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            hideModal(modal);
        });
    }

    function showLoadingModal() {
        showModal(loadingModal);
    }

    function hideLoadingModal() {
        hideModal(loadingModal);
    }

    function showStatusUpdateModal(enrollmentId, action, studentName, currentStatus) {
        currentEnrollmentId = enrollmentId;
        currentAction = action;
        
        const actionText = getActionText(action);
        const currentStatusText = getActionText(currentStatus);
        const message = getStatusUpdateMessage(action, studentName, currentStatusText);
        const title = getStatusUpdateTitle(action);
        
        document.getElementById('status-update-title').innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${title}`;
        document.getElementById('status-update-message').innerHTML = message;
        showModal(statusUpdateModal);
    }

    function getStatusUpdateMessage(action, studentName, currentStatus) {
        const messages = {
            'enrolled': `Approve enrollment for <strong>${studentName}</strong>? This will change their status from <span class="status-badge status-pending">${currentStatus}</span> to <span class="status-badge status-enrolled">Enrolled</span>.`,
            'rejected': `Reject enrollment for <strong>${studentName}</strong>? This will change their status from <span class="status-badge status-pending">${currentStatus}</span> to <span class="status-badge status-rejected">Rejected</span>.`,
            'completed': `Mark <strong>${studentName}</strong> as completed? This will change their status from <span class="status-badge status-enrolled">${currentStatus}</span> to <span class="status-badge status-completed">Completed</span>.`,
            'dropped': `Drop <strong>${studentName}</strong> from the class? This will change their status from <span class="status-badge status-enrolled">${currentStatus}</span> to <span class="status-badge status-dropped">Dropped</span>.`,
            'pending': `Reconsider enrollment for <strong>${studentName}</strong>? This will change their status from <span class="status-badge status-rejected">${currentStatus}</span> to <span class="status-badge status-pending">Pending</span>.`
        };
        
        return messages[action] || `Change enrollment status for <strong>${studentName}</strong>?`;
    }

    function getStatusUpdateTitle(action) {
        const titles = {
            'enrolled': 'Approve Enrollment',
            'rejected': 'Reject Enrollment',
            'completed': 'Mark as Completed',
            'dropped': 'Drop Student',
            'pending': 'Reconsider Enrollment'
        };
        
        return titles[action] || 'Confirm Status Update';
    }

    function showSuccessModal(message) {
        document.getElementById('success-message').textContent = message;
        showModal(successModal);
    }

    function showErrorModal(message) {
        document.getElementById('error-message').textContent = message;
        showModal(errorModal);
    }

    function getActionText(action) {
        const actions = {
            'pending': 'Pending',
            'enrolled': 'Enrolled',
            'rejected': 'Rejected',
            'completed': 'Completed',
            'dropped': 'Dropped'
        };
        return actions[action] || action;
    }

    // Function to apply filters
    function applyFilters() {
        const status = statusFilter.value;
        const course = courseFilter.value;
        const search = searchInput.value.trim();
        
        let url = window.appUrls.getEnrollments + '?';
        if (status !== 'all') url += `status=${status}&`;
        if (course !== 'all') url += `course=${course}&`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        
        window.location.href = url.slice(0, -1);
    }

    // Function to reset all filters
    function resetAllFilters() {
        statusFilter.value = 'all';
        courseFilter.value = 'all';
        searchInput.value = '';
        applyFilters();
    }

    // Function to update enrollment status
    function updateEnrollmentStatus(enrollmentId, newStatus) {
        showLoadingModal();
        
        fetch(window.appUrls.updateEnrollmentStatus, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                enrollment_id: enrollmentId,
                status: newStatus
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            hideLoadingModal();
            
            if (data.success) {
                const actionText = getActionText(newStatus);
                showSuccessModal(`Enrollment has been ${actionText.toLowerCase()} successfully!`);
                
                // Update the UI after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                showErrorModal(data.message || 'Failed to update enrollment status');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoadingModal();
            showErrorModal('An error occurred while updating enrollment status');
        });
    }

    // Function to view enrollment details
    function viewEnrollmentDetails(enrollmentId) {
        showLoadingModal();
        
        const url = window.appUrls.getEnrollmentDetails.replace('0', enrollmentId);
        
        fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Failed to fetch enrollment details');
                });
            }
            return response.json();
        })
        .then(data => {
            hideLoadingModal();
            
            if (data.success) {
                populateEnrollmentDetails(data.enrollment);
                showModal(enrollmentDetailsModal);
            } else {
                showErrorModal(data.message || 'Failed to load enrollment details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoadingModal();
            showErrorModal(error.message || 'An error occurred while fetching enrollment details');
        });
    }

    function populateEnrollmentDetails(enrollment) {
        const content = document.getElementById('enrollmentDetailsContent');
        
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        content.innerHTML = `
            <div class="detail-section">
                <h4>Student Information</h4>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${enrollment.student_name || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${enrollment.email || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Role:</span>
                    <span class="detail-value">${enrollment.role || 'N/A'}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Course Information</h4>
                <div class="detail-row">
                    <span class="detail-label">Course:</span>
                    <span class="detail-value">${enrollment.course_title || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Class:</span>
                    <span class="detail-value">${enrollment.class_title || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Schedule:</span>
                    <span class="detail-value">${enrollment.schedule || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Venue:</span>
                    <span class="detail-value">${enrollment.venue || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Max Students:</span>
                    <span class="detail-value">${enrollment.max_students || 'N/A'}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Class Dates</h4>
                <div class="detail-row">
                    <span class="detail-label">Start Date:</span>
                    <span class="detail-value">${formatDate(enrollment.start_date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">End Date:</span>
                    <span class="detail-value">${formatDate(enrollment.end_date)}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Enrollment Details</h4>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value status-badge status-${enrollment.status}">
                        ${enrollment.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'N/A'}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Enrollment Date:</span>
                    <span class="detail-value">${formatDate(enrollment.enrollment_date)}</span>
                </div>
            </div>
        `;
    }

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Keyboard event listeners for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideAllModals();
        }
    });
});