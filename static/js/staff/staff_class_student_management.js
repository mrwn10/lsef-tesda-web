// Global variable to track current auto remarks
let currentAutoRemarks = '';

function openEditModal(enrollmentId, prelim, midterm, finalGrade, remarks, autoRemarks) {
    document.getElementById('editEnrollmentId').value = enrollmentId;
    document.getElementById('prelimGrade').value = prelim || '';
    document.getElementById('midtermGrade').value = midterm || '';
    document.getElementById('finalGrade').value = finalGrade || '';
    document.getElementById('remarks').value = remarks || 'Passed';
    
    // Set auto remarks
    currentAutoRemarks = autoRemarks || 'Incomplete';
    updateAutoRemarksDisplay();
    
    // Enable auto remarks by default
    document.getElementById('useAutoRemarks').checked = true;
    toggleRemarksSelect();
    
    document.getElementById('editGradeModal').style.display = 'block';
}

function calculateAutoRemarks() {
    const prelim = document.getElementById('prelimGrade').value;
    const midterm = document.getElementById('midtermGrade').value;
    const final = document.getElementById('finalGrade').value;
    
    // If all fields are empty, reset display
    if (!prelim && !midterm && !final) {
        currentAutoRemarks = 'Enter grades to see automatic remarks';
        updateAutoRemarksDisplay();
        return;
    }
    
    // Send request to calculate auto remarks
    fetch('/staff_student/get_auto_remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prelim_grade: prelim || null,
            midterm_grade: midterm || null,
            final_grade: final || null
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentAutoRemarks = data.auto_remarks;
            updateAutoRemarksDisplay();
            
            // If auto remarks is enabled, update the remarks select
            if (document.getElementById('useAutoRemarks').checked) {
                document.getElementById('remarks').value = currentAutoRemarks;
            }
        }
    })
    .catch(error => {
        console.error('Error calculating auto remarks:', error);
        currentAutoRemarks = 'Error calculating remarks';
        updateAutoRemarksDisplay();
    });
}

function updateAutoRemarksDisplay() {
    const displayElement = document.getElementById('autoRemarksText');
    const container = document.getElementById('autoRemarksDisplay');
    
    displayElement.textContent = currentAutoRemarks;
    
    // Remove all existing classes
    container.className = 'auto-remarks-display';
    
    // Add appropriate class based on remarks
    if (currentAutoRemarks === 'Passed' || currentAutoRemarks === 'Completed') {
        container.classList.add('passed');
    } else if (currentAutoRemarks === 'Failed') {
        container.classList.add('failed');
    } else if (currentAutoRemarks === 'Incomplete') {
        container.classList.add('incomplete');
    } else {
        container.classList.add('neutral');
    }
}

function toggleRemarksSelect() {
    const useAutoRemarks = document.getElementById('useAutoRemarks').checked;
    const remarksSelect = document.getElementById('remarks');
    
    if (useAutoRemarks) {
        remarksSelect.disabled = true;
        remarksSelect.value = currentAutoRemarks;
        remarksSelect.title = 'Automatic remarks is enabled';
    } else {
        remarksSelect.disabled = false;
        remarksSelect.title = 'Manual remarks selection';
    }
}

function submitGradeEdit() {
    const enrollmentId = document.getElementById('editEnrollmentId').value;
    const prelim = document.getElementById('prelimGrade').value;
    const midterm = document.getElementById('midtermGrade').value;
    const finalGrade = document.getElementById('finalGrade').value;
    const useAutoRemarks = document.getElementById('useAutoRemarks').checked;
    let remarks = document.getElementById('remarks').value;

    // Validate grades
    if (prelim && (prelim < 0 || prelim > 100)) {
        alert('Prelim grade must be between 0 and 100');
        return;
    }
    if (midterm && (midterm < 0 || midterm > 100)) {
        alert('Midterm grade must be between 0 and 100');
        return;
    }
    if (finalGrade && (finalGrade < 0 || finalGrade > 100)) {
        alert('Final grade must be between 0 and 100');
        return;
    }

    fetch('/staff_student/edit_grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            enrollment_id: enrollmentId,
            prelim_grade: prelim || null,
            midterm_grade: midterm || null,
            final_grade: finalGrade || null,
            remarks: remarks,
            use_auto_remarks: useAutoRemarks
        })
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: data.message,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            location.reload();
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update grade'
        });
    });
}

function openProfileModal(userId) {
    fetch(`/staff_student_profile/${userId}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                throw new Error(data.error || 'Failed to load profile');
            }

            // Personal Information
            const profile = data.personal_info;
            document.getElementById('profileName').innerText = 
                `${profile.first_name} ${profile.middle_name || ''} ${profile.last_name}`;
            document.getElementById('profileEmail').innerText = profile.email;
            document.getElementById('profileContact').innerText = profile.contact_number;
            document.getElementById('profileDOB').innerText = profile.date_of_birth;
            document.getElementById('profileGender').innerText = profile.gender;
            document.getElementById('profileAddress').innerText = 
                `${profile.baranggay}, ${profile.municipality}, ${profile.province}`;
            document.getElementById('profilePicture').src = 
                profile.profile_picture ? `/static/uploads/profile_pictures/${profile.profile_picture}` : '/static/img/tesda_logo.png';

            // Classes Information
            const classesTable = document.getElementById('profileClassesTable').getElementsByTagName('tbody')[0];
            classesTable.innerHTML = '';
            
            data.classes.forEach(cls => {
                const row = classesTable.insertRow();
                
                // Class details
                row.insertCell(0).textContent = cls.class_title;
                
                // Format schedule information
                let scheduleText = cls.schedule;
                if (cls.days_of_week && Array.isArray(cls.days_of_week)) {
                    scheduleText += ` (${cls.days_of_week.join(', ')})`;
                }
                row.insertCell(1).textContent = scheduleText;
                
                row.insertCell(2).textContent = cls.venue;
                row.insertCell(3).textContent = cls.start_date;
                row.insertCell(4).textContent = cls.end_date;
                
                // Final grade and remarks
                row.insertCell(5).textContent = cls.final_grade !== null ? cls.final_grade + '%' : 'N/A';
                row.insertCell(6).textContent = cls.remarks || 'N/A';
                row.insertCell(7).textContent = cls.instructor_name || 'N/A';
            });

            // Certificates Information
            const certsTable = document.getElementById('profileCertificatesTable').getElementsByTagName('tbody')[0];
            certsTable.innerHTML = '';
            
            data.certificates.forEach(cert => {
                const row = certsTable.insertRow();
                row.insertCell(0).textContent = cert.course || cert.class_title;
                row.insertCell(1).textContent = cert.date;
                row.insertCell(2).textContent = new Date(cert.created_at).toLocaleDateString();
                
                // View Certificate Link
                const viewLink = document.createElement('a');
                viewLink.href = cert.file_path;
                viewLink.textContent = 'View';
                viewLink.target = '_blank';
                viewLink.className = 'cert-action-link';
                row.insertCell(3).appendChild(viewLink);

                // Download Certificate Button
                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = 'Download';
                downloadBtn.className = 'cert-action-btn';
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = cert.file_path;
                    link.download = `certificate_${cert.id}_${cert.date}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
                row.insertCell(4).appendChild(downloadBtn);
            });

            document.getElementById('viewProfileModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error loading profile: ${error.message}`
            });
        });
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function confirmGenerateCertificate(enrollmentId, studentName, remarks) {
    if (remarks !== 'Completed') {
        Swal.fire({
            icon: 'warning',
            title: 'Cannot Generate Certificate',
            text: 'Certificate can only be generated for students with "Completed" status'
        });
        return;
    }
    
    Swal.fire({
        title: 'Generate Certificate',
        text: `Generate certificate for ${studentName}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Generate',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            generateCertificate(enrollmentId);
        }
    });
}

function generateCertificate(enrollmentId) {
    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `enrollment_id=${enrollmentId}`
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: data.message,
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                location.reload();
            });
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error: ${error.message || 'Failed to generate certificate'}`
        });
    });
}

function confirmGenerateCompletion(enrollment_id, student_name, remarks) {
    if (remarks !== 'Completed') {
        Swal.fire({
            icon: 'warning',
            title: 'Cannot Generate Certificate',
            text: 'Student has not completed the course yet'
        });
        return;
    }
    
    Swal.fire({
        title: 'Generate Completion Certificate',
        text: `Generate Completion Certificate for ${student_name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Generate',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            generateCompletionCertificate(enrollment_id);
        }
    });
}

function generateCompletionCertificate(enrollment_id) {
    fetch('/generate-completion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `enrollment_id=${enrollment_id}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Completion Certificate generated successfully!',
                timer: 3000,
                showConfirmButton: false
            }).then(() => {
                // Open the certificate in a new tab
                window.open(`/${data.file_path}`, '_blank');
                location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error: ' + data.message
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to generate certificate'
        });
    });
}

// Event listeners for auto remarks toggle
document.addEventListener('DOMContentLoaded', function() {
    const useAutoRemarks = document.getElementById('useAutoRemarks');
    if (useAutoRemarks) {
        useAutoRemarks.addEventListener('change', toggleRemarksSelect);
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const editModal = document.getElementById('editGradeModal');
    const profileModal = document.getElementById('viewProfileModal');
    
    if (event.target === editModal) {
        closeModal('editGradeModal');
    }
    if (event.target === profileModal) {
        closeModal('viewProfileModal');
    }
}