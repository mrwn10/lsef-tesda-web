function filterTable() {
    const filter = document.getElementById("courseFilter").value;
    const table = document.getElementById("classTable");
    const trs = table.getElementsByTagName("tr");

    for (let i = 1; i < trs.length; i++) {
        const courseCell = trs[i].getElementsByTagName("td")[1];
        if (courseCell) {
            const courseText = courseCell.textContent || courseCell.innerText;
            if (filter === "All" || courseText === filter) {
                trs[i].style.display = "";
            } else {
                trs[i].style.display = "none";
            }
        }
    }
}

// Modal management system
const ModalManager = {
    currentModal: null,
    
    openModal: function(modal) {
        // Close any currently open modal
        this.closeCurrentModal();
        
        // Open new modal
        modal.style.display = 'block';
        this.currentModal = modal;
        
        // Add escape key listener
        this.addEscapeListener();
    },
    
    closeCurrentModal: function() {
        if (this.currentModal) {
            this.currentModal.style.display = 'none';
            this.currentModal = null;
        }
        this.removeEscapeListener();
    },
    
    addEscapeListener: function() {
        this.escapeHandler = (event) => {
            if (event.key === 'Escape') {
                this.closeCurrentModal();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
    },
    
    removeEscapeListener: function() {
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const viewModal = document.getElementById('viewModal');
    const logoutModal = document.getElementById('logout-modal');
    const spanClose = document.querySelector('#viewModal .close');
    const approveBtn = document.getElementById('approve-btn');
    const rejectBtn = document.getElementById('reject-btn');
    
    let currentClassId = null;

    // Add click event to all view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const cls = JSON.parse(this.getAttribute('data-class'));
            populateModal(cls);
            ModalManager.openModal(viewModal);
        });
    });

    // Close modal when clicking X
    spanClose.addEventListener('click', function() {
        ModalManager.closeCurrentModal();
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === viewModal || event.target === logoutModal) {
            ModalManager.closeCurrentModal();
        }
    });

    // Logout modal handling (separate from ModalManager since it's simpler)
    $('#logout-trigger').click(function(e) {
        e.preventDefault();
        ModalManager.closeCurrentModal(); // Close any other modals first
        $('#logout-modal').fadeIn();
    });
    
    $('.close-modal').click(function() {
        $('#logout-modal').fadeOut();
    });
    
    $(window).click(function(e) {
        if ($(e.target).is('#logout-modal')) {
            $('#logout-modal').fadeOut();
        }
    });

    // Populate modal with class data
    function populateModal(cls) {
        document.getElementById('modal-class-id').textContent = cls.class_id;
        document.getElementById('modal-class-title').textContent = cls.class_title;
        document.getElementById('modal-course-title').textContent = cls.course_title;
        document.getElementById('modal-instructor').textContent = cls.instructor_name || `${cls.first_name} ${cls.last_name}`;
        document.getElementById('modal-school-year').textContent = cls.school_year;
        document.getElementById('modal-batch').textContent = cls.batch || 'N/A';
        document.getElementById('modal-schedule').textContent = cls.schedule;
        document.getElementById('modal-venue').textContent = cls.venue;
        document.getElementById('modal-max-students').textContent = cls.max_students;
        document.getElementById('modal-start-date').textContent = cls.start_date;
        document.getElementById('modal-end-date').textContent = cls.end_date;
        document.getElementById('modal-status').textContent = cls.status;
        document.getElementById('modal-date-created').textContent = cls.date_created;
        document.getElementById('modal-date-updated').textContent = cls.date_updated;
        document.getElementById('modal-reason').textContent = cls.edit_reason || 'No reason provided';

        // Store current class ID for actions
        currentClassId = cls.class_id;
    }

    // Handle approve action
    approveBtn.addEventListener('click', function() {
        if (currentClassId) {
            handleAction(currentClassId, 'approve');
        }
    });

    // Handle reject action
    rejectBtn.addEventListener('click', function() {
        if (currentClassId) {
            handleAction(currentClassId, 'reject');
        }
    });

    // Handle approve/reject actions
    function handleAction(classId, action) {
        // Close the view modal first
        ModalManager.closeCurrentModal();
        
        Swal.fire({
            title: `Are you sure you want to ${action} this request?`,
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'approve' ? '#28a745' : '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Yes, ${action} it!`,
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading state
                Swal.fire({
                    title: 'Processing...',
                    text: 'Please wait while we process your request.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Get the URL from the global variable set in HTML
                const url = window.appUrls.approveOrRejectUrl;

                fetch(url, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        class_id: classId, 
                        action: action 
                    })
                })
                .then(response => {
                    console.log('Response status:', response.status);
                    
                    if (!response.ok) {
                        return response.text().then(text => {
                            console.error('Error response:', text);
                            throw new Error(`Server error: ${response.status} - ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    Swal.close();
                    
                    if (data.status === 'success') {
                        Swal.fire({
                            title: 'Success!',
                            text: data.message,
                            icon: 'success',
                            confirmButtonColor: '#28a745',
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            // Reload page to reflect changes
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: data.message || 'Something went wrong.',
                            icon: 'error',
                            confirmButtonColor: '#dc3545',
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            // Reopen the view modal if there was an error
                            if (currentClassId) {
                                // You might want to refetch the class data here
                                // For now, we'll just keep it closed
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Fetch Error:', error);
                    Swal.fire({
                        title: 'Request Failed!',
                        text: 'Error processing request. Please try again. ' + error.message,
                        icon: 'error',
                        confirmButtonColor: '#dc3545',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        // Optionally reopen the view modal on error
                    });
                });
            } else {
                // If user cancels, reopen the view modal
                if (currentClassId) {
                    // Find the button that corresponds to this class and reopen modal
                    const viewButtons = document.querySelectorAll('.view-btn');
                    viewButtons.forEach(btn => {
                        const cls = JSON.parse(btn.getAttribute('data-class'));
                        if (cls.class_id === currentClassId) {
                            populateModal(cls);
                            ModalManager.openModal(viewModal);
                        }
                    });
                }
            }
        });
    }

    // Confirm logout
    $('#confirm-logout').click(function() {
        window.location.href = "{{ url_for('login.logout') }}";
    });
});