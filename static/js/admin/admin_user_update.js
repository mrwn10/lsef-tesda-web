$(document).ready(function () {
    let users = [];
    let currentUserId = null;
    const modal = $('#userDetailsModal');
    const statusMessage = $('#status-message');
    const messageText = $('#message-text');

    // Load all active users
    function loadActiveUsers() {
        const tbody = $('#userTable tbody');
        tbody.html('<tr class="loading-row"><td colspan="9"><div class="loading-spinner"><div class="spinner"></div><span>Loading active users...</span></div></td></tr>');

        $.ajax({
            url: window.appUrls.activeUsers,
            method: 'GET',
            success: function (response) {
                if (response.users && response.users.length > 0) {
                    users = response.users;
                    renderUserTable();
                } else {
                    tbody.html('<tr class="no-results"><td colspan="9">No active users found</td></tr>');
                }
            },
            error: function (xhr) {
                tbody.html('<tr class="error-row"><td colspan="9">Error loading users. Please try again.</td></tr>');
                showStatusMessage('Error loading user data: ' + (xhr.responseJSON?.message || 'Server error'), 'danger');
            }
        });
    }

    // Render user table
    function renderUserTable(filteredUsers = null) {
        const userList = filteredUsers || users;
        const tbody = $('#userTable tbody');
        tbody.empty();

        if (userList.length === 0) {
            tbody.html('<tr class="no-results"><td colspan="9">No users found</td></tr>');
            return;
        }

        userList.forEach(user => {
            const registeredDate = new Date(user.date_registered).toLocaleString();
            const fullName = [user.first_name, user.middle_name, user.last_name].filter(name => name).join(' ');

            const row = `
                <tr>
                    <td>${user.user_id}</td>
                    <td>${user.username}</td>
                    <td>${fullName}</td>
                    <td>${user.email}</td>
                    <td>${user.contact_number || 'N/A'}</td>
                    <td>${registeredDate}</td>
                    <td><span class="role-badge ${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
                    <td><span class="status-badge ${user.account_status.toLowerCase()}">${user.account_status}</span></td>
                    <td>
                        <button class="edit-btn" data-userid="${user.user_id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    // View and edit user details
    function viewUserDetails(userId) {
        currentUserId = userId;
        const detailsContainer = $('#userDetailsContainer');
        detailsContainer.html('<div class="loading-spinner"><div class="spinner"></div><span>Loading user details...</span></div>');
        modal.show();
        $('body').css('overflow', 'hidden');

        $.ajax({
            url: window.appUrls.userDetails.replace('0', userId),
            method: 'GET',
            success: function (response) {
                if (response.success) {
                    const user = response.user;
                    const termsStatus = user.terms_accepted ? 'Accepted' : 'Not Accepted';
                    const dob = user.date_of_birth || '';

                    detailsContainer.html(`
                        <div class="form-group">
                            <label for="username">Username:</label>
                            <input type="text" id="username" class="form-control" value="${user.username}" readonly>
                        </div>
                        <div class="form-group">
                            <label for="user-id">User ID:</label>
                            <input type="text" id="user-id" class="form-control" value="${user.user_id}" readonly>
                        </div>

                        <div class="form-group">
                            <label for="first-name">First Name:</label>
                            <input type="text" id="first-name" class="form-control" value="${user.first_name}">
                        </div>
                        <div class="form-group">
                            <label for="middle-name">Middle Name:</label>
                            <input type="text" id="middle-name" class="form-control" value="${user.middle_name || ''}">
                        </div>

                        <div class="form-group">
                            <label for="last-name">Last Name:</label>
                            <input type="text" id="last-name" class="form-control" value="${user.last_name}">
                        </div>
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" class="form-control" value="${user.email}">
                        </div>

                        <div class="form-group">
                            <label for="contact-number">Contact Number:</label>
                            <input type="text" id="contact-number" class="form-control" value="${user.contact_number || ''}">
                        </div>
                        <div class="form-group">
                            <label for="password">Password: <small>(Leave blank to keep current)</small></label>
                            <input type="password" id="password" class="form-control" placeholder="Enter new password">
                        </div>

                        <div class="form-group">
                            <label for="date-of-birth">Date of Birth:</label>
                            <input type="date" id="date-of-birth" class="form-control" value="${dob}">
                        </div>
                        <div class="form-group">
                            <label for="gender">Gender:</label>
                            <select id="gender" class="form-control">
                                <option value="" ${!user.gender ? 'selected' : ''}>Not specified</option>
                                <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Male</option>
                                <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Female</option>
                                <option value="other" ${user.gender === 'other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="province">Province:</label>
                            <input type="text" id="province" class="form-control" value="${user.province || ''}">
                        </div>
                        <div class="form-group">
                            <label for="municipality">Municipality:</label>
                            <input type="text" id="municipality" class="form-control" value="${user.municipality || ''}">
                        </div>

                        <div class="form-group">
                            <label for="baranggay">Baranggay:</label>
                            <input type="text" id="baranggay" class="form-control" value="${user.baranggay || ''}">
                        </div>
                        <div class="form-group">
                            <label for="role">Role:</label>
                            <input type="text" id="role" class="form-control" value="${user.role.charAt(0).toUpperCase() + user.role.slice(1)}" readonly>
                        </div>

                        <div class="form-group">
                            <label for="account-status">Status:</label>
                            <input type="text" id="account-status" class="form-control" value="${user.account_status}" readonly>
                        </div>
                        <div class="form-group">
                            <label for="terms-accepted">Terms Accepted:</label>
                            <input type="text" id="terms-accepted" class="form-control" value="${termsStatus}" readonly>
                        </div>
                    `);
                } else {
                    modal.hide();
                    $('body').css('overflow', 'auto');
                    showStatusMessage('User not found', 'danger');
                }
            },
            error: function () {
                modal.hide();
                $('body').css('overflow', 'auto');
                showStatusMessage('Error loading user details', 'danger');
            }
        });
    }

    // Update user details
    function updateUser() {
        if (!currentUserId) return;

        const payload = {
            user_id: currentUserId,
            first_name: $('#first-name').val().trim(),
            middle_name: $('#middle-name').val().trim(),
            last_name: $('#last-name').val().trim(),
            email: $('#email').val().trim(),
            contact_number: $('#contact-number').val().trim(),
            date_of_birth: $('#date-of-birth').val(),
            gender: $('#gender').val(),
            province: $('#province').val().trim(),
            municipality: $('#municipality').val().trim(),
            baranggay: $('#baranggay').val().trim()
        };

        // Basic validation
        if (!payload.first_name || !payload.last_name || !payload.email) {
            showStatusMessage('First name, last name, and email are required fields', 'danger');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
            showStatusMessage('Please enter a valid email address', 'danger');
            return;
        }

        // If password is entered, include it in payload
        const newPassword = $('#password').val().trim();
        if (newPassword.length > 0) {
            payload.password = newPassword;
        }

        $.ajax({
            url: window.appUrls.updateUser,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (response) {
                if (response.success) {
                    showStatusMessage('User updated successfully', 'success');
                    modal.hide();
                    $('body').css('overflow', 'auto');
                    loadActiveUsers();
                } else {
                    showStatusMessage(response.message || 'Update failed', 'danger');
                }
            },
            error: function (xhr) {
                showStatusMessage('Error updating user: ' + (xhr.responseJSON?.message || 'Server error'), 'danger');
            }
        });
    }

    // Search and filter users
    function searchUsers() {
        const keyword = $('#search-input').val().toLowerCase();
        const selectedRole = $('#role-filter').val();

        const filteredUsers = users.filter(user => {
            const fullName = [user.first_name, user.middle_name, user.last_name].filter(name => name).join(' ').toLowerCase();
            const matchesKeyword = user.username.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword) ||
                fullName.includes(keyword);

            const matchesRole = selectedRole === 'all' || user.role === selectedRole;
            return matchesKeyword && matchesRole;
        });

        renderUserTable(filteredUsers);
    }

    // Show status messages
    function showStatusMessage(message, type) {
        statusMessage.removeClass().addClass(`alert ${type}`);
        messageText.text(message);
        statusMessage.show();
        setTimeout(() => statusMessage.hide(), 4000);
    }

    // Event handlers
    $('#userTable').on('click', '.edit-btn', function() {
        const userId = $(this).data('userid');
        viewUserDetails(userId);
    });

    $('#search-input, #role-filter').on('input change', searchUsers);

    // Close modal when clicking outside
    $(document).on('click', function(e) {
        if ($(e.target).hasClass('modal')) {
            modal.hide();
            $('body').css('overflow', 'auto');
        }
    });

    // Close modal with Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && modal.is(':visible')) {
            modal.hide();
            $('body').css('overflow', 'auto');
        }
    });

    // Update button handler
    $(document).on('click', '.update-btn', function() {
        updateUser();
    });

    // Cancel button handler
    $(document).on('click', '.cancel-btn, .close-modal', function() {
        modal.hide();
        $('body').css('overflow', 'auto');
    });

    // Initial load
    loadActiveUsers();
});