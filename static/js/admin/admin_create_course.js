// Course Form Submission
document.getElementById('courseForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const redirectUrl = form.getAttribute('data-redirect-url');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    // Required fields validation
    if (!data.course_code || !data.course_title || !data.course_description || 
        !data.course_category || !data.target_audience || !data.duration_hours) {
        Swal.fire('Missing Field', 'Please fill all required fields.', 'warning');
        return;
    }

    // Type conversion
    data.duration_hours = parseInt(data.duration_hours);
    data.course_fee = data.course_fee ? parseFloat(data.course_fee) : 0.00;
    data.max_students = data.max_students ? parseInt(data.max_students) : null;
    data.published = parseInt(data.published);
    data.created_by = parseInt(data.created_by);

    try {
        const response = await fetch('/admin/create_course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === 'success') {
            Swal.fire({
                title: 'Success!',
                text: result.message,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = redirectUrl;
            });
        } else {
            Swal.fire('Error', result.message, 'error');
        }

    } catch (error) {
        Swal.fire('Error', 'Request failed: ' + error, 'error');
    }
});

// Logout Modal Functionality
$(document).ready(function() {
    const logoutModal = $('#logout-modal');
    const logoutUrl = logoutModal.data('logout-url');
    
    // Open modal when logout is clicked
    $('#logout-trigger').click(function(e) {
        e.preventDefault();
        logoutModal.fadeIn();
    });
    
    // Close modal when No is clicked
    $('.close-modal').click(function() {
        logoutModal.fadeOut();
    });
    
    // Close modal when clicking outside
    $(window).click(function(e) {
        if ($(e.target).is('#logout-modal')) {
            logoutModal.fadeOut();
        }
    });
    
    // Confirm logout
    $('#confirm-logout').click(function() {
        window.location.href = logoutUrl;
    });
});