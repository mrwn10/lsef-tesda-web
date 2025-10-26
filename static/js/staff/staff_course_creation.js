document.addEventListener('DOMContentLoaded', function() {
    const courseForm = document.getElementById('courseForm');
    
    if (courseForm) {
        courseForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const form = e.target;
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
            data.created_by = parseInt(data.created_by); // Ensure created_by is an integer

            try {
                const response = await fetch('/staff/create_course', {
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
                        // Get redirect URL from data attribute
                        const redirectUrl = document.body.getAttribute('data-redirect-url');
                        if (redirectUrl) {
                            window.location.href = redirectUrl;
                        } else {
                            // Fallback to current page if no redirect URL is set
                            window.location.reload();
                        }
                    });
                    form.reset();
                } else {
                    Swal.fire('Error', result.message, 'error');
                }

            } catch (error) {
                Swal.fire('Error', 'Request failed: ' + error, 'error');
            }
        });
    }
});