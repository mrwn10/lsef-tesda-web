// Logout Modal Functionality - Consistent with Edit Courses
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
});

// Course Modal Functions - Consistent with Edit Courses pattern
function openCourseModal(courseId) {
    fetch(`/course/available/details/${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                const course = data.course;
                document.getElementById('courseDetails').innerHTML = `
                    <div class="detail-section">
                        <h4><i class="fas fa-info-circle"></i> Basic Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">Course Code</div>
                                <div class="detail-value">${course.course_code}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Title</div>
                                <div class="detail-value">${course.course_title}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Category</div>
                                <div class="detail-value">${course.course_category}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Duration</div>
                                <div class="detail-value">${course.duration_hours} hours</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Fee</div>
                                <div class="detail-value">₱${course.course_fee}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Status</div>
                                <div class="detail-value">
                                    <span class="status-badge ${course.course_status === 'Active' ? 'status-active' : 'status-inactive'}">
                                        ${course.course_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-user-tie"></i> Instructor Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">Staff ID</div>
                                <div class="detail-value">${course.user_id}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Role</div>
                                <div class="detail-value">${course.role}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Instructor Name</div>
                                <div class="detail-value">${course.first_name} ${course.last_name}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-align-left"></i> Course Description</h4>
                        <div class="description-box">
                            ${course.course_description}
                        </div>
                    </div>
                `;

                const courseModal = document.getElementById('courseModal');
                courseModal.style.display = 'flex';
                // Force reflow to trigger CSS animation
                void courseModal.offsetWidth;
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error fetching course details:', error);
            Swal.fire('Error', 'Failed to fetch course details', 'error');
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