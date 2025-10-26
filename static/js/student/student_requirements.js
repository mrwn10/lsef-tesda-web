document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("requirementsForm");
    const submitBtn = document.getElementById("submitBtn");
    const maritalStatusSelect = document.getElementById("maritalStatus");
    const marriageCertificateField = document.getElementById("marriageCertificateField");
    const marriageCertificateInput = document.getElementById("marriageCertificateInput");

    // Logout Modal Handling
    const logoutModal = document.getElementById('logout-modal');
    const logoutTrigger = document.getElementById('logout-trigger');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');
    
    // Show modal when logout is clicked
    if (logoutTrigger) {
        logoutTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            logoutModal.style.display = 'block';
        });
    }
    
    // Hide modal when cancel is clicked
    if (cancelLogout) {
        cancelLogout.addEventListener('click', function() {
            logoutModal.style.display = 'none';
        });
    }
    
    // Handle logout confirmation
    if (confirmLogout) {
        confirmLogout.addEventListener('click', function() {
            window.location.href = "/logout";
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
    });

    // Alert close buttons
    document.querySelectorAll('.alert-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.alert-message').style.display = 'none';
        });
    });

    // Auto-hide flash messages after 5 seconds
    document.querySelectorAll('.alert-message').forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.style.display = 'none';
            }, 500);
        }, 5000);
    });

    // Marital Status Change Handler
    if (maritalStatusSelect) {
        maritalStatusSelect.addEventListener('change', function() {
            const isMarried = this.value === 'married';
            
            if (isMarried) {
                marriageCertificateField.style.display = 'block';
                marriageCertificateInput.required = true;
            } else {
                marriageCertificateField.style.display = 'none';
                marriageCertificateInput.required = false;
                marriageCertificateInput.value = ''; // Clear the file input
                
                // Reset the file input overlay
                const overlay = marriageCertificateInput.nextElementSibling;
                overlay.querySelector('span').textContent = 'Choose marriage certificate';
                overlay.classList.remove('has-file');
            }
            
            validateForm();
        });
    }

    // File input styling
    document.querySelectorAll('.file-input').forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
            const overlay = this.nextElementSibling;
            overlay.querySelector('span').textContent = fileName;
            
            if (this.files[0]) {
                overlay.classList.add('has-file');
                
                // Validate file type
                const file = this.files[0];
                const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
                const fileExtension = file.name.split('.').pop().toLowerCase();
                
                if (!allowedTypes.includes(fileExtension)) {
                    alert('Invalid file type. Please upload PDF, JPG, PNG, DOC, or DOCX files only.');
                    this.value = '';
                    overlay.querySelector('span').textContent = this.name === 'marriage_certificate' ? 'Choose marriage certificate' : 'Choose file';
                    overlay.classList.remove('has-file');
                    return;
                }
                
                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    alert('File size too large. Please upload files smaller than 10MB.');
                    this.value = '';
                    overlay.querySelector('span').textContent = this.name === 'marriage_certificate' ? 'Choose marriage certificate' : 'Choose file';
                    overlay.classList.remove('has-file');
                    return;
                }
            } else {
                overlay.classList.remove('has-file');
            }
            
            validateForm();
        });
    });

    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('input[required]');
        const maritalStatus = maritalStatusSelect ? maritalStatusSelect.value : '';
        
        // Check marital status
        if (!maritalStatus) {
            isValid = false;
        }
        
        // Check required file inputs
        requiredInputs.forEach(input => {
            if (!input.files || input.files.length === 0) {
                isValid = false;
            }
        });
        
        // Special validation for marriage certificate
        if (maritalStatus === 'married') {
            if (!marriageCertificateInput.files || marriageCertificateInput.files.length === 0) {
                isValid = false;
            }
        }
        
        submitBtn.disabled = !isValid;
        if (isValid) {
            submitBtn.classList.remove('btn-disabled');
            submitBtn.classList.add('btn-enabled');
        } else {
            submitBtn.classList.add('btn-disabled');
            submitBtn.classList.remove('btn-enabled');
        }
        
        return isValid;
    }

    // Initial form validation
    validateForm();

    // Form submission with validation
    form.addEventListener("submit", (e) => {
        if (!validateForm()) {
            e.preventDefault();
            
            // Get specific validation errors
            const errors = [];
            const maritalStatus = maritalStatusSelect ? maritalStatusSelect.value : '';
            const requiredInputs = form.querySelectorAll('input[required]');
            
            if (!maritalStatus) {
                errors.push("Marital status");
            }
            
            requiredInputs.forEach(input => {
                if (!input.files || input.files.length === 0) {
                    const fieldName = input.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    errors.push(fieldName);
                }
            });
            
            // Special check for marriage certificate
            if (maritalStatus === 'married' && (!marriageCertificateInput.files || marriageCertificateInput.files.length === 0)) {
                errors.push("Marriage Certificate");
            }
            
            if (errors.length > 0) {
                alert(`Please complete the following required fields:\n\n• ${errors.join('\n• ')}`);
            } else {
                alert("Please upload all required documents before submitting.");
            }
            
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        
        // Additional validation for required fields
        const missingFields = [];
        const requiredInputs = form.querySelectorAll('input[required]');
        const maritalStatus = maritalStatusSelect ? maritalStatusSelect.value : '';
        
        if (!maritalStatus) {
            missingFields.push("Marital Status");
        }
        
        requiredInputs.forEach(input => {
            if (!input.files || input.files.length === 0) {
                const fieldName = input.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                missingFields.push(fieldName);
            }
        });

        // Special check for marriage certificate
        if (maritalStatus === 'married' && (!marriageCertificateInput.files || marriageCertificateInput.files.length === 0)) {
            missingFields.push("Marriage Certificate");
        }

        if (missingFields.length > 0) {
            e.preventDefault();
            alert(`Please complete the following required fields:\n\n• ${missingFields.join('\n• ')}`);
            
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Requirements';
            return;
        }

        // If all validations pass, form will submit normally
    });

    // Preview modal functionality
    const previewModal = document.getElementById('previewModal');
    const previewButtons = document.querySelectorAll('.preview-btn');
    const previewContainer = document.querySelector('.preview-container');
    const modalClose = document.querySelector('.modal-close');

    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filename = this.getAttribute('data-filename');
            const label = this.getAttribute('data-label');
            const fileUrl = "/static/uploads/requirements/" + filename;
            
            // Set modal title
            document.querySelector('#previewModal .modal-header h3').innerHTML = 
                `<i class="fas fa-eye"></i> ${label}`;
            
            // Determine file type and create appropriate preview
            let previewHtml = '';
            const fileExt = filename.split('.').pop().toLowerCase();
            
            if (fileExt === 'pdf') {
                previewHtml = `<iframe src="${fileUrl}#toolbar=0" class="preview-iframe" frameborder="0"></iframe>`;
            } else if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
                previewHtml = `<img src="${fileUrl}" alt="Preview" class="preview-image">`;
            } else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(fileExt)) {
                previewHtml = `
                    <div class="file-placeholder">
                        <i class="fas fa-file"></i>
                        <h4>Preview Not Available</h4>
                        <p>This file type cannot be previewed in the browser.</p>
                        <a href="${fileUrl}" download class="download-btn">
                            <i class="fas fa-download"></i> Download File
                        </a>
                    </div>
                `;
            } else {
                previewHtml = `
                    <div class="file-placeholder">
                        <i class="fas fa-file"></i>
                        <h4>Preview Not Available</h4>
                        <p>This file type cannot be previewed in the browser.</p>
                        <a href="${fileUrl}" download class="download-btn">
                            <i class="fas fa-download"></i> Download File
                        </a>
                    </div>
                `;
            }
            
            previewContainer.innerHTML = previewHtml;
            previewModal.style.display = 'block';
        });
    });

    // Close preview modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            previewModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });

    // Keyboard support for modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (logoutModal.style.display === 'block') {
                logoutModal.style.display = 'none';
            }
            if (previewModal.style.display === 'block') {
                previewModal.style.display = 'none';
            }
        }
    });
});