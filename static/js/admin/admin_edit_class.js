const editClassUrl = "/admin/update_class";
        
// Template for day time slot
function createDaySlot(day) {
    return `
        <div class="day-slot" data-day="${day}">
            <div class="day-slot-header">
                <span class="day-slot-title"><i class="fas fa-calendar-day"></i> ${day}</span>
                <button type="button" class="remove-day" title="Remove this day">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="time-inputs">
                <div class="form-group">
                    <label for="${day.toLowerCase()}-start">Start Time</label>
                    <div class="input-with-icon">
                        <i class="fas fa-clock"></i>
                        <select class="day-time-input" id="${day.toLowerCase()}-start" data-day="${day}" data-type="start" required>
                            <option value="" disabled selected>Select start time</option>
                            ${generateTimeOptions()}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="${day.toLowerCase()}-end">End Time</label>
                    <div class="input-with-icon">
                        <i class="fas fa-clock"></i>
                        <select class="day-time-input" id="${day.toLowerCase()}-end" data-day="${day}" data-type="end" required>
                            <option value="" disabled selected>Select end time</option>
                            ${generateTimeOptions()}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate time options in 1-hour increments from 6AM to 6PM
function generateTimeOptions() {
    let options = '';
    for (let hour = 6; hour <= 18; hour++) {
        const hour12 = hour % 12 || 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const time24 = `${hour.toString().padStart(2, '0')}:00`;
        const time12 = `${hour12}:00 ${ampm}`;
        options += `<option value="${time24}">${time12}</option>`;
    }
    return options;
}

// Manage day selections and time slots
let daySlots = new Set();

function initializeDaySelectors() {
    const daySelectors = document.querySelectorAll('.day-selector');
    const dayTimeSlots = document.getElementById('dayTimeSlots');
    
    daySelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const day = this.value;
            
            if (this.checked && !daySlots.has(day)) {
                // Add new day slot
                daySlots.add(day);
                updateDaySlotsDisplay();
            } else if (!this.checked && daySlots.has(day)) {
                // Remove day slot
                daySlots.delete(day);
                updateDaySlotsDisplay();
            }
        });
    });

    // Handle remove day button clicks (delegated event)
    dayTimeSlots.addEventListener('click', function(e) {
        if (e.target.closest('.remove-day')) {
            const daySlot = e.target.closest('.day-slot');
            const day = daySlot.dataset.day;
            
            // Uncheck the corresponding checkbox
            const checkbox = document.querySelector(`.day-selector[value="${day}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
            
            // Remove from set and update display
            daySlots.delete(day);
            updateDaySlotsDisplay();
        }
    });

    // Time validation for day slots
    dayTimeSlots.addEventListener('change', function(e) {
        if (e.target.classList.contains('day-time-input')) {
            const day = e.target.dataset.day;
            const type = e.target.dataset.type;
            const otherType = type === 'start' ? 'end' : 'start';
            
            const currentTime = e.target.value;
            const otherTimeInput = document.querySelector(`.day-time-input[data-day="${day}"][data-type="${otherType}"]`);
            
            if (currentTime && otherTimeInput && otherTimeInput.value) {
                if (type === 'start' && currentTime >= otherTimeInput.value) {
                    showMessage('Start time must be before end time', 'error');
                    e.target.value = '';
                } else if (type === 'end' && currentTime <= otherTimeInput.value) {
                    showMessage('End time must be after start time', 'error');
                    e.target.value = '';
                }
            }
        }
    });
}

// Update the day slots display
function updateDaySlotsDisplay() {
    const dayTimeSlots = document.getElementById('dayTimeSlots');
    if (!dayTimeSlots) return;
    
    if (daySlots.size === 0) {
        dayTimeSlots.innerHTML = `
            <div class="no-days-selected">
                <i class="far fa-calendar-plus"></i>
                <p>Select days above to add time slots</p>
            </div>
        `;
        return;
    }
    
    // Sort days in order (Monday to Sunday)
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedDays = Array.from(daySlots).sort((a, b) => {
        return daysOrder.indexOf(a) - daysOrder.indexOf(b);
    });
    
    let html = '';
    sortedDays.forEach(day => {
        html += createDaySlot(day);
    });
    
    dayTimeSlots.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const modal = document.getElementById('editModal');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const modalClose = document.querySelector('.modal-close');
    const searchInput = document.getElementById('search-input');

    // Initialize day selectors
    initializeDaySelectors();

    // Edit button event listeners
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            try {
                const classData = JSON.parse(this.getAttribute('data-class'));
                openModal(classData);
            } catch (error) {
                console.error('Error parsing class data:', error);
                showMessage('Error loading class data', 'error');
            }
        });
    });

    // Save and cancel buttons
    if (saveBtn) {
        saveBtn.addEventListener('click', submitEditRequest);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll('.data-table tbody tr');
            let hasResults = false;
            
            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                if (rowText.includes(searchTerm)) {
                    row.style.display = '';
                    hasResults = true;
                } else {
                    row.style.display = 'none';
                }
            });
        });

        // Clear search when page loads
        searchInput.value = '';
    }

    // Date validation to ensure end date is after start date
    const endDateField = document.getElementById('end_date');
    const startDateField = document.getElementById('start_date');
    
    if (endDateField) {
        endDateField.addEventListener('change', function() {
            const startDate = new Date(document.getElementById('start_date').value);
            const endDate = new Date(this.value);
            
            if (startDate && endDate && endDate < startDate) {
                showError('end_date', "End Date cannot be before Start Date");
                this.value = '';
            } else {
                const errorElement = document.getElementById('end_date_error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });
    }

    // Set minimum end date based on start date
    if (startDateField) {
        startDateField.addEventListener('change', function() {
            const startDate = new Date(this.value);
            const endDateField = document.getElementById('end_date');
            
            if (this.value && endDateField) {
                startDate.setDate(startDate.getDate() + 1);
                const minEndDate = startDate.toISOString().split('T')[0];
                endDateField.min = minEndDate;
                
                if (endDateField.value && new Date(endDateField.value) < startDate) {
                    endDateField.value = '';
                }
            } else if (endDateField) {
                endDateField.min = '';
            }
        });
    }
});

function openModal(classData) {
    const modal = document.getElementById('editModal');
    if (!modal) return;

    // Clear previous errors and reset form
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.form-control').forEach(el => {
        el.classList.remove('error');
    });

    // Set basic form values
    document.getElementById('class_id').value = classData.class_id;
    document.getElementById('class_title').value = classData.class_title || '';
    document.getElementById('school_year').value = classData.school_year || '';
    document.getElementById('batch').value = classData.batch || '';
    document.getElementById('instructor_name').value = classData.instructor_name || '';
    document.getElementById('venue').value = classData.venue || '';
    
    // FIXED: Always set max students to 25 and make it read-only
    const maxStudentsField = document.getElementById('max_students');
    maxStudentsField.value = "25";
    maxStudentsField.setAttribute('readonly', 'true');
    maxStudentsField.style.backgroundColor = '#f8f9fa';
    maxStudentsField.style.color = '#666';
    maxStudentsField.style.cursor = 'not-allowed';
    
    // Format dates for date inputs
    if (classData.start_date) {
        const startDate = new Date(classData.start_date);
        document.getElementById('start_date').value = startDate.toISOString().split('T')[0];
    }
    
    if (classData.end_date) {
        const endDate = new Date(classData.end_date);
        document.getElementById('end_date').value = endDate.toISOString().split('T')[0];
    }
    
    // Handle days_of_week
    daySlots.clear();
    if (classData.days_of_week) {
        let daysData;
        
        // Parse days_of_week if it's a string
        if (typeof classData.days_of_week === 'string') {
            try {
                daysData = JSON.parse(classData.days_of_week);
            } catch (e) {
                console.error('Error parsing days_of_week:', e);
                daysData = {};
            }
        } else {
            daysData = classData.days_of_week;
        }
        
        // Check the checkboxes and create time slots
        if (daysData && typeof daysData === 'object') {
            for (const day in daysData) {
                if (daysData.hasOwnProperty(day)) {
                    daySlots.add(day);
                    const checkbox = document.querySelector(`.day-selector[value="${day}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                }
            }
            updateDaySlotsDisplay();
            
            // After slots are created, set the time values
            setTimeout(() => {
                for (const day in daysData) {
                    if (daysData.hasOwnProperty(day)) {
                        const times = daysData[day];
                        const startSelect = document.querySelector(`.day-time-input[data-day="${day}"][data-type="start"]`);
                        const endSelect = document.querySelector(`.day-time-input[data-day="${day}"][data-type="end"]`);
                        if (startSelect && times.start) startSelect.value = times.start;
                        if (endSelect && times.end) endSelect.value = times.end;
                    }
                }
            }, 100);
        }
    }

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus on first field
    setTimeout(() => {
        const firstInput = document.getElementById('class_title');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // Clear day slots when modal closes
    daySlots.clear();
    document.querySelectorAll('.day-selector').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateDaySlotsDisplay();
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}_error`);
    const fieldElement = document.getElementById(fieldId);
    
    if (errorElement && fieldElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        fieldElement.classList.add('error');
        
        // Scroll to error
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showMessage(message, type = 'success') {
    const messageContainer = document.getElementById('message-container');
    const messageContent = document.getElementById('message-content');
    
    if (!messageContainer || !messageContent) return;
    
    messageContent.textContent = message;
    messageContent.className = 'message ' + type;
    messageContainer.style.display = 'block';
    
    // Scroll to message
    messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

function submitEditRequest() {
    const classId = document.getElementById('class_id').value;
    if (!classId) {
        showMessage('Class ID is missing', 'error');
        return;
    }

    const data = {
        class_id: classId,
        class_title: document.getElementById('class_title').value.trim(),
        school_year: document.getElementById('school_year').value.trim(),
        batch: document.getElementById('batch').value.trim(),
        instructor_name: document.getElementById('instructor_name').value.trim(),
        venue: document.getElementById('venue').value.trim(),
        max_students: 25, // FIXED: Always use 25
        start_date: document.getElementById('start_date').value,
        end_date: document.getElementById('end_date').value
    };

    // Create days_of_week JSON
    const daysData = {};
    let allTimesValid = true;
    
    if (daySlots.size === 0) {
        showError('days_error', 'Please select at least one day');
        allTimesValid = false;
    } else {
        const dayInputs = document.querySelectorAll('.day-time-input');
        dayInputs.forEach(input => {
            if (!input.value) {
                allTimesValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        if (!allTimesValid) {
            showError('days_error', 'Please provide both start and end times for all selected days');
        } else {
            daySlots.forEach(day => {
                const startInput = document.querySelector(`.day-time-input[data-day="${day}"][data-type="start"]`);
                const endInput = document.querySelector(`.day-time-input[data-day="${day}"][data-type="end"]`);
                
                if (startInput && endInput) {
                    daysData[day] = {
                        start: startInput.value,
                        end: endInput.value
                    };
                }
            });
        }
    }
    
    data.days_of_week = daysData;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.form-control').forEach(el => {
        el.classList.remove('error');
    });

    // Validation
    let isValid = allTimesValid;

    if (!data.class_title) {
        showError('class_title', "Class Title is required");
        isValid = false;
    }
    if (!data.school_year) {
        showError('school_year', "School Year is required");
        isValid = false;
    }
    if (!data.instructor_name) {
        showError('instructor_name', "Instructor Name is required");
        isValid = false;
    }
    if (!data.venue) {
        showError('venue', "Venue is required");
        isValid = false;
    }
    if (!data.start_date) {
        showError('start_date', "Start Date is required");
        isValid = false;
    }
    if (!data.end_date) {
        showError('end_date', "End Date is required");
        isValid = false;
    }
    if (data.start_date && data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
        showError('end_date', "End Date cannot be before Start Date");
        isValid = false;
    }

    if (!isValid) {
        showMessage('Please fix the errors above', 'error');
        return;
    }

    // Show loading state
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.classList.add('loading');
        saveBtn.disabled = true;
        const btnText = saveBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = 'Saving...';
        }
    }

    fetch(editClassUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(res => {
        if (res.status === 'success') {
            showMessage(res.message || 'Class updated successfully', 'success');
            closeModal();
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            throw new Error(res.message || 'Unknown error occurred');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage(error.message || 'An error occurred while saving changes', 'error');
    })
    .finally(() => {
        if (saveBtn) {
            saveBtn.classList.remove('loading');
            saveBtn.disabled = false;
            const btnText = saveBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = 'Save Changes';
            }
        }
    });
}