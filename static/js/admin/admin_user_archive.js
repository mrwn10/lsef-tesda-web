document.addEventListener('DOMContentLoaded', function () {
    // UI Elements
    const archivedUserTable = document.getElementById('archivedUserTable');
    const statusMessage = document.getElementById('status-message');
    const messageText = document.getElementById('message-text');
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');

    // Modal elements
    const restoreModal = document.getElementById('restoreModal');
    const deleteModal = document.getElementById('deleteModal');
    const confirmRestoreBtn = document.getElementById('confirmRestoreBtn');
    const cancelRestoreBtn = document.getElementById('cancelRestoreBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Restore modal elements
    const restoreUserName = document.getElementById('restoreUserName');
    const restoreUserId = document.getElementById('restoreUserId');
    const restoreUsername = document.getElementById('restoreUsername');
    const restoreEmail = document.getElementById('restoreEmail');
    const restoreContact = document.getElementById('restoreContact');
    const restoreRole = document.getElementById('restoreRole');
    const restoreDateRegistered = document.getElementById('restoreDateRegistered');

    // Delete modal elements
    const deleteUserName = document.getElementById('deleteUserName');
    const deleteUserId = document.getElementById('deleteUserId');
    const deleteUsername = document.getElementById('deleteUsername');
    const deleteEmail = document.getElementById('deleteEmail');
    const deleteContact = document.getElementById('deleteContact');
    const deleteRole = document.getElementById('deleteRole');
    const deleteDateRegistered = document.getElementById('deleteDateRegistered');

    let currentArchiveId = null;
    let currentUserData = null;

    // Initialize modals
    function initModals() {
        // Close modals when clicking X or cancel buttons
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                hideModals();
            });
        });

        cancelRestoreBtn.addEventListener('click', () => {
            hideModals();
        });

        cancelDeleteBtn.addEventListener('click', () => {
            hideModals();
        });

        // Close when clicking outside modal content
        window.addEventListener('click', (event) => {
            if (event.target === restoreModal) {
                hideModals();
            }
            if (event.target === deleteModal) {
                hideModals();
            }
        });

        // Confirm actions
        confirmRestoreBtn.addEventListener('click', () => {
            if (currentArchiveId) {
                restoreUser(currentArchiveId);
            }
        });

        confirmDeleteBtn.addEventListener('click', () => {
            if (currentArchiveId) {
                deleteUser(currentArchiveId);
            }
        });
    }

    function hideModals() {
        restoreModal.style.display = 'none';
        deleteModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentArchiveId = null;
        currentUserData = null;
    }

    function showModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    initModals();

    // Event listeners
    searchInput.addEventListener('input', fetchSearchResults);
    roleFilter.addEventListener('change', fetchSearchResults);

    // Initial load
    fetchArchivedUsers();

    // Table event delegation - FIXED: Proper event handling
    archivedUserTable.addEventListener('click', function (e) {
        const restoreBtn = e.target.closest('.restore-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        
        if (restoreBtn) {
            const archiveId = restoreBtn.dataset.archiveid;
            const userRow = restoreBtn.closest('tr');
            const userData = extractUserDataFromRow(userRow);
            
            currentArchiveId = archiveId;
            currentUserData = userData;
            showRestoreModal(userData);
            return;
        }
        
        if (deleteBtn) {
            const archiveId = deleteBtn.dataset.archiveid;
            const userRow = deleteBtn.closest('tr');
            const userData = extractUserDataFromRow(userRow);
            
            currentArchiveId = archiveId;
            currentUserData = userData;
            showDeleteModal(userData);
            return;
        }
    });

    function extractUserDataFromRow(userRow) {
        return {
            original_user_id: userRow.cells[0].textContent.trim(),
            username: userRow.cells[1].textContent.trim(),
            full_name: userRow.cells[2].textContent.trim(),
            email: userRow.cells[3].textContent.trim(),
            contact_number: userRow.cells[4].textContent.trim(),
            date_registered: userRow.cells[5].textContent.trim(),
            role: userRow.cells[6].querySelector('.role-badge').textContent.trim()
        };
    }

    // Modal functions
    function showRestoreModal(userData) {
        console.log('Showing restore modal for:', userData); // Debug log
        
        // Update modal with user details
        restoreUserName.textContent = userData.full_name || 'Unknown User';
        restoreUserId.textContent = userData.original_user_id || '-';
        restoreUsername.textContent = userData.username || '-';
        restoreEmail.textContent = userData.email || '-';
        restoreContact.textContent = userData.contact_number || 'N/A';
        restoreDateRegistered.textContent = userData.date_registered || '-';
        
        // Update role with proper badge
        restoreRole.textContent = userData.role || '-';
        restoreRole.className = 'detail-value role-badge';
        if (userData.role) {
            restoreRole.classList.add(userData.role.toLowerCase());
        }
        
        showModal(restoreModal);
    }

    function showDeleteModal(userData) {
        console.log('Showing delete modal for:', userData); // Debug log
        
        // Update modal with user details
        deleteUserName.textContent = userData.full_name || 'Unknown User';
        deleteUserId.textContent = userData.original_user_id || '-';
        deleteUsername.textContent = userData.username || '-';
        deleteEmail.textContent = userData.email || '-';
        deleteContact.textContent = userData.contact_number || 'N/A';
        deleteDateRegistered.textContent = userData.date_registered || '-';
        
        // Update role with proper badge
        deleteRole.textContent = userData.role || '-';
        deleteRole.className = 'detail-value role-badge';
        if (userData.role) {
            deleteRole.classList.add(userData.role.toLowerCase());
        }
        
        showModal(deleteModal);
    }

    // Data functions
    function fetchArchivedUsers() {
        const tbody = archivedUserTable.querySelector('tbody');
        tbody.innerHTML = `
            <tr class="loading-row">
                <td colspan="9">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <span>Loading archived users...</span>
                    </div>
                </td>
            </tr>
        `;

        fetch(window.appUrls.archivedUsers)
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
                                <i class="fas fa-archive" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                                <p>No archived users found</p>
                            </td>
                        </tr>
                    `;
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                tbody.innerHTML = `
                    <tr class="error-message">
                        <td colspan="9" style="text-align: center; padding: 3rem; color: #dc2626;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <p>Error loading archived users</p>
                            <small>${error.message}</small>
                        </td>
                    </tr>
                `;
                showStatusMessage('Error: ' + error.message, 'danger');
            });
    }

    function fetchSearchResults() {
        const query = searchInput.value.toLowerCase();
        const role = roleFilter.value;
        const tbody = archivedUserTable.querySelector('tbody');
        
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

        fetch(window.appUrls.archivedUsers)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.users) {
                    let filtered = data.users;

                    if (query) {
                        filtered = filtered.filter(user =>
                            (user.username && user.username.toLowerCase().includes(query)) ||
                            (user.full_name && user.full_name.toLowerCase().includes(query)) ||
                            (user.email && user.email.toLowerCase().includes(query))
                        );
                    }

                    if (role !== "all") {
                        filtered = filtered.filter(user => 
                            user.role && user.role.toLowerCase() === role.toLowerCase()
                        );
                    }

                    renderUserTable(filtered);
                }
            })
            .catch(err => {
                console.error('Search error:', err);
                tbody.innerHTML = `
                    <tr class="error-message">
                        <td colspan="9" style="text-align: center; padding: 3rem; color: #dc2626;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <p>Error searching users</p>
                            <small>${err.message}</small>
                        </td>
                    </tr>
                `;
                showStatusMessage('Search failed: ' + err.message, 'danger');
            });
    }

    function renderUserTable(users) {
        const tbody = archivedUserTable.querySelector('tbody');
        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = `
                <tr class="no-results">
                    <td colspan="9" style="text-align: center; padding: 3rem; color: #64748b;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>No matching users found</p>
                    </td>
                </tr>
            `;
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.original_user_id || user.user_id || '-'}</td>
                <td><strong>${user.username || '-'}</strong></td>
                <td>${user.full_name || '-'}</td>
                <td>${user.email || '-'}</td>
                <td>${user.contact_number || 'N/A'}</td>
                <td>${user.date_registered || '-'}</td>
                <td>
                    <span class="role-badge ${user.role ? user.role.toLowerCase() : ''}">
                        ${user.role || '-'}
                    </span>
                </td>
                <td><span class="status-badge archived">Archived</span></td>
                <td class="action-buttons">
                    <button class="action-btn restore-btn" data-archiveid="${user.archive_id}">
                        <i class="fas fa-undo-alt"></i> Restore
                    </button>
                    <button class="action-btn delete-btn" data-archiveid="${user.archive_id}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function restoreUser(archiveId) {
        // Disable button and show loading state
        confirmRestoreBtn.disabled = true;
        confirmRestoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Restoring...';

        fetch(window.appUrls.restoreUser, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ archive_id: archiveId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showStatusMessage(data.message, data.success ? 'success' : 'danger');
            if (data.success) {
                fetchArchivedUsers();
                hideModals();
            }
        })
        .catch(err => {
            console.error('Restore error:', err);
            showStatusMessage('Restore failed: ' + err.message, 'danger');
        })
        .finally(() => {
            // Reset button state
            setTimeout(() => {
                confirmRestoreBtn.disabled = false;
                confirmRestoreBtn.innerHTML = '<i class="fas fa-check-circle"></i> Restore User';
            }, 500);
        });
    }

    function deleteUser(archiveId) {
        // Disable button and show loading state
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

        fetch(window.appUrls.deleteUser, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ archive_id: archiveId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showStatusMessage(data.message, data.success ? 'success' : 'danger');
            if (data.success) {
                fetchArchivedUsers();
                hideModals();
            }
        })
        .catch(err => {
            console.error('Delete error:', err);
            showStatusMessage('Delete failed: ' + err.message, 'danger');
        })
        .finally(() => {
            // Reset button state
            setTimeout(() => {
                confirmDeleteBtn.disabled = false;
                confirmDeleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Permanently';
            }, 500);
        });
    }

    function showStatusMessage(msg, type) {
        statusMessage.style.display = 'flex';
        messageText.textContent = msg;
        statusMessage.className = `alert ${type}`;

        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
        
        // Scroll to top to show message
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});