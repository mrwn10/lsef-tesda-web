document.addEventListener('DOMContentLoaded', function() {
    // Logout Modal Functionality
    $('#logout-trigger').click(function(e) {
        e.preventDefault();
        $('#logout-modal').fadeIn();
    });
    
    $('.close-modal').click(function() {
        $('#logout-modal').fadeOut();
        closeCourseModal();
    });
    
    $(window).click(function(e) {
        if ($(e.target).is('#logout-modal')) {
            $('#logout-modal').fadeOut();
        }
        if ($(e.target).is('#courseModal')) {
            closeCourseModal();
        }
    });
    
    $('#confirm-logout').click(function() {
        window.location.href = "/logout";
    });

    // View button functionality
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            showCourseDetails(courseId);
        });
    });

    // Close modal with overlay click
    document.querySelector('.modal-overlay').addEventListener('click', closeCourseModal);

    // Approve button in modal
    document.getElementById('approveBtn').addEventListener('click', function() {
        const courseId = this.getAttribute('data-course-id');
        approveCourse(courseId);
    });

    // Reject button in modal
    document.getElementById('rejectBtn').addEventListener('click', function() {
        const courseId = this.getAttribute('data-course-id');
        rejectCourse(courseId);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Filter functionality
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const filterValue = e.target.value;
            const rows = document.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const categoryElement = row.querySelector('.course-category');
                if (categoryElement) {
                    const category = categoryElement.textContent.toLowerCase();
                    if (filterValue === 'all' || category.includes(filterValue)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }
});

function showCourseDetails(courseId) {
    fetch(`/course/details/${courseId}`)
        .then(response => response.json())
        .then(data => {
            if(data.status === 'success') {
                const c = data.course;
                document.getElementById('courseDetails').innerHTML = `
                    <div class="detail-section">
                        <h4>Course Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Course Code</span>
                                <span class="detail-value">${c.course_code}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Title</span>
                                <span class="detail-value">${c.course_title}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Category</span>
                                <span class="detail-value">${c.course_category}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Status</span>
                                <span class="detail-value status-badge status-pending">${c.course_status}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Duration</span>
                                <span class="detail-value">${c.duration_hours} hours</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Fee</span>
                                <span class="detail-value">₱${parseFloat(c.course_fee).toFixed(2)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Max Students</span>
                                <span class="detail-value">${c.max_students}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Description</h4>
                        <div class="detail-content">${c.course_description || 'No description provided'}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Target Audience</h4>
                        <div class="detail-content">${c.target_audience || 'No target audience specified'}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Prerequisites</h4>
                        <div class="detail-content">${c.prerequisites || 'No prerequisites required'}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Learning Outcomes</h4>
                        <div class="detail-content">${c.learning_outcomes || 'No learning outcomes specified'}</div>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Submitted By</h4>
                        <div class="submitted-by">
                            <div class="avatar">${c.first_name[0]}${c.last_name[0]}</div>
                            <div>
                                <div class="instructor-name">${c.first_name} ${c.last_name}</div>
                                <div class="instructor-details">
                                    <span>${c.role}</span>
                                    <span>•</span>
                                    <span>ID: ${c.user_id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.getElementById('approveBtn').setAttribute('data-course-id', c.course_id);
                document.getElementById('rejectBtn').setAttribute('data-course-id', c.course_id);
                openCourseModal();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message || 'Failed to load course details',
                    icon: 'error',
                    confirmButtonColor: '#0033A0'
                });
            }
        })
        .catch(error => {
            console.error('Error fetching course details:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load course details. Please try again.',
                icon: 'error',
                confirmButtonColor: '#0033A0'
            });
        });
}

function openCourseModal() {
    document.getElementById('courseModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function approveCourse(courseId) {
    // Close the course modal first
    closeCourseModal();
    
    // Small delay to ensure modal is closed before showing SweetAlert
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = await Swal.fire({
        title: 'Approve this course?',
        text: 'This will make the course available to all users',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0033A0',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, approve',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        // Remove reverseButtons to keep Cancel on the right
        reverseButtons: false
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`/course/approve/${courseId}`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                await Swal.fire({
                    title: 'Approved!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonColor: '#0033A0'
                });
                // Remove the course row from table
                const courseRow = document.getElementById(`course-${courseId}`);
                if (courseRow) {
                    courseRow.remove();
                }
                
                // Check if table is now empty
                const remainingRows = document.querySelectorAll('tbody tr');
                if (remainingRows.length === 0) {
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
            } else {
                await Swal.fire({
                    title: 'Error',
                    text: data.message || 'Failed to approve course',
                    icon: 'error',
                    confirmButtonColor: '#0033A0'
                });
                // Reopen the modal if there was an error
                showCourseDetails(courseId);
            }
        } catch (error) {
            console.error('Error approving course:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Request failed: ' + error.message,
                icon: 'error',
                confirmButtonColor: '#0033A0'
            });
            // Reopen the modal if there was an error
            showCourseDetails(courseId);
        }
    } else {
        // If user cancels, reopen the modal
        showCourseDetails(courseId);
    }
}

async function rejectCourse(courseId) {
    // Close the course modal first
    closeCourseModal();
    
    // Small delay to ensure modal is closed before showing SweetAlert
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = await Swal.fire({
        title: 'Reject this course?',
        text: 'This will permanently remove the course from the system',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, reject',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        // Remove reverseButtons to keep Cancel on the right
        reverseButtons: false
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`/course/reject/${courseId}`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                await Swal.fire({
                    title: 'Rejected!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonColor: '#0033A0'
                });
                // Remove the course row from table
                const courseRow = document.getElementById(`course-${courseId}`);
                if (courseRow) {
                    courseRow.remove();
                }
                
                // Check if table is now empty
                const remainingRows = document.querySelectorAll('tbody tr');
                if (remainingRows.length === 0) {
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
            } else {
                await Swal.fire({
                    title: 'Error',
                    text: data.message || 'Failed to reject course',
                    icon: 'error',
                    confirmButtonColor: '#0033A0'
                });
                // Reopen the modal if there was an error
                showCourseDetails(courseId);
            }
        } catch (error) {
            console.error('Error rejecting course:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Request failed: ' + error.message,
                icon: 'error',
                confirmButtonColor: '#0033A0'
            });
            // Reopen the modal if there was an error
            showCourseDetails(courseId);
        }
    } else {
        // If user cancels, reopen the modal
        showCourseDetails(courseId);
    }
}

// Escape key to close modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCourseModal();
        $('#logout-modal').fadeOut();
    }
});
