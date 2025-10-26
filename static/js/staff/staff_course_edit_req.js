function openEditModal(courseId) {
    axios.get(`/course/edit/${courseId}`)
        .then(response => {
            if (response.data.status === 'success') {
                const course = response.data.course;
                document.getElementById('editCourseId').value = course.course_id;
                document.getElementById('editCourseCode').value = course.course_code;
                document.getElementById('editCourseTitle').value = course.course_title;
                document.getElementById('editCourseDescription').value = course.course_description;
                
                // Set dropdown values
                document.getElementById('editCourseCategory').value = course.course_category;
                document.getElementById('editTargetAudience').value = course.target_audience;
                
                document.getElementById('editPrerequisites').value = course.prerequisites;
                document.getElementById('editLearningOutcomes').value = course.learning_outcomes;
                document.getElementById('editDurationHours').value = course.duration_hours;
                document.getElementById('editCourseFee').value = course.course_fee;
                
                // Force max students to 25
                document.getElementById('editMaxStudents').value = 25;
                
                // Clear previous reason
                document.getElementById('editReason').value = '';

                document.getElementById('editModal').style.display = 'flex';
            } else {
                alert(response.data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching course details:', error);
            alert('Failed to fetch course details. Please try again.');
        });
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveCourseEdits() {
    const courseId = document.getElementById('editCourseId').value;
    const reason = document.getElementById('editReason').value.trim();

    if (!reason) {
        alert('Please provide a reason for the edit.');
        return;
    }

    const data = {
        course_code: document.getElementById('editCourseCode').value,
        course_title: document.getElementById('editCourseTitle').value,
        course_description: document.getElementById('editCourseDescription').value,
        course_category: document.getElementById('editCourseCategory').value,
        target_audience: document.getElementById('editTargetAudience').value,
        prerequisites: document.getElementById('editPrerequisites').value,
        learning_outcomes: document.getElementById('editLearningOutcomes').value,
        duration_hours: document.getElementById('editDurationHours').value,
        course_fee: document.getElementById('editCourseFee').value,
        max_students: 25, // Always set to 25
        edit_reason: reason
    };

    axios.post(`/course/update/${courseId}`, data)
        .then(response => {
            if (response.data.status === 'success') {
                alert('Course updated successfully!');
                window.location.reload();
            } else {
                alert(response.data.message || 'Failed to update course.');
            }
        })
        .catch(error => {
            console.error('Error updating course:', error);
            alert('An error occurred while updating the course. Please try again.');
        });
}

// Additional protection for max students field
document.addEventListener('DOMContentLoaded', function() {
    const maxStudentsInput = document.getElementById('editMaxStudents');
    
    if (maxStudentsInput) {
        // Set fixed value and disable input
        maxStudentsInput.value = 25;
        maxStudentsInput.readOnly = true;
        
        // Additional protection - reset to 25 if value changes
        maxStudentsInput.addEventListener('input', function() {
            if (this.value !== '25') {
                this.value = 25;
            }
        });
        
        // Also handle change event for additional protection
        maxStudentsInput.addEventListener('change', function() {
            this.value = 25;
        });
    }
});