const editClassUrl = "/update_class";
        
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
        const daySelectors = document.querySelectorAll('.day-selector');
        const dayTimeSlots = document.getElementById('dayTimeSlots');
        const daySlots = new Set();

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
                document.querySelector(`.day-selector[value="${day}"]`).checked = false;
                
                // Remove from set and update display
                daySlots.delete(day);
                updateDaySlotsDisplay();
            }
        });

        // Update the day slots display
        function updateDaySlotsDisplay() {
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

        // Time validation for day slots
        dayTimeSlots.addEventListener('change', function(e) {
            if (e.target.classList.contains('day-time-input')) {
                const day = e.target.dataset.day;
                const type = e.target.dataset.type;
                const otherType = type === 'start' ? 'end' : 'start';
                
                const currentTime = e.target.value;
                const otherTimeInput = document.querySelector(`.day-time-input[data-day="${day}"][data-type="${otherType}"]`);
                
                if (currentTime && otherTimeInput.value) {
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

        document.addEventListener('DOMContentLoaded', function() {
            const editButtons = document.querySelectorAll('.edit-btn');
            const modal = document.getElementById('editModal');
            const saveBtn = document.getElementById('save-btn');
            const cancelBtn = document.getElementById('cancel-btn');
            const modalClose = document.querySelector('.modal-close');
            const searchInput = document.getElementById('search-input');

            editButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const classData = JSON.parse(this.getAttribute('data-class'));
                    openModal(classData);
                });
            });

            saveBtn.addEventListener('click', submitEditRequest);
            cancelBtn.addEventListener('click', closeModal);
            modalClose.addEventListener('click', closeModal);

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
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const rows = document.querySelectorAll('.data-table tbody tr');
                
                rows.forEach(row => {
                    const rowText = row.textContent.toLowerCase();
                    row.style.display = rowText.includes(searchTerm) ? '' : 'none';
                });
            });
        });

        function openModal(classData) {
            // Clear previous errors and reset form
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('.form-control').forEach(el => {
                el.classList.remove('error');
            });

            // Set basic form values
            document.getElementById('class_id').value = classData.class_id;
            document.getElementById('class_title').value = classData.class_title;
            document.getElementById('school_year').value = classData.school_year;
            document.getElementById('batch').value = classData.batch || '';
            document.getElementById('instructor_name').value = classData.instructor_name;
            document.getElementById('venue').value = classData.venue;
            document.getElementById('max_students').value = classData.max_students;
            
            // Format dates for date inputs
            const startDate = new Date(classData.start_date);
            const endDate = new Date(classData.end_date);
            document.getElementById('start_date').value = startDate.toISOString().split('T')[0];
            document.getElementById('end_date').value = endDate.toISOString().split('T')[0];
            
            // Clear reason field
            document.getElementById('reason').value = '';

            // Handle days_of_week
            daySlots.clear();
            if (classData.days_of_week && typeof classData.days_of_week === 'object') {
                // Check the checkboxes and create time slots
                for (const day in classData.days_of_week) {
                    daySlots.add(day);
                    document.querySelector(`.day-selector[value="${day}"]`).checked = true;
                }
                updateDaySlotsDisplay();
                
                // After slots are created, set the time values
                setTimeout(() => {
                    for (const day in classData.days_of_week) {
                        const times = classData.days_of_week[day];
                        const startSelect = document.querySelector(`.day-time-input[data-day="${day}"][data-type="start"]`);
                        const endSelect = document.querySelector(`.day-time-input[data-day="${day}"][data-type="end"]`);
                        if (startSelect) startSelect.value = times.start;
                        if (endSelect) endSelect.value = times.end;
                    }
                }, 0);
            }

            // Show modal
            document.getElementById('editModal').style.display = 'block';
            document.getElementById('class_title').focus();
        }

        function closeModal() {
            document.getElementById('editModal').style.display = 'none';
            // Clear day slots when modal closes
            daySlots.clear();
            document.querySelectorAll('.day-selector').forEach(checkbox => {
                checkbox.checked = false;
            });
            updateDaySlotsDisplay();
        }

        function showError(fieldId, message) {
            const errorElement = document.getElementById(`${fieldId}_error`);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            document.getElementById(fieldId).classList.add('error');
        }

        function showMessage(message, type = 'success') {
            const messageContainer = document.getElementById('message-container');
            const messageContent = document.getElementById('message-content');
            
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
            const data = {
                class_id: document.getElementById('class_id').value,
                class_title: document.getElementById('class_title').value.trim(),
                school_year: document.getElementById('school_year').value.trim(),
                batch: document.getElementById('batch').value.trim(),
                instructor_name: document.getElementById('instructor_name').value.trim(),
                venue: document.getElementById('venue').value.trim(),
                max_students: document.getElementById('max_students').value,
                start_date: document.getElementById('start_date').value,
                end_date: document.getElementById('end_date').value,
                reason: document.getElementById('reason').value.trim()
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
                        daysData[day] = {
                            start: document.querySelector(`.day-time-input[data-day="${day}"][data-type="start"]`).value,
                            end: document.querySelector(`.day-time-input[data-day="${day}"][data-type="end"]`).value
                        };
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
            if (!data.max_students || data.max_students <= 0) {
                showError('max_students', "Max Students must be greater than 0");
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
            if (new Date(data.end_date) < new Date(data.start_date)) {
                showError('end_date', "End Date cannot be before Start Date");
                isValid = false;
            }
            if (!data.reason) {
                showError('reason', "Please provide a reason for editing");
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // Show loading state
            const saveBtn = document.getElementById('save-btn');
            saveBtn.classList.add('loading');
            saveBtn.disabled = true;

            fetch(editClassUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(res => {
                if (res.status === 'success') {
                    showMessage(res.message, 'success');
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
                showError('reason', error.message || 'An error occurred while submitting your request');
            })
            .finally(() => {
                saveBtn.classList.remove('loading');
                saveBtn.disabled = false;
            });
        }

        // Date validation to ensure end date is after start date
        document.getElementById('end_date').addEventListener('change', function() {
            const startDate = new Date(document.getElementById('start_date').value);
            const endDate = new Date(this.value);
            
            if (startDate && endDate && endDate < startDate) {
                showError('end_date', "End Date cannot be before Start Date");
                this.value = '';
            } else {
                document.getElementById('end_date_error').style.display = 'none';
            }
        });

        // Set minimum end date based on start date
        document.getElementById('start_date').addEventListener('change', function() {
            const startDate = new Date(this.value);
            const endDateField = document.getElementById('end_date');
            
            if (this.value) {
                startDate.setDate(startDate.getDate() + 1);
                const minEndDate = startDate.toISOString().split('T')[0];
                endDateField.min = minEndDate;
                
                if (endDateField.value && new Date(endDateField.value) < startDate) {
                    endDateField.value = '';
                }
            } else {
                endDateField.min = '';
            }
        });