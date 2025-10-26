// Chart instances
let enrollmentBarChart = null;
let userPieChart = null;

$(document).ready(function() {
    // Initialize modal functionality first
    initializeModals();
    
    // Load dashboard data
    $.ajax({
        url: "/admin/dashboard/data",
        type: 'GET',
        success: function(response) {
            // Update main statistics with animation
            animateValue('total-courses', response.total_courses, 0);
            animateValue('total-classes', response.total_classes, 100);
            animateValue('total-students', response.total_students, 200);
            animateValue('total-staff', response.total_staff, 300);
            animateValue('total-enrollments', response.total_enrollments, 400);
            
            // Update completion rate with percentage animation
            animatePercentage('completion-rate', response.completion_rate, 500);
            
            // Update other elements
            $('#pending-courses-badge').text(response.pending_courses);
            $('#recent-certificates').text(response.recent_certificates);
            
            // Update recent enrollments
            updateRecentEnrollments(response.recent_enrollments);
            
            // Update popular courses
            updatePopularCourses(response.popular_courses);
            
            // Create charts
            createCharts(response);
            
            // Show content after animations
            setTimeout(function() {
                $('.loading-spinner').hide();
                $('.stats-grid').fadeIn();
                $('.dashboard-content').fadeIn();
            }, 800);
        },
        error: function(xhr, status, error) {
            console.error('Error loading dashboard data:', error);
            $('.loading-spinner').html('<p>Error loading dashboard data. Please refresh the page.</p>');
        }
    });
});

// Animation function for numbers
function animateValue(id, target, delay = 0) {
    setTimeout(function() {
        const obj = document.getElementById(id);
        if (!obj) return;
        
        let current = 0;
        const duration = 1500; // 1.5 seconds
        const increment = target / (duration / 20);
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            current = Math.min(target, (elapsed / duration) * target);
            
            obj.innerHTML = Math.floor(current);
            
            if (current < target) {
                requestAnimationFrame(update);
            } else {
                obj.innerHTML = target; // Ensure final value is exact
            }
        }
        
        update();
    }, delay);
}

// Animation function for percentages
function animatePercentage(id, target, delay = 0) {
    setTimeout(function() {
        const obj = document.getElementById(id);
        if (!obj) return;
        
        let current = 0;
        const duration = 1500;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            current = Math.min(target, (elapsed / duration) * target);
            
            obj.innerHTML = Math.floor(current) + '%';
            
            if (current < target) {
                requestAnimationFrame(update);
            } else {
                obj.innerHTML = target + '%'; // Ensure final value is exact
            }
        }
        
        update();
    }, delay);
}

// Update recent enrollments list
function updateRecentEnrollments(enrollments) {
    let enrollmentsHtml = '';
    if (enrollments && enrollments.length > 0) {
        enrollments.forEach(enrollment => {
            enrollmentsHtml += `
                <div class="enrollment-item">
                    <div class="enrollment-info">
                        <strong>${enrollment.student_name}</strong>
                        <span>${enrollment.course_title} - ${enrollment.class_title}</span>
                    </div>
                    <div class="enrollment-date">${enrollment.enrollment_date}</div>
                </div>
            `;
        });
    } else {
        enrollmentsHtml = '<p class="no-data">No recent enrollments</p>';
    }
    $('#recent-enrollments-list').html(enrollmentsHtml);
}

// Update popular courses list
function updatePopularCourses(courses) {
    let coursesHtml = '';
    if (courses && courses.length > 0) {
        courses.forEach(course => {
            coursesHtml += `
                <div class="course-item">
                    <div class="course-name">${course.course_title}</div>
                    <div class="course-enrollments">${course.enrollment_count} enrollments</div>
                </div>
            `;
        });
    } else {
        coursesHtml = '<p class="no-data">No enrollment data available</p>';
    }
    $('#popular-courses-list').html(coursesHtml);
}

// Chart creation function
function createCharts(data) {
    // Destroy existing charts if they exist
    if (enrollmentBarChart) {
        enrollmentBarChart.destroy();
    }
    if (userPieChart) {
        userPieChart.destroy();
    }

    // Bar Chart - Course Enrollment Distribution
    const barCtx = document.getElementById('enrollmentBarChart');
    if (barCtx && data.popular_courses && data.popular_courses.length > 0) {
        enrollmentBarChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: data.popular_courses.map(course => {
                    // Truncate long course names
                    return course.course_title.length > 20 
                        ? course.course_title.substring(0, 20) + '...' 
                        : course.course_title;
                }),
                datasets: [{
                    label: 'Number of Enrollments',
                    data: data.popular_courses.map(course => course.enrollment_count),
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899',
                        '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#ef4444'
                    ],
                    borderColor: [
                        '#2563eb', '#059669', '#7c3aed', '#d97706', '#db2777',
                        '#0891b2', '#65a30d', '#ea580c', '#4f46e5', '#dc2626'
                    ],
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        callbacks: {
                            title: function(tooltipItems) {
                                // Show full course name in tooltip
                                const index = tooltipItems[0].dataIndex;
                                return data.popular_courses[index].course_title;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    } else {
        // Show message if no data for bar chart
        $('#enrollmentBarChart').closest('.chart-body').html('<p class="no-data">No enrollment data available for chart</p>');
    }

    // Pie Chart - User Distribution
    const pieCtx = document.getElementById('userPieChart');
    if (pieCtx) {
        userPieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Students', 'Staff', 'Admin'],
                datasets: [{
                    data: [data.total_students, data.total_staff, 1], // Assuming 1 admin
                    backgroundColor: [
                        '#8b5cf6', // Student - Purple
                        '#f59e0b', // Staff - Amber
                        '#ef4444'  // Admin - Red
                    ],
                    borderColor: [
                        '#7c3aed',
                        '#d97706',
                        '#dc2626'
                    ],
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

// Initialize modal functionality - ENHANCED VERSION (Copied from User Management)
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

    // Logout Modal Functionality - ENHANCED
    $('#logout-trigger').click(function(e) {
        e.preventDefault();
        $('#logout-modal').fadeIn();
    });
    
    $('#cancel-logout').click(function() {
        $('#logout-modal').fadeOut();
    });
    
    $('#confirm-logout').click(function() {
        window.location.href = window.appUrls.logoutUrl; // Using the URL from appUrls
    });

    // Close alert when X is clicked (if you add alerts later)
    $('.close-alert').click(function() {
        $('#status-message').fadeOut();
    });
}

// Show status message (for potential future use)
function showStatusMessage(message, type) {
    const $alert = $('#status-message');
    const $messageText = $('#message-text');
    
    $alert.removeClass('success danger warning').addClass(type);
    $messageText.text(message);
    $alert.fadeIn();
    
    // Auto-hide after 5 seconds
    setTimeout(() => $alert.fadeOut(), 5000);
}

// Handle window resize for charts
$(window).on('resize', function() {
    if (enrollmentBarChart) {
        enrollmentBarChart.resize();
    }
    if (userPieChart) {
        userPieChart.resize();
    }
});

// Refresh dashboard data every 5 minutes (optional)
function startAutoRefresh() {
    setInterval(function() {
        if (document.visibilityState === 'visible') {
            // Only refresh if page is visible
            $.ajax({
                url: "/admin/dashboard/data",
                type: 'GET',
                success: function(response) {
                    // Update statistics without animation on refresh
                    $('#total-courses').text(response.total_courses);
                    $('#total-classes').text(response.total_classes);
                    $('#total-students').text(response.total_students);
                    $('#total-staff').text(response.total_staff);
                    $('#total-enrollments').text(response.total_enrollments);
                    $('#completion-rate').text(response.completion_rate + '%');
                    $('#pending-courses-badge').text(response.pending_courses);
                    $('#recent-certificates').text(response.recent_certificates);
                    
                    updateRecentEnrollments(response.recent_enrollments);
                    updatePopularCourses(response.popular_courses);
                    
                    // Recreate charts with new data
                    createCharts(response);
                }
            });
        }
    }, 300000); // 5 minutes
}

// Uncomment the line below if you want auto-refresh
// startAutoRefresh();