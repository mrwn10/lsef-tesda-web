// Logout Modal Functionality
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
            const editModal = document.getElementById('editModal');
            
            if (logoutModal.style.display === 'flex') {
                logoutModal.style.animation = 'modalFadeOut 0.3s ease-out';
                setTimeout(() => {
                    logoutModal.style.display = 'none';
                    logoutModal.style.animation = '';
                }, 250);
            }
            
            if (editModal.style.display === 'flex') {
                editModal.style.animation = 'modalFadeOut 0.3s ease-out';
                setTimeout(() => {
                    editModal.style.display = 'none';
                    editModal.style.animation = '';
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
        const editModal = document.getElementById('editModal');
        
        if (e.target === logoutModal && logoutModal.style.display === 'flex') {
            logoutModal.style.animation = 'modalFadeOut 0.3s ease-out';
            setTimeout(() => {
                logoutModal.style.display = 'none';
                logoutModal.style.animation = '';
            }, 250);
        }
        
        if (e.target === editModal && editModal.style.display === 'flex') {
            editModal.style.animation = 'modalFadeOut 0.3s ease-out';
            setTimeout(() => {
                editModal.style.display = 'none';
                editModal.style.animation = '';
            }, 250);
        }
    });
});

// Edit Modal Functions
function openEditModal(courseId) {
    fetch(`/admin/course/${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                const course = data.course;
                document.getElementById('editCourseId').value = course.course_id;
                document.getElementById('editCourseCode').value = course.course_code;
                document.getElementById('editCourseTitle').value = course.course_title;
                document.getElementById('editCourseDescription').value = course.course_description;
                document.getElementById('editCourseCategory').value = course.course_category;
                document.getElementById('editTargetAudience').value = course.target_audience;
                document.getElementById('editPrerequisites').value = course.prerequisites || '';
                document.getElementById('editLearningOutcomes').value = course.learning_outcomes || '';
                document.getElementById('editDurationHours').value = course.duration_hours;
                document.getElementById('editCourseFee').value = course.course_fee;
                document.getElementById('editMaxStudents').value = 25; // Always set to 25
                document.getElementById('editPublished').value = course.published;

                const editModal = document.getElementById('editModal');
                editModal.style.display = 'flex';
                // Force reflow to trigger CSS animation
                void editModal.offsetWidth;
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error fetching course details:', error);
            Swal.fire('Error', 'Failed to fetch course details', 'error');
        });
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal.style.display === 'flex') {
        editModal.style.animation = 'modalFadeOut 0.3s ease-out';
        setTimeout(() => {
            editModal.style.display = 'none';
            editModal.style.animation = '';
        }, 250);
    }
}

function saveCourseEdits() {
    const courseId = document.getElementById('editCourseId').value;
    const form = document.getElementById('editCourseForm');
    const formData = new FormData(form);
    const data = {};

    // Convert FormData to object
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Type conversion for numbers + hardcoded max students
    data.duration_hours = parseInt(data.duration_hours);
    data.course_fee = data.course_fee ? parseFloat(data.course_fee) : 0.00;
    data.max_students = 25; // Hardcoded to 25
    data.published = parseInt(data.published);

    // Show loading state
    const saveButton = document.querySelector('.save-btn');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveButton.disabled = true;

    fetch(`/admin/update_course/${courseId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            closeEditModal();
            Swal.fire({
                title: 'Success!',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error updating course:', error);
        Swal.fire('Error', 'Failed to update course', 'error');
    })
    .finally(() => {
        // Reset button state
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
    });
}

// Keyboard event listeners for modal closing
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEditModal();
        
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

// Form validation for edit course form
document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('editCourseForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCourseEdits();
        });
    }
});