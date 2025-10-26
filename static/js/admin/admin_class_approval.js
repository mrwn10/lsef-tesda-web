let currentClassId = null;
let currentClassData = null;

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

function openViewModal(classData) {
    currentClassId = classData.class_id;
    currentClassData = classData;
    
    // Populate modal with class data
    document.getElementById('detail-class-title').textContent = classData.class_title || 'N/A';
    document.getElementById('detail-course').textContent = classData.course_title || 'N/A';
    document.getElementById('detail-school-year').textContent = classData.school_year || 'N/A';
    document.getElementById('detail-batch').textContent = classData.batch || 'N/A';
    document.getElementById('detail-instructor').textContent = `${classData.first_name || ''} ${classData.last_name || ''}`.trim() || 'N/A';
    document.getElementById('detail-venue').textContent = classData.venue || 'N/A';
    document.getElementById('detail-max-students').textContent = classData.max_students || 'N/A';
    document.getElementById('detail-schedule').textContent = classData.schedule || 'N/A';
    document.getElementById('detail-start-date').textContent = classData.start_date ? new Date(classData.start_date).toLocaleDateString() : 'N/A';
    document.getElementById('detail-end-date').textContent = classData.end_date ? new Date(classData.end_date).toLocaleDateString() : 'N/A';
    document.getElementById('detail-prerequisites').textContent = classData.prerequisites || 'None specified';

    // Handle days_of_week
    const daysTimesContainer = document.getElementById('detail-days-times');
    daysTimesContainer.innerHTML = '';
    
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
        
        if (daysData && typeof daysData === 'object') {
            for (const day in daysData) {
                if (daysData.hasOwnProperty(day)) {
                    const times = daysData[day];
                    const dayTimeItem = document.createElement('div');
                    dayTimeItem.className = 'day-time-item';
                    
                    const startTime = times.start ? formatTime(times.start) : 'N/A';
                    const endTime = times.end ? formatTime(times.end) : 'N/A';
                    
                    dayTimeItem.innerHTML = `
                        <span class="day">${day}</span>
                        <span class="time">${startTime} - ${endTime}</span>
                    `;
                    daysTimesContainer.appendChild(dayTimeItem);
                }
            }
        }
    } else {
        daysTimesContainer.innerHTML = '<div class="no-data">No schedule details available</div>';
    }
    
    // Show modal
    document.getElementById('viewDetailsModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeViewModal() {
    document.getElementById('viewDetailsModal').style.display = 'none';
    document.body.style.overflow = '';
    currentClassId = null;
    currentClassData = null;
}

function formatTime(time24) {
    if (!time24) return 'N/A';
    
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
}

function processApproval(action) {
    if (!currentClassId) return;

    const confirmation = confirm(`Are you sure you want to ${action} this class?`);
    if (!confirmation) return;

    fetch('/approval_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ class_id: currentClassId, action: action })
    })
    .then(response => response.json())
    .then(data => {
        const responseDiv = document.getElementById('responseMessage');
        if (data.status === 'success') {
            responseDiv.className = 'response-message success';
            responseDiv.textContent = data.message;
            
            // Remove the class from the table
            const classRow = document.getElementById('class-' + currentClassId);
            if (classRow) {
                classRow.remove();
            }
            
            // Close modal
            closeViewModal();
            
            // If no more classes, show message
            if (document.querySelectorAll('#classTable tbody tr').length === 0) {
                document.querySelector('.table-wrapper').innerHTML = '<div class="no-data"><i class="fas fa-check-circle"></i><p>No pending classes for approval.</p></div>';
            }
        } else {
            responseDiv.className = 'response-message error';
            responseDiv.textContent = data.message;
        }
        
        // Hide message after 5 seconds
        setTimeout(() => {
            responseDiv.textContent = '';
            responseDiv.className = 'response-message';
        }, 5000);
    })
    .catch(error => {
        console.error('Error:', error);
        const responseDiv = document.getElementById('responseMessage');
        responseDiv.className = 'response-message error';
        responseDiv.textContent = 'An error occurred while processing the request.';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // View details button event listeners
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const classId = this.getAttribute('data-id');
            const row = document.getElementById('class-' + classId);
            if (row) {
                const classData = JSON.parse(row.getAttribute('data-class'));
                openViewModal(classData);
            }
        });
    });

    // Modal button event listeners
    document.getElementById('modal-approve-btn').addEventListener('click', function() {
        processApproval('approve');
    });

    document.getElementById('modal-reject-btn').addEventListener('click', function() {
        processApproval('reject');
    });

    document.getElementById('modal-cancel-btn').addEventListener('click', function() {
        closeViewModal();
    });

    // Modal close button
    document.querySelector('#viewDetailsModal .modal-close').addEventListener('click', function() {
        closeViewModal();
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (document.getElementById('viewDetailsModal').style.display === 'flex') {
                closeViewModal();
            }
        }
    });
});