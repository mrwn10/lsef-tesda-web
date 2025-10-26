function openEditModal(enrollmentId, prelim, midterm, finalGrade, remarks) {
            document.getElementById('editEnrollmentId').value = enrollmentId;
            document.getElementById('prelimGrade').value = prelim || '';
            document.getElementById('midtermGrade').value = midterm || '';
            document.getElementById('finalGrade').value = finalGrade || '';
            document.getElementById('remarks').value = remarks || 'Passed';
            document.getElementById('editGradeModal').style.display = 'block';
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
                    alert(`Error loading profile: ${error.message}`);
                });
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        function submitGradeEdit() {
            const enrollmentId = document.getElementById('editEnrollmentId').value;
            const prelim = document.getElementById('prelimGrade').value;
            const midterm = document.getElementById('midtermGrade').value;
            const finalGrade = document.getElementById('finalGrade').value;
            const remarks = document.getElementById('remarks').value;

            fetch('/staff_student/edit_grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enrollment_id: enrollmentId,
                    prelim_grade: prelim,
                    midterm_grade: midterm,
                    final_grade: finalGrade,
                    remarks: remarks
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload();
            });
        }

        function confirmGenerateCertificate(enrollmentId, studentName, remarks) {
            if (remarks !== 'Completed') {
                alert('Cannot generate certificate for students without "Completed" status');
                return;
            }
            
            if (confirm(`Generate certificate for ${studentName}?`)) {
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
                        // Show success message with transaction hash
                        alert(`Success: ${data.message}`);
                        
                        // Reload the page to show updated status
                        location.reload();
                    } else {
                        throw new Error(data.message || 'Unknown error occurred');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(`Error: ${error.message || 'Failed to generate certificate'}`);
                });
            }
        }

        function confirmGenerateCompletion(enrollment_id, student_name, remarks) {
            if (remarks !== 'Completed') {
                alert('Student has not completed the course yet');
                return;
            }
            
            if (confirm(`Generate Completion Certificate for ${student_name}?`)) {
                generateCompletionCertificate(enrollment_id);
            }
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
                    alert('Completion Certificate generated successfully!');
                    // Open the certificate in a new tab
                    window.open(`/${data.file_path}`, '_blank');
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to generate certificate');
            });
        }