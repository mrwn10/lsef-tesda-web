// Logout Modal Functionality - Consistent with other pages
document.addEventListener('DOMContentLoaded', function() {
    // Open modal when logout is clicked
    const logoutTrigger = document.getElementById('logout-trigger');
    if (logoutTrigger) {
        logoutTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            const logoutModal = document.getElementById('logout-modal');
            logoutModal.style.display = 'flex';
            // Force reflow to trigger CSS animation
            void logoutModal.offsetWidth;
        });
    }
    
    // Close modal when No is clicked
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const logoutModal = document.getElementById('logout-modal');
            const courseModal = document.getElementById('courseModal');
            
            if (logoutModal.style.display === 'flex') {
                logoutModal.style.animation = 'modalFadeOut 0.3s ease-out';
                setTimeout(() => {
                    logoutModal.style.display = 'none';
                    logoutModal.style.animation = '';
                }, 250);
            }
            
            if (courseModal.style.display === 'flex') {
                courseModal.style.animation = 'modalFadeOut 0.3s ease-out';
                setTimeout(() => {
                    courseModal.style.display = 'none';
                    courseModal.style.animation = '';
                }, 250);
            }
        });
    });
    
    // Confirm logout
    const confirmLogout = document.getElementById('confirm-logout');
    if (confirmLogout) {
        confirmLogout.addEventListener('click', function() {
            // This will use the Flask URL from the template
            window.location.href = document.getElementById('logout-url') ? 
                document.getElementById('logout-url').value : '/logout';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const logoutModal = document.getElementById('logout-modal');
        const courseModal = document.getElementById('courseModal');
        
        if (e.target === logoutModal && logoutModal.style.display === 'flex') {
            logoutModal.style.animation = 'modalFadeOut 0.3s ease-out';
            setTimeout(() => {
                logoutModal.style.display = 'none';
                logoutModal.style.animation = '';
            }, 250);
        }
        
        if (e.target === courseModal && courseModal.style.display === 'flex') {
            courseModal.style.animation = 'modalFadeOut 0.3s ease-out';
            setTimeout(() => {
                courseModal.style.display = 'none';
                courseModal.style.animation = '';
            }, 250);
        }
    });

    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                row.style.display = rowText.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Filter Functionality
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const filterValue = this.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                if (filterValue === 'all') {
                    row.style.display = '';
                } else {
                    const category = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                    row.style.display = category.includes(filterValue) ? '' : 'none';
                }
            });
        });
    }

    // Event listeners for approve/reject buttons
    document.getElementById('approveBtn').addEventListener('click', function() {
        const courseId = this.getAttribute('data-course-id');
        if (courseId) {
            approveEdit(courseId);
        }
    });

    document.getElementById('rejectBtn').addEventListener('click', function() {
        const courseId = this.getAttribute('data-course-id');
        if (courseId) {
            rejectEdit(courseId);
        }
    });
});

// Course Modal Functions
function openCourseModal(courseId) {
    fetch(`/courses/edit-details/${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if(data.status === 'success') {
                const original = data.original_course || {};
                const edited = data.edited_course;
                
                // Display original version (if exists)
                const originalHtml = original.course_id ? `
                    <div class="detail-section">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Course Code</span>
                                <span class="detail-value">${original.course_code || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Title</span>
                                <span class="detail-value">${original.course_title || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Category</span>
                                <span class="detail-value">${original.course_category || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Duration</span>
                                <span class="detail-value">${original.duration_hours || '0'} hours</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Fee</span>
                                <span class="detail-value">₱${original.course_fee || '0'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Max Students</span>
                                <span class="detail-value">${original.max_students || '0'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Description</h5>
                        <div class="detail-content">${original.course_description || 'No description provided'}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Target Audience</h5>
                        <div class="detail-content">${original.target_audience || 'Not specified'}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Prerequisites</h5>
                        <div class="detail-content">${original.prerequisites || 'None'}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Learning Outcomes</h5>
                        <div class="detail-content">${original.learning_outcomes || 'Not specified'}</div>
                    </div>
                ` : `
                    <div class="no-original-version">
                        <i class="fas fa-info-circle"></i>
                        <p>No previous version found. This appears to be the first edit request for this course.</p>
                    </div>
                `;
                
                document.getElementById('originalCourseDetails').innerHTML = originalHtml;
                
                // Display edited version
                document.getElementById('editedCourseDetails').innerHTML = `
                    <div class="detail-section">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Course Code</span>
                                <span class="detail-value ${original.course_code !== edited.course_code ? 'changed-value' : ''}">${edited.course_code}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Title</span>
                                <span class="detail-value ${original.course_title !== edited.course_title ? 'changed-value' : ''}">${edited.course_title}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Category</span>
                                <span class="detail-value ${original.course_category !== edited.course_category ? 'changed-value' : ''}">${edited.course_category}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Duration</span>
                                <span class="detail-value ${original.duration_hours !== edited.duration_hours ? 'changed-value' : ''}">${edited.duration_hours} hours</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Fee</span>
                                <span class="detail-value ${original.course_fee !== edited.course_fee ? 'changed-value' : ''}">₱${edited.course_fee}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Max Students</span>
                                <span class="detail-value ${original.max_students !== edited.max_students ? 'changed-value' : ''}">${edited.max_students}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Description</h5>
                        <div class="detail-content ${original.course_description !== edited.course_description ? 'changed-content' : ''}">${edited.course_description}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Target Audience</h5>
                        <div class="detail-content ${original.target_audience !== edited.target_audience ? 'changed-content' : ''}">${edited.target_audience}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Prerequisites</h5>
                        <div class="detail-content ${original.prerequisites !== edited.prerequisites ? 'changed-content' : ''}">${edited.prerequisites}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Learning Outcomes</h5>
                        <div class="detail-content ${original.learning_outcomes !== edited.learning_outcomes ? 'changed-content' : ''}">${edited.learning_outcomes}</div>
                    </div>
                `;
                
                // Display edit reason
                const editReason = edited.edit_reason || 'No reason provided';
                document.getElementById('editReasonContent').textContent = editReason;
                
                document.getElementById('approveBtn').setAttribute('data-course-id', edited.course_id);
                document.getElementById('rejectBtn').setAttribute('data-course-id', edited.course_id);
                
                const courseModal = document.getElementById('courseModal');
                courseModal.style.display = 'flex';
                // Force reflow to trigger CSS animation
                void courseModal.offsetWidth;
            } else {
                throw new Error(data.message || 'Failed to fetch course details');
            }
        })
        .catch(error => {
            console.error('Error fetching course details:', error);
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonColor: '#003366',
                customClass: {
                    popup: 'sweetalert-custom-zindex'
                }
            });
        });
}

function closeCourseModal() {
    const courseModal = document.getElementById('courseModal');
    if (courseModal.style.display === 'flex') {
        courseModal.style.animation = 'modalFadeOut 0.3s ease-out';
        setTimeout(() => {
            courseModal.style.display = 'none';
            courseModal.style.animation = '';
        }, 250);
    }
}

// Approve and Reject functions
async function approveEdit(courseId) {
    // Close the course modal first to prevent overlapping
    closeCourseModal();
    
    const result = await Swal.fire({
        title: 'Approve these changes?',
        text: 'This will update the course with the edited version',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#003366',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true, // Focus on cancel button by default
        customClass: {
            popup: 'sweetalert-custom-zindex',
            actions: 'sweetalert-actions-reverse'
        }
    });

    if (result.isConfirmed) {
        try {
            // Show loading state
            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we approve the changes',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'sweetalert-custom-zindex'
                }
            });

            const response = await fetch(`/approve-edit/${courseId}`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                Swal.fire({
                    title: 'Approved!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonColor: '#003366',
                    customClass: {
                        popup: 'sweetalert-custom-zindex'
                    }
                }).then(() => {
                    // Remove the course row from the table
                    const courseRow = document.getElementById(`course-${courseId}`);
                    if (courseRow) {
                        courseRow.remove();
                    }
                    
                    // Check if table is now empty
                    const remainingRows = document.querySelectorAll('tbody tr');
                    if (remainingRows.length === 0) {
                        location.reload(); // Reload to show empty state
                    }
                });
            } else {
                throw new Error(data.message || 'Approval failed');
            }
        } catch (error) {
            console.error('Error approving edit:', error);
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonColor: '#003366',
                customClass: {
                    popup: 'sweetalert-custom-zindex'
                }
            });
        }
    }
}

async function rejectEdit(courseId) {
    // Close the course modal first to prevent overlapping
    closeCourseModal();
    
    const result = await Swal.fire({
        title: 'Reject these changes?',
        text: 'This will restore the original version of the course',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        focusCancel: true, // Focus on cancel button by default
        customClass: {
            popup: 'sweetalert-custom-zindex',
            actions: 'sweetalert-actions-reverse'
        }
    });

    if (result.isConfirmed) {
        try {
            // Show loading state
            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we reject the changes',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'sweetalert-custom-zindex'
                }
            });

            const response = await fetch(`/reject-edit/${courseId}`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                Swal.fire({
                    title: 'Rejected!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonColor: '#003366',
                    customClass: {
                        popup: 'sweetalert-custom-zindex'
                    }
                }).then(() => {
                    // Remove the course row from the table
                    const courseRow = document.getElementById(`course-${courseId}`);
                    if (courseRow) {
                        courseRow.remove();
                    }
                    
                    // Check if table is now empty
                    const remainingRows = document.querySelectorAll('tbody tr');
                    if (remainingRows.length === 0) {
                        location.reload(); // Reload to show empty state
                    }
                });
            } else {
                throw new Error(data.message || 'Rejection failed');
            }
        } catch (error) {
            console.error('Error rejecting edit:', error);
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonColor: '#003366',
                customClass: {
                    popup: 'sweetalert-custom-zindex'
                }
            });
        }
    }
}

// Keyboard event listeners for modal closing
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCourseModal();
        
        const logoutModal = document.getElementById('logout-modal');
        if (logoutModal.style.display === 'flex') {
            logoutModal.style.animation = 'modalFadeOut 0.3s ease-out';
            setTimeout(() => {
                logoutModal.style.display = 'none';
                logoutModal.style.animation = '';
            }, 250);
        }
    }
});

// Add CSS for SweetAlert2 button order and z-index
function addSweetAlertStyles() {
    if (!document.querySelector('#sweetalert-custom-styles')) {
        const style = document.createElement('style');
        style.id = 'sweetalert-custom-styles';
        style.textContent = `
            .sweetalert-custom-zindex {
                z-index: 10000 !important;
            }
            .swal2-container {
                z-index: 10000 !important;
            }
            .sweetalert-actions-reverse .swal2-actions {
                flex-direction: row-reverse !important;
            }
            .sweetalert-actions-reverse .swal2-actions button:first-child {
                margin-left: 10px !important;
                margin-right: 0 !important;
            }
            .sweetalert-actions-reverse .swal2-actions button:last-child {
                margin-right: 10px !important;
                margin-left: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize SweetAlert styles when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addSweetAlertStyles();
});