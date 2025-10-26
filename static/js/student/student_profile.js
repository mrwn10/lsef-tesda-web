$(document).ready(function() {

    // Fetch student profile data
    function fetchProfileData() {
        $.ajax({
            url: fetchProfileUrl,
            type: "GET",
            success: function(response) {
                if (response.success) {
                    const student = response.student;
                    
                    // Personal Information
                    $('#first_name').val(student.first_name || '');
                    $('#middle_name').val(student.middle_name || '');
                    $('#last_name').val(student.last_name || '');
                    $('#contact_number').val(student.contact_number || '');
                    $('#date_of_birth').val(student.date_of_birth || '');
                    $('#gender').val(student.gender || '');
                    
                    // Account Information
                    $('#username').val(student.username || '');
                    $('#email').val(student.email || '');
                    
                    // Address Information
                    $('#province').val(student.province || '');
                    $('#municipality').val(student.municipality || '');
                    $('#baranggay').val(student.baranggay || '');
                    
                    // Profile Picture
                    if (student.profile_picture_url) {
                        $('#profile-preview').attr('src', student.profile_picture_url);
                    } else {
                        $('#profile-preview').attr('src', defaultProfilePic);
                    }
                } else {
                    showMessage(response.error || 'Failed to load profile data', 'error');
                }
            },
            error: function(xhr, status, error) {
                showMessage('Error fetching profile data: ' + error, 'error');
            }
        });
    }

    // Handle form submission
    $('#profile-form').submit(function(e) {
        e.preventDefault();

        const formData = new FormData(this);

        $.ajax({
            url: updateProfileUrl,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showMessage(response.message, 'success');

                    // Update profile picture if changed
                    if (response.updated_profile.profile_picture_url) {
                        $('#profile-preview').attr('src', response.updated_profile.profile_picture_url);
                    }

                    // Clear password fields if they were updated
                    $('#current_password').val('');
                    $('#new_password').val('');
                    $('#confirm_password').val('');
                } else {
                    showMessage(response.error || 'Failed to update profile', 'error');
                }
            },
            error: function(xhr, status, error) {
                let errorMsg = 'Error updating profile';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg = xhr.responseJSON.error;
                }
                showMessage(errorMsg, 'error');
            }
        });
    });

    // Profile picture preview
    $('#profile_picture').change(function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#profile-preview').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // Remove profile picture
    $('#remove-picture').click(function() {
        $('#profile_picture').val('');
        $('#profile-preview').attr('src', defaultProfilePic);
    });

    // Toggle password visibility
    $('.toggle-password').click(function() {
        const input = $(this).siblings('input');
        const icon = $(this);
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        icon.toggleClass('fa-eye fa-eye-slash');
    });

    // Password strength indicator
    $('#new_password').on('input', function() {
        const password = $(this).val();
        const strength = checkPasswordStrength(password);
        updatePasswordStrengthIndicator(strength);
    });

    function checkPasswordStrength(password) {
        if (!password) return 0;

        let strength = 0;
        if (password.length >= 4) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;

        return Math.min(strength, 4);
    }

    function updatePasswordStrengthIndicator(strength) {
        const strengthTexts = ['None', 'Weak', 'Fair', 'Good', 'Strong'];
        $('#password-strength-text').text(strengthTexts[strength]);
    }

    // Initial fetch
    fetchProfileData();
});
