$(document).ready(function() {
    // Fetch schedule data from the API
    const userId = $('body').data('user-id');
    
    // Fetch user statistics
    fetchUserStatistics(userId);
    
    // Fetch schedule data
    $.ajax({
        url: `/api/schedule/${userId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.schedule && response.schedule.length > 0) {
                populateSchedule(response.schedule);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching schedule:', error);
        }
    });

    // Verification Notification Handling
    const verificationNotification = document.getElementById('verificationNotification');
    const closeNotificationBtn = document.getElementById('closeNotification');

    if (verificationNotification && closeNotificationBtn) {
        // Show notification with animation
        setTimeout(() => {
            verificationNotification.classList.add('show');
        }, 1000);

        // Close notification when close button is clicked
        closeNotificationBtn.addEventListener('click', function() {
            closeVerificationNotification();
        });

        // Auto-close notification after 15 seconds
        setTimeout(() => {
            if (verificationNotification.classList.contains('show')) {
                closeVerificationNotification();
            }
        }, 15000);

        // Close notification when clicking outside
        verificationNotification.addEventListener('click', function(e) {
            if (e.target === verificationNotification) {
                closeVerificationNotification();
            }
        });
    }

    function closeVerificationNotification() {
        if (verificationNotification) {
            verificationNotification.classList.remove('show');
            verificationNotification.classList.add('hiding');
            
            // Mark notification as seen in the backend
            $.ajax({
                url: '/api/mark_notification_seen',
                method: 'POST',
                success: function(response) {
                    console.log('Notification marked as seen');
                },
                error: function(xhr, status, error) {
                    console.error('Error marking notification as seen:', error);
                }
            });
            
            // Remove from DOM after animation
            setTimeout(() => {
                verificationNotification.style.display = 'none';
            }, 500);
        }
    }

    function fetchUserStatistics(userId) {
        $.ajax({
            url: `/api/user/statistics/${userId}`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#enrolledCount').text(response.data.enrolled_courses);
                    $('#pendingCount').text(response.data.pending_courses);
                    $('#completedCount').text(response.data.completed_courses);
                    
                    // If user has enrolled courses, ensure notification doesn't show
                    if (response.data.enrolled_courses > 0) {
                        // Mark notification as seen to prevent future displays
                        $.ajax({
                            url: '/api/mark_notification_seen',
                            method: 'POST',
                            success: function(response) {
                                console.log('Notification marked as seen due to existing enrollment');
                            },
                            error: function(xhr, status, error) {
                                console.error('Error marking notification as seen:', error);
                            }
                        });
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching user statistics:', error);
                // Set default values
                $('#enrolledCount').text('0');
                $('#pendingCount').text('0');
                $('#completedCount').text('0');
            }
        });
    }

    function populateSchedule(classes) {
        // First pass: identify all multi-hour classes
        classes.forEach(function(cls) {
            cls.days.forEach(function(daySchedule) {
                const day = daySchedule.day;
                const startTime = daySchedule.start_time;
                const endTime = daySchedule.end_time;
                
                // Parse time to get hours
                const startParts = startTime.split(':');
                const endParts = endTime.split(':');
                
                const startHour = parseInt(startParts[0]);
                const endHour = parseInt(endParts[0]);
                
                // Calculate duration in hours
                const duration = endHour - startHour;
                
                // Create unique identifier for this class session
                const classSessionId = `${day}-${cls.class_id}-${startTime}-${endTime}`;
                
                // Create class event HTML (only show details in first hour)
                const eventHtml = `
                    <div class="class-event">
                        <div class="time-range">${startTime} - ${endTime}</div>
                        <div class="course-code">${cls.title}</div>
                        <div class="time">${cls.course}</div>
                        <div class="venue">${cls.venue}</div>
                    </div>
                `;
                
                const emptyEventHtml = `
                    <div class="class-event-multi"></div>
                `;
                
                // Mark all hours for this class
                for (let hour = startHour; hour < endHour; hour++) {
                    const cell = $(`#cell-${day}-${hour}`);
                    if (cell.length) {
                        if (hour === startHour) {
                            // First hour - show full details
                            cell.html(eventHtml);
                        } else {
                            // Subsequent hours - show colored background only
                            cell.html(emptyEventHtml);
                        }
                        cell.data('class-session', classSessionId);
                    }
                }
            });
        });
    }

    // Add some interactive effects
    $('.stat-card').hover(
        function() {
            $(this).addClass('stat-card-hover');
        },
        function() {
            $(this).removeClass('stat-card-hover');
        }
    );

    // Add confetti effect for verification notification (optional)
    function showConfetti() {
        if (verificationNotification && verificationNotification.classList.contains('show')) {
            // Simple confetti effect using emojis
            const confettiContainer = document.createElement('div');
            confettiContainer.className = 'confetti-container';
            document.body.appendChild(confettiContainer);

            const emojis = ['🎉', '🎊', '⭐', '✨', '🌟', '💫', '🔥', '💯'];
            
            for (let i = 0; i < 20; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.animationDelay = Math.random() * 2 + 's';
                confettiContainer.appendChild(confetti);
            }

            // Remove confetti after animation
            setTimeout(() => {
                confettiContainer.remove();
            }, 3000);
        }
    }

    // Show confetti when notification appears
    if (verificationNotification) {
        setTimeout(showConfetti, 1200);
    }
});