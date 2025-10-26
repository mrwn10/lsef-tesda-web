// admin_user_management.js - Complete Fixed Version with Consistent Modal Pattern and Loading Screen
$(document).ready(function() {
    let users = [];
    let currentUserId = null;
    const $searchInput = $('#search-input');
    const $roleFilter = $('#role-filter');
    
    // Initialize all modal functionality
    function initModals() {
        // Close modal function - works for ALL modals
        function closeAllModals() {
            $('.modal').fadeOut(300);
        }

        // Close modal when clicking outside - works for ALL modals
        $(document).on('click', function(e) {
            if ($(e.target).hasClass('modal')) {
                closeAllModals();
            }
        });

        // Escape key to close modals - works for ALL modals
        $(document).keyup(function(e) {
            if (e.keyCode === 27) {
                closeAllModals();
            }
        });

        // ===== SPECIFIC MODAL FUNCTIONALITY =====

        // Logout Modal
        $('#logout-trigger').click(function(e) {
            e.preventDefault();
            $('#logout-modal').fadeIn();
        });
        
        $('#cancel-logout').click(function() {
            $('#logout-modal').fadeOut();
        });
        
        $('#confirm-logout').click(function() {
            window.location.href = window.appUrls.logoutUrl;
        });

        // User Details Modal Flow
        $('#closeDetailsModal').click(function() {
            $('#userDetailsModal').fadeOut();
        });

        // Approve User Flow
        $('#approveUserBtn').click(function() {
            $('#userDetailsModal').fadeOut();
            $('#approvalModal').fadeIn();
        });

        $('#cancelApproval').click(function() {
            $('#approvalModal').fadeOut();
            $('#userDetailsModal').fadeIn();
        });

        $('#confirmApproval').click(function() {
            if (currentUserId) {
                $('#approvalModal').fadeOut();
                showLoadingScreen('Approving user...');
                updateUserStatus(currentUserId, 'approved');
            }
        });

        // Reject User Flow
        $('#rejectUserBtn').click(function() {
            $('#userDetailsModal').fadeOut();
            $('#rejectionModal').fadeIn();
        });

        $('#cancelRejection').click(function() {
            $('#rejectionModal').fadeOut();
            $('#userDetailsModal').fadeIn();
        });

        $('#confirmRejection').click(function() {
            if (currentUserId) {
                $('#rejectionModal').fadeOut();
                showLoadingScreen('Rejecting user...');
                updateUserStatus(currentUserId, 'rejected');
            }
        });

        // Success Modals
        $('#closeSuccessModal').click(function() {
            $('#successModal').fadeOut();
            loadPendingUsers();
        });

        $('#closeRejectionSuccessModal').click(function() {
            $('#rejectionSuccessModal').fadeOut();
            loadPendingUsers();
        });

        // Alert close
        $('.close-alert').click(function() {
            $('#status-message').fadeOut();
        });
    }
    
    // Show loading screen during approval/rejection
    function showLoadingScreen(message) {
        // Create loading screen if it doesn't exist
        if ($('#loading-screen').length === 0) {
            $('body').append(`
                <div id="loading-screen" class="modal" style="display: none; z-index: 3000;">
                    <div class="modal-content" style="width: 300px; text-align: center;">
                        <div class="modal-body">
                            <div class="loading-spinner" style="margin-bottom: 15px;">
                                <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto;"></div>
                            </div>
                            <p id="loading-message" style="margin: 0; font-size: 16px; color: #333;">${message}</p>
                        </div>
                    </div>
                </div>
            `);
        } else {
            $('#loading-message').text(message);
        }
        
        $('#loading-screen').fadeIn();
    }
    
    // Hide loading screen
    function hideLoadingScreen() {
        $('#loading-screen').fadeOut();
    }
    
    // Load pending users with optional search/filter
    function loadPendingUsers(query = '', role = 'all') {
        showLoadingState(true);

        $.ajax({
            url: '/admin/user-management/search_users', 
            method: 'GET',
            data: { 
                query: query, 
                role: role
            },
            success: function(response) {
                showLoadingState(false);

                if (response.success && response.users && response.users.length > 0) {
                    users = response.users;
                    renderUserTable();
                } else {
                    renderEmptyState();
                }
            },
            error: function(xhr) {
                showLoadingState(false);
                showStatusMessage('Error loading user data: ' + (xhr.responseJSON?.message || 'Server error'), 'danger');
            }
        });
    }
    
    // Show/hide loading state
    function showLoadingState(show) {
        if (show) {
            $('#users-container').html(`
                <tr class="loading-row">
                    <td colspan="7">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            <span>Loading users...</span>
                        </div>
                    </td>
                </tr>
            `);
        }
    }
    
    // Render empty state
    function renderEmptyState() {
        $('#users-container').html(`
            <tr>
                <td colspan="7" class="no-results">
                    <div class="empty-state">
                        <i class="fas fa-user-slash"></i>
                        <h3>No Pending Users Found</h3>
                        <p>There are currently no users awaiting approval.</p>
                    </div>
                </td>
            </tr>
        `);
    }
    
    // Render all users in a table
    function renderUserTable() {
        let tableHtml = '';
        
        users.forEach(user => {
            const registerDate = new Date(user.date_registered);
            const formattedDate = registerDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            tableHtml += `
                <tr data-user-id="${user.user_id}">
                    <td>${user.full_name || 'N/A'}</td>
                    <td>${user.email}</td>
                    <td>${user.username}</td>
                    <td><span class="role-badge ${user.role.toLowerCase()}">${user.role}</span></td>
                    <td>${formattedDate}</td>
                    <td><span class="status-badge pending">Pending</span></td>
                    <td>
                        <div class="action-btn-group">
                            <button class="action-btn view-btn view-details-btn" data-user-id="${user.user_id}" title="View Details">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        $('#users-container').html(tableHtml);
    }
    
    // View detailed user information
    function viewUserDetails(userId) {
        currentUserId = userId;
        window.currentUserId = userId;
        
        // Show loading state
        $('#userDetailsContent').html(`
            <div class="loading-spinner">
                <div class="spinner"></div>
                <span>Loading user details...</span>
            </div>
        `);
        
        $('#userDetailsModal').fadeIn();
        
        // Load user details via AJAX
        $.get(window.appUrls.userDetails.replace('0', userId))
            .done(function(response) {
                if (response.success) {
                    const user = response.user;
                    const dob = user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not specified';
                    
                    let detailsHtml = `
                        <div class="user-details-form">
                            <div class="detail-row">
                                <div class="detail-label">Full Name:</div>
                                <div class="detail-value">${user.first_name} ${user.middle_name || ''} ${user.last_name}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Email:</div>
                                <div class="detail-value">${user.email}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Username:</div>
                                <div class="detail-value">${user.username}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Role:</div>
                                <div class="detail-value"><span class="role-badge ${user.role.toLowerCase()}">${user.role}</span></div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Contact Number:</div>
                                <div class="detail-value">${user.contact_number || 'Not provided'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Date of Birth:</div>
                                <div class="detail-value">${dob}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Gender:</div>
                                <div class="detail-value">${user.gender || 'Not specified'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Complete Address:</div>
                                <div class="detail-value">${user.full_address || 'Not provided'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Registration Date:</div>
                                <div class="detail-value">${new Date(user.date_registered).toLocaleDateString()}</div>
                            </div>
                        </div>
                    `;
                    
                    $('#userDetailsContent').html(detailsHtml);
                } else {
                    $('#userDetailsContent').html(`
                        <div class="error-message">
                            <i class="fas fa-exclamation-triangle"></i>
                            Failed to load user details: ${response.message}
                        </div>
                    `);
                }
            })
            .fail(function() {
                $('#userDetailsContent').html(`
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        Failed to load user details. Please try again.
                    </div>
                `);
            });
    }

    // Update user status function
    function updateUserStatus(userId, status) {
        const approveBtn = $('#confirmApproval');
        const rejectBtn = $('#confirmRejection');
        const button = status === 'approved' ? approveBtn : rejectBtn;
        
        // Show loading state
        button.addClass('loading').prop('disabled', true);
        
        // Convert frontend status to backend status
        const backendStatus = status === 'approved' ? 'active' : 'inactive';
        
        $.ajax({
            url: window.appUrls.updateStatus,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: userId,
                status: backendStatus
            }),
            success: function(response) {
                button.removeClass('loading').prop('disabled', false);
                hideLoadingScreen();
                
                if (response.success) {
                    if (status === 'approved') {
                        $('#successMessage').text('User has been approved successfully and can now access the system.');
                        $('#successModal').fadeIn();
                    } else {
                        $('#rejectionSuccessMessage').text('User has been rejected successfully.');
                        $('#rejectionSuccessModal').fadeIn();
                    }
                    
                    // Refresh the user list after successful action
                    setTimeout(() => {
                        loadPendingUsers();
                    }, 1000);
                } else {
                    showStatusMessage('Error: ' + (response.message || 'Unknown error occurred'), 'danger');
                    // Re-open user details modal if there was an error
                    $('#userDetailsModal').fadeIn();
                }
            },
            error: function(xhr, status, error) {
                button.removeClass('loading').prop('disabled', false);
                hideLoadingScreen();
                
                let errorMessage = 'Error updating user status';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage += ': ' + xhr.responseJSON.message;
                } else {
                    errorMessage += ': ' + error;
                }
                
                showStatusMessage(errorMessage, 'danger');
                // Re-open user details modal if there was an error
                $('#userDetailsModal').fadeIn();
            }
        });
    }
    
    // Show status message
    function showStatusMessage(message, type) {
        const $alert = $('#status-message');
        const $messageText = $('#message-text');
        
        $alert.removeClass('success danger warning').addClass(type);
        $messageText.text(message);
        $alert.fadeIn();
        
        // Auto-hide after 5 seconds
        setTimeout(() => $alert.fadeOut(), 5000);
    }
    
    // Search functionality with debounce
    let searchTimeout = null;
    function doSearch() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const keyword = $searchInput.val().trim();
            const role = $roleFilter.val();
            loadPendingUsers(keyword, role);
        }, 300);
    }

    // Event listeners
    $(document).on('click', '.view-details-btn', function() {
        const userId = $(this).data('user-id');
        viewUserDetails(userId);
    });
    
    $searchInput.on('input', doSearch);
    $roleFilter.on('change', doSearch);
    
    // Initialization
    initModals();
    loadPendingUsers();
});