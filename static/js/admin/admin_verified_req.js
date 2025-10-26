// Modal instances
let fileModal = null;

$(document).ready(function() {
    // Initialize modal functionality
    initializeModals();
    
    const modal = $('#fileModal');
    const fileViewer = $('#fileViewer');
    const modalTitle = $('#modal-title');

    let currentPage = 1;

    // Load data dynamically
    function loadData(page = 1) {
        $('.loading-spinner').show();
        $('.stats-overview').hide();
        $('.table-section').hide();
        
        $.getJSON(window.appUrls.fetchData, { page: page }, function (data) {
            if (data.stats) {
                updateStats(data.stats);
            } else {
                // If no stats in main response, fetch them separately
                loadStats();
            }
            
            renderTable(data.students);
            renderPagination(data.total_pages, data.current_page);
            
            // Show content after loading
            setTimeout(function() {
                $('.loading-spinner').hide();
                $('.stats-overview').fadeIn();
                $('.table-section').fadeIn();
            }, 500);
        }).fail((xhr, status, error) => {
            console.error('Error loading data:', error);
            $('#studentsTableBody').html('<tr><td colspan="5" style="text-align:center;color:red;">Error loading data.</td></tr>');
            $('.loading-spinner').hide();
            $('.stats-overview').show();
            $('.table-section').show();
            
            // Try to load stats separately if main request fails
            loadStats();
        });
    }

    // Load statistics separately
    function loadStats() {
        $.getJSON(window.appUrls.getStats, function(stats) {
            updateStats(stats);
        }).fail((xhr, status, error) => {
            console.error('Error loading stats:', error);
            // Set default values if stats fail to load
            updateStats({
                pending: 0,
                verified: 0,
                total: 0
            });
        });
    }

    // Update statistics
    function updateStats(stats) {
        if (stats) {
            console.log('Updating stats with:', stats); // Debug log
            
            // Ensure we have numbers, not undefined
            const pending = parseInt(stats.pending) || 0;
            const verified = parseInt(stats.verified) || 0;
            const total = parseInt(stats.total) || 0;
            
            console.log(`Parsed stats - Pending: ${pending}, Verified: ${verified}, Total: ${total}`);
            
            animateValue('pending-count', pending, 0);
            animateValue('verified-count', verified, 100);
            animateValue('total-count', total, 200);
            
            // Show stats container
            $('.stats-overview').show();
        } else {
            console.error('No stats data received');
        }
    }

    // Animation function for numbers
    function animateValue(id, target, delay = 0) {
        setTimeout(function() {
            const obj = document.getElementById(id);
            if (!obj) {
                console.error('Element not found:', id);
                return;
            }
            
            let current = 0;
            const duration = 1000;
            const increment = target / (duration / 20);
            const startTime = Date.now();
            
            function update() {
                const elapsed = Date.now() - startTime;
                current = Math.min(target, (elapsed / duration) * target);
                
                obj.innerHTML = Math.floor(current);
                
                if (current < target) {
                    requestAnimationFrame(update);
                } else {
                    obj.innerHTML = target;
                }
            }
            
            update();
        }, delay);
    }

    // Render table
    function renderTable(students) {
        const tbody = $('#studentsTableBody');
        tbody.empty();

        if (students.length === 0) {
            tbody.html('<tr><td colspan="5" style="text-align:center;color:#64748b;padding:2rem;">No student records found.</td></tr>');
            return;
        }

        students.forEach((s, index) => {
            const statusBadge = s.verified === 'verified'
                ? `<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>`
                : `<span class="pending-badge"><i class="fas fa-clock"></i> Pending</span>`;

            let filesHTML = '<div class="documents-list">';
            const fields = [
                {key: 'birth_certificate', name: 'Birth Certificate'},
                {key: 'educational_credentials', name: 'Educational Credentials'},
                {key: 'id_photos', name: 'ID Photos'},
                {key: 'barangay_clearance', name: 'Barangay Clearance'},
                {key: 'medical_certificate', name: 'Medical Certificate'},
                {key: 'marriage_certificate', name: 'Marriage Certificate'},
                {key: 'valid_id', name: 'Valid ID'},
                {key: 'transcript_form', name: 'Transcript Form'},
                {key: 'good_moral_certificate', name: 'Good Moral Certificate'},
                {key: 'brown_envelope', name: 'Brown Envelope'}
            ];
            
            let fileCount = 0;
            fields.forEach(field => {
                if (s[field.key]) {
                    fileCount++;
                    filesHTML += `
                        <button class="btn-view" 
                                data-file="${s[field.key]}" 
                                data-user="${s.user_id}"
                                data-field="${field.key}"
                                title="${field.name}">
                            <i class="fas fa-file"></i>
                            <span class="tooltip">${field.name}</span>
                        </button>`;
                }
            });

            if (fileCount === 0) {
                filesHTML = '<span style="color:#64748b;font-size:0.85rem;">No documents</span>';
            } else {
                filesHTML += '</div>';
            }

            const actionHTML = s.verified !== 'verified'
                ? `<button class="btn-accept" data-user="${s.user_id}">
                    <i class="fas fa-check"></i> Verify
                   </button>`
                : `<i class="fas fa-check-circle" style="color:var(--success-green); font-size: 1.5rem;" title="Verified"></i>`;

            tbody.append(`
                <tr>
                    <td>
                        <div style="font-weight:600;">${s.first_name || ''} ${s.middle_name || ''} ${s.last_name || ''}</div>
                    </td>
                    <td>${s.email}</td>
                    <td>${statusBadge}</td>
                    <td>${filesHTML}</td>
                    <td style="text-align:center;">${actionHTML}</td>
                </tr>
            `);
        });

        bindTableEvents();
    }

    // Render pagination
    function renderPagination(totalPages, current) {
        const pagination = $('#pagination');
        pagination.empty();

        if (totalPages <= 1) return;

        // Previous button
        if (current > 1) {
            pagination.append(`<a href="#" data-page="${current - 1}"><i class="fas fa-chevron-left"></i></a>`);
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
                pagination.append(`<a href="#" class="${i === current ? 'active' : ''}" data-page="${i}">${i}</a>`);
            } else if (i === current - 2 || i === current + 2) {
                pagination.append('<span style="padding:8px 12px;color:#64748b;">...</span>');
            }
        }

        // Next button
        if (current < totalPages) {
            pagination.append(`<a href="#" data-page="${current + 1}"><i class="fas fa-chevron-right"></i></a>`);
        }

        $('.pagination a').off('click').on('click', function (e) {
            e.preventDefault();
            currentPage = parseInt($(this).data('page'));
            loadData(currentPage);
            
            // Scroll to top of table
            $('html, body').animate({
                scrollTop: $('.table-section').offset().top - 100
            }, 300);
        });
    }

    // Bind events
    function bindTableEvents() {
        // File preview
        $('.btn-view').on('click', function () {
            const filename = $(this).data('file');
            const userId = $(this).data('user');
            const fieldName = $(this).data('field');
            const button = $(this);
            
            // Add loading state
            const originalHtml = button.html();
            button.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true);
            
            // First, get document information to determine the document type
            $.getJSON(`${window.appUrls.documentInfo.replace('/0/', `/${userId}/`)}${fieldName}`, function(docInfo) {
                const documentType = docInfo.document_type || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                // Update modal title with the actual document name
                modalTitle.text(documentType);
                
                // Now load the file preview
                $.getJSON(`${window.appUrls.previewFile}${filename}?field=${fieldName}`, function (data) {
                    const ext = filename.split('.').pop().toLowerCase();
                    const fileUrl = data.file_url;

                    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                        fileViewer.html(`<img src="${fileUrl}" alt="${documentType}" style="max-width: 100%; max-height: 70vh; display: block; margin: 0 auto;">`);
                    } else if (['pdf'].includes(ext)) {
                        fileViewer.html(`<iframe src="${fileUrl}" frameborder="0" style="width: 100%; height: 70vh;"></iframe>`);
                    } else {
                        fileViewer.html(`
                            <div style="text-align: center; padding: 2rem;">
                                <i class="fas fa-file-download" style="font-size: 3rem; color: #64748b; margin-bottom: 1rem;"></i>
                                <h4>${documentType}</h4>
                                <p>This file type cannot be previewed in the browser.</p>
                                <a href="${fileUrl}" target="_blank" class="btn btn-primary">
                                    <i class="fas fa-download"></i> Download File
                                </a>
                            </div>
                        `);
                    }
                    modal.fadeIn();
                }).fail(() => {
                    showStatusMessage('Error loading file preview', 'danger');
                }).always(() => {
                    // Reset button state
                    button.html(originalHtml).prop('disabled', false);
                });
                
            }).fail(() => {
                // Fallback: use field name if document info fails
                const documentType = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                modalTitle.text(documentType);
                
                // Load file preview with fallback title
                $.getJSON(`${window.appUrls.previewFile}${filename}?field=${fieldName}`, function (data) {
                    const ext = filename.split('.').pop().toLowerCase();
                    const fileUrl = data.file_url;

                    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                        fileViewer.html(`<img src="${fileUrl}" alt="${documentType}" style="max-width: 100%; max-height: 70vh; display: block; margin: 0 auto;">`);
                    } else if (['pdf'].includes(ext)) {
                        fileViewer.html(`<iframe src="${fileUrl}" frameborder="0" style="width: 100%; height: 70vh;"></iframe>`);
                    } else {
                        fileViewer.html(`
                            <div style="text-align: center; padding: 2rem;">
                                <i class="fas fa-file-download" style="font-size: 3rem; color: #64748b; margin-bottom: 1rem;"></i>
                                <h4>${documentType}</h4>
                                <p>This file type cannot be previewed in the browser.</p>
                                <a href="${fileUrl}" target="_blank" class="btn btn-primary">
                                    <i class="fas fa-download"></i> Download File
                                </a>
                            </div>
                        `);
                    }
                    modal.fadeIn();
                }).fail(() => {
                    showStatusMessage('Error loading file preview', 'danger');
                }).always(() => {
                    // Reset button state
                    button.html(originalHtml).prop('disabled', false);
                });
            });
        });

        // Accept verification
        $('.btn-accept').on('click', function () {
            const userId = $(this).data('user');
            const button = $(this);
            const studentName = button.closest('tr').find('td:nth-child(1)').text().trim();
            
            if (!confirm(`Are you sure you want to verify ${studentName}? This action cannot be undone.`)) return;
            
            // Add loading state
            button.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true);
            
            $.post(`/admin/verify/accept/${userId}`, function (response) {
                if (response.success) {
                    showStatusMessage(`Successfully verified ${studentName}`, 'success');
                    // Reload both data and stats
                    loadData(currentPage);
                    loadStats();
                } else {
                    showStatusMessage(`Error: ${response.message}`, 'danger');
                    button.html('<i class="fas fa-check"></i> Verify').prop('disabled', false);
                }
            }).fail(() => {
                showStatusMessage('Error verifying student', 'danger');
                button.html('<i class="fas fa-check"></i> Verify').prop('disabled', false);
            });
        });

        // Close file modal
        $('#close-file-modal').on('click', closeFileModal);
        $('.close-modal').on('click', closeFileModal);
        $(window).on('click', (e) => { if ($(e.target).is(modal)) closeFileModal(); });
    }

    function closeFileModal() {
        modal.fadeOut();
        // Reset modal title for next use
        modalTitle.text('Document Preview');
    }

    // Auto-load
    loadData();
});

// Initialize modal functionality
function initializeModals() {
    // Close modal function
    function closeAllModals() {
        $('.modal').fadeOut(300);
    }

    // Close modal when clicking X
    $('.close-modal').click(function() {
        closeAllModals();
    });

    // Close modal when clicking outside
    $(document).on('click', function(e) {
        if ($(e.target).hasClass('modal')) {
            closeAllModals();
        }
    });

    // Escape key to close modals
    $(document).keyup(function(e) {
        if (e.keyCode === 27) {
            closeAllModals();
        }
    });

    // Logout Modal Functionality
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
}

// Show status message
function showStatusMessage(message, type) {
    const statusMessage = $('#status-message');
    const messageText = $('#message-text');
    
    statusMessage.removeClass('success danger warning').addClass(type);
    messageText.text(message);
    statusMessage.fadeIn();
    
    // Add close functionality
    $('.close-alert').off('click').on('click', function() {
        statusMessage.fadeOut();
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => statusMessage.fadeOut(), 5000);
}

// Handle window resize
$(window).on('resize', function() {
    // Adjust modal content if needed
    const modal = $('#fileModal');
    if (modal.is(':visible')) {
        // You can add responsive adjustments here if needed
    }
});

// Add some basic status message styles if needed
const statusStyles = `
    <style>
        .status-message {
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 3000;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            min-width: 300px;
            text-align: center;
            display: none;
        }
        .status-message.success { background-color: #10b981; }
        .status-message.danger { background-color: #ef4444; }
        .status-message.warning { background-color: #f59e0b; }
        .message-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        .close-alert {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-view {
            position: relative;
        }
        .btn-view .tooltip {
            visibility: hidden;
            width: 120px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -60px;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 0.75rem;
        }
        .btn-view:hover .tooltip {
            visibility: visible;
            opacity: 1;
        }
        .stat-description {
            font-size: 0.75rem;
            color: #64748b;
            margin-top: 0.25rem;
        }
    </style>
`;

// Inject styles if not already present
if (!$('#status-styles').length) {
    $('head').append(statusStyles);
}