$(document).ready(function() {
    function fetchProfileData() {
        $.ajax({
            url: fetchProfileUrl, 
            type: "GET",
            success: function(response) {
                if (response.success) {
                    const staff = response.staff;

                    $('#first_name').val(staff.first_name || '');
                    $('#middle_name').val(staff.middle_name || '');
                    $('#last_name').val(staff.last_name || '');
                    $('#contact_number').val(staff.contact_number || '');
                    $('#date_of_birth').val(staff.date_of_birth || '');
                    $('#gender').val(staff.gender || '');

                    $('#username').val(staff.username || '');
                    $('#email').val(staff.email || '');

                    $('#province').val(staff.province || '');
                    $('#municipality').val(staff.municipality || '');
                    $('#baranggay').val(staff.baranggay || '');

                    if (staff.profile_picture_url) {
                        $('#profile-preview').attr('src', staff.profile_picture_url);
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

                    if (response.updated_profile && response.updated_profile.profile_picture_url) {
                        $('#profile-preview').attr('src', response.updated_profile.profile_picture_url);
                    }

                    $('#current_password, #new_password, #confirm_password').val('');
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

    $('#remove-picture').click(function() {
        $('#profile_picture').val('');
        $('#profile-preview').attr('src', defaultProfilePic);
    });

    $('.toggle-password').click(function() {
        const input = $(this).siblings('input');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        $(this).toggleClass('fa-eye fa-eye-slash');
    });

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
        const colors = ['#d9534f', '#f0ad4e', '#5bc0de', '#5cb85c', '#5cb85c'];

        $('.strength-bar').removeClass('active');
        for (let i = 0; i < strength; i++) {
            $('.strength-bar').eq(i).addClass('active').css('background-color', colors[strength]);
        }

        $('.strength-text span').text(strengthTexts[strength]).css('color', colors[strength]);
    }

    function showMessage(message, type) {
        const messageDiv = $('#message-content');
        messageDiv.text(message).removeClass().addClass('message ' + type);
        $('#message-container').fadeIn();

        setTimeout(function() {
            $('#message-container').fadeOut();
        }, 5000);
    }

    fetchProfileData();
});
