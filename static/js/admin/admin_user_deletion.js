document.addEventListener('DOMContentLoaded', function () {
    let selectedUserId = null;
    let selectedUserName = null;

    const userTable = document.getElementById('userTable');
    const modal = document.getElementById('confirmationModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const closeModal = document.querySelectorAll('.close-modal');
    const statusMessage = document.getElementById('status-message');
    const messageText = document.getElementById('message-text');

    // Search/filter input elements
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');

    // Modal elements for user details
    const userFullName = document.getElementById('userFullName');
    const userId = document.getElementById('userId');
    const userUsername = document.getElementById('userUsername');
    const userEmail = document.getElementById('userEmail');
    const userContact = document.getElementById('userContact');
    const userRole = document.getElementById('userRole');
    const userStatus = document.getElementById('userStatus');
    const userDateRegistered = document.getElementById('userDateRegistered');

    // Trigger live search and filter
    searchInput.addEventListener('input', fetchSearchResults);
    roleFilter.addEventListener('change', fetchSearchResults);

    fetchActiveUsers();

    // Event listeners for modal
    closeModal.forEach(btn => {
        btn.addEventListener('click', () => hideModal());
    });
    
    cancelDeleteBtn.addEventListener('click', () => hideModal());
    confirmDeleteBtn.addEventListener('click', deleteUser);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Event delegation for delete buttons
    userTable.addEventListener('click', function (e) {
        if (e.target.closest('.delete-btn')) {
            const deleteBtn = e.target.closest('.delete-btn');
            selectedUserId = deleteBtn.dataset.userid;
            showUserDetails(selectedUserId);
        }
    });

    function showModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Add animation class
        modal.querySelector('.modal-content').style.animation = 'slideUp 0.3s ease';
    }

    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        selectedUserId = null;
        selectedUserName = null;
    }

    function fetchActiveUsers() {
        const tbody = userTable.querySelector('tbody');
        tbody.innerHTML = `
            <tr class="loading-row">
                <td colspan="9">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <span>Loading active users...</span>
                    </div>
                </td>
            </tr>
        `;

        fetch(window.appUrls.activeUsers)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.users && data.users.length > 0) {
                    renderUserTable(data.users);
                } else {
                    tbody.innerHTML = `
                        <tr class="no-results">
                            <td colspan="9" style="text-align: center; padding: 3rem; color: #64748b;">
                                <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                                <p>No active users found</p>
                            </td>
                        </tr>
                    `;
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                tbody.innerHTML = `
                    <tr class="error-row">
                        <td colspan="9" style="text-align: center; padding: 3rem; color: #dc2626;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <p>Error loading users. Please try again.</p>
                            <small>${error.message}</small>
                        </td>
                    </tr>
                `;
                showStatusMessage('Error loading users: ' + error.message, 'danger');
            });
    }

    function fetchSearchResults() {
        const query = searchInput.value;
        const role = roleFilter.value;

        // Show loading state
        const tbody = userTable.querySelector('tbody');
        tbody.innerHTML = `
            <tr class="loading-row">
                <td colspan="9">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <span>Searching users...</span>
                    </div>
                </td>
            </tr>
        `;

        // Simulate search - you'll need to implement actual search endpoint
        fetch(window.appUrls.activeUsers)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.users) {
                    let filteredUsers = data.users;
                    
                    // Filter by role
                    if (role !== 'all') {
                        filteredUsers = filteredUsers.filter(user => 
                            user.role.toLowerCase() === role.toLowerCase()
                        );
                    }
                    
                    // Filter by search query
                    if (query.trim() !== '') {
                        const searchTerm = query.toLowerCase();
                        filteredUsers = filteredUsers.filter(user => 
                            user.username.toLowerCase().includes(searchTerm) ||
                            user.email.toLowerCase().includes(searchTerm) ||
                            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm)
                        );
                    }
                    
                    renderUserTable(filteredUsers);
                } else {
                    tbody.innerHTML = `
                        <tr class="no-results">
                            <td colspan="9" style="text-align: center; padding: 3rem; color: #64748b;">
                                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                                <p>No users found matching your criteria</p>
                            </td>
                        </tr>
                    `;
                }
            })
            .catch(err => {
                console.error('Search error:', err);
                tbody.innerHTML = `
                    <tr class="error-row">
                        <td colspan="9" style="text-align: center; padding: 3rem; color: #dc2626;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <p>Error fetching search results</p>
                            <small>${err.message}</small>
                        </td>
                    </tr>
                `;
                showStatusMessage('Search failed: ' + err.message, 'danger');
            });
    }

    function showUserDetails(userId) {
        // Show loading state in modal
        userFullName.textContent = 'Loading...';
        userId.textContent = '-';
        userUsername.textContent = '-';
        userEmail.textContent = '-';
        userContact.textContent = '-';
        userRole.textContent = '-';
        userStatus.textContent = '-';
        userDateRegistered.textContent = '-';
        
        // Reset badge classes
        userRole.className = 'detail-value role-badge';
        userStatus.className = 'detail-value status-badge';
        
        showModal();

        // Fetch user details - you'll need to implement this endpoint
        fetch(window.appUrls.activeUsers)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.users) {
                    const user = data.users.find(u => u.user_id == userId);
                    if (user) {
                        selectedUserName = [user.first_name, user.middle_name, user.last_name]
                            .filter(n => n).join(' ');

                        // Update modal with user details
                        userFullName.textContent = selectedUserName;
                        userId.textContent = user.user_id || '-';
                        userUsername.textContent = user.username || '-';
                        userEmail.textContent = user.email || '-';
                        userContact.textContent = user.contact_number || 'N/A';
                        userRole.textContent = user.role || '-';
                        userStatus.textContent = user.account_status || '-';
                        userDateRegistered.textContent = user.date_registered || '-';
                        
                        // Add appropriate classes for badges
                        if (user.role) {
                            userRole.classList.add(user.role.toLowerCase());
                        }
                        if (user.account_status) {
                            userStatus.classList.add(user.account_status.toLowerCase());
                        }
                    } else {
                        hideModal();
                        showStatusMessage('User not found', 'danger');
                    }
                } else {
                    hideModal();
                    showStatusMessage('Failed to retrieve user details', 'danger');
                }
            })
            .catch(error => {
                console.error('Error loading user details:', error);
                hideModal();
                showStatusMessage('Error loading user details: ' + error.message, 'danger');
            });
    }

    function renderUserTable(users) {
        const tbody = userTable.querySelector('tbody');
        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = `
                <tr class="no-results">
                    <td colspan="9" style="text-align: center; padding: 3rem; color: #64748b;">
                        <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>No users found</p>
                    </td>
                </tr>
            `;
            return;
        }

        users.forEach(user => {
            const fullName = [user.first_name, user.middle_name, user.last_name]
                .filter(name => name).join(' ');
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.user_id}</td>
                <td>
                    <strong>${user.username}</strong>
                </td>
                <td>${fullName}</td>
                <td>${user.email}</td>
                <td>${user.contact_number || 'N/A'}</td>
                <td>${user.date_registered}</td>
                <td>
                    <span class="role-badge ${user.role ? user.role.toLowerCase() : ''}">
                        ${user.role}
                    </span>
                </td>
                <td>
                    <span class="status-badge ${user.account_status ? user.account_status.toLowerCase() : ''}">
                        ${user.account_status}
                    </span>
                </td>
                <td>
                    <button class="action-btn delete-btn" data-userid="${user.user_id}">
                        <i class="fas fa-trash-alt"></i>
                        Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function deleteUser() {
        if (!selectedUserId) {
            showStatusMessage('No user selected for deletion', 'danger');
            return;
        }

        // Disable button and show loading state
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

        fetch(window.appUrls.deleteUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: selectedUserId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showStatusMessage(`User "${selectedUserName}" has been successfully deleted and archived.`, 'success');
                fetchActiveUsers();
            } else {
                showStatusMessage('Failed to delete user: ' + (data.message || 'Unknown error'), 'danger');
            }
        })
        .catch(error => {
            console.error('Delete error:', error);
            showStatusMessage('Error deleting user: ' + error.message, 'danger');
        })
        .finally(() => {
            hideModal();
            // Reset button state
            setTimeout(() => {
                confirmDeleteBtn.disabled = false;
                confirmDeleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete User Permanently';
            }, 500);
        });
    }

    function showStatusMessage(message, type) {
        statusMessage.className = `alert ${type}`;
        messageText.textContent = message;
        statusMessage.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
        
        // Scroll to top to show message
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});