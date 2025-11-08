// staff_materials.js

document.addEventListener('DOMContentLoaded', function() {
    initializeMaterialForm();
    initializeEditForms();
    setupFormValidation();
    setupDateConstraints();
    initializeFiltering();
});

function initializeMaterialForm() {
    const typeSelect = document.getElementById('type-select');
    const submissionDates = document.getElementById('submission-dates');
    const datesMessage = document.getElementById('dates-message');
    
    if (typeSelect && submissionDates) {
        typeSelect.addEventListener('change', function() {
            handleTypeChange(this.value, submissionDates, datesMessage);
        });
        
        // Initialize on page load
        handleTypeChange(typeSelect.value, submissionDates, datesMessage);
    }
}

function handleTypeChange(type, submissionDates, datesMessage) {
    if (type === 'classwork') {
        submissionDates.classList.remove('hidden');
        datesMessage.textContent = 'Set the submission period for this classwork. Dates are required.';
        setDefaultSubmissionDates();
    } else if (type === 'announcement') {
        submissionDates.classList.remove('hidden');
        datesMessage.textContent = 'Optional: Set dates when this announcement should be visible to students.';
        clearSubmissionDates();
    } else {
        submissionDates.classList.add('hidden');
    }
}

function initializeEditForms() {
    document.querySelectorAll('.type-select-edit').forEach(select => {
        select.addEventListener('change', function() {
            const form = this.closest('.edit-material-form');
            const submissionDates = form.querySelector('.edit-submission-dates');
            
            if (this.value === 'classwork') {
                submissionDates.style.display = 'block';
            } else {
                submissionDates.style.display = 'none';
            }
        });
    });
}

function setupFormValidation() {
    const materialForm = document.getElementById('material-form');
    if (materialForm) {
        materialForm.addEventListener('submit', function(e) {
            const typeSelect = document.getElementById('type-select');
            
            if (typeSelect.value === 'classwork') {
                if (!validateClassworkDates()) {
                    e.preventDefault();
                    return false;
                }
            }
            return true;
        });
    }
    
    document.querySelectorAll('.edit-material-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const typeSelect = this.querySelector('.type-select-edit');
            
            if (typeSelect && typeSelect.value === 'classwork') {
                if (!validateClassworkDates(this)) {
                    e.preventDefault();
                    return false;
                }
            }
            return true;
        });
    });
}

function validateClassworkDates(form = null) {
    let submissionStart, submissionEnd;
    
    if (form) {
        // For edit forms
        submissionStart = form.querySelector('input[name="submission_start"]');
        submissionEnd = form.querySelector('input[name="submission_end"]');
    } else {
        // For new material form
        submissionStart = document.getElementById('submission-start');
        submissionEnd = document.getElementById('submission-end');
    }
    
    if (!submissionStart || !submissionEnd) {
        return true; // If elements don't exist, skip validation
    }
    
    if (!submissionStart.value || !submissionEnd.value) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Dates',
            text: 'Please provide both submission start and end dates for classwork.',
            confirmButtonColor: '#007bff'
        });
        return false;
    }
    
    const start = new Date(submissionStart.value);
    const end = new Date(submissionEnd.value);
    
    if (end <= start) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Dates',
            text: 'Submission end date must be after start date.',
            confirmButtonColor: '#007bff'
        });
        return false;
    }
    
    // Check if start date is in the past
    const now = new Date();
    if (start < now) {
        const result = confirm('The submission start date is in the past. Are you sure you want to continue?');
        if (!result) {
            return false;
        }
    }
    
    return true;
}

function setupDateConstraints() {
    const startInput = document.getElementById('submission-start');
    const endInput = document.getElementById('submission-end');
    
    if (startInput && endInput) {
        startInput.addEventListener('change', function() {
            endInput.min = this.value;
            
            // If end date is before new start date, clear it
            if (endInput.value && endInput.value < this.value) {
                endInput.value = '';
            }
        });
    }
}

function setDefaultSubmissionDates() {
    const now = new Date();
    const startDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    
    const startInput = document.getElementById('submission-start');
    const endInput = document.getElementById('submission-end');
    
    if (startInput && !startInput.value) {
        startInput.value = formatDateTimeLocal(startDate);
    }
    if (endInput && !endInput.value) {
        endInput.value = formatDateTimeLocal(endDate);
        if (startInput && startInput.value) {
            endInput.min = startInput.value;
        }
    }
}

function clearSubmissionDates() {
    const startInput = document.getElementById('submission-start');
    const endInput = document.getElementById('submission-end');
    
    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
}

// Helper function to format date for datetime-local input
function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Filtering functionality
function initializeFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter-type]');
    const classFilter = document.getElementById('class-filter');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                applyFilters();
            });
        });
    }
    
    if (classFilter) {
        classFilter.addEventListener('change', applyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

function applyFilters() {
    const activeTypeFilter = document.querySelector('.filter-btn.active[data-filter-type]');
    const typeFilterValue = activeTypeFilter ? activeTypeFilter.dataset.filterType : 'all';
    const classFilter = document.getElementById('class-filter');
    const classFilterValue = classFilter ? classFilter.value : 'all';
    
    const materialCards = document.querySelectorAll('.material-card');
    let visibleCount = 0;
    
    materialCards.forEach(card => {
        const cardType = card.dataset.materialType;
        const cardClassId = card.dataset.classId;
        
        const typeMatch = typeFilterValue === 'all' || cardType === typeFilterValue;
        const classMatch = classFilterValue === 'all' || cardClassId === classFilterValue;
        
        if (typeMatch && classMatch) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Show/hide no results message
    const noResults = document.getElementById('no-results');
    if (noResults) {
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
}

function clearFilters() {
    // Reset type filter
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter-type]');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filterType === 'all') {
            btn.classList.add('active');
        }
    });
    
    // Reset class filter
    const classFilter = document.getElementById('class-filter');
    if (classFilter) {
        classFilter.value = 'all';
    }
    
    // Apply cleared filters
    applyFilters();
}

// Global functions for template
function togglePreview(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
    }
}

function toggleEdit(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
    }
}