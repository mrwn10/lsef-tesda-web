document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentStep = 1;
    let email = '';
    let countdownInterval;
    let countdownTime = 60;

    // Initialize the progress indicator
    updateProgressIndicator();

    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.input-wrapper').querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // OTP input auto-focus
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.dataset.index);
            const value = this.value;
            
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                this.value = value.replace(/\D/g, '');
                return;
            }
            
            if (value.length === 1 && index < 6) {
                const nextInput = document.querySelector(`.otp-input[data-index="${index + 1}"]`);
                if (nextInput) nextInput.focus();
            }
            updateFullOTP();
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0) {
                const prevIndex = parseInt(this.dataset.index) - 1;
                const prevInput = document.querySelector(`.otp-input[data-index="${prevIndex}"]`);
                if (prevInput) prevInput.focus();
            }
        });
        
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').slice(0, 6);
            if (/^\d+$/.test(pasteData)) {
                const digits = pasteData.split('');
                digits.forEach((digit, index) => {
                    const otpInput = document.querySelector(`.otp-input[data-index="${index + 1}"]`);
                    if (otpInput) {
                        otpInput.value = digit;
                        otpInput.classList.add('filled');
                    }
                });
                updateFullOTP();
                document.getElementById('verify-otp-btn').focus();
            }
        });
    });

    // Update the full OTP value
    function updateFullOTP() {
        let otp = '';
        document.querySelectorAll('.otp-input').forEach(input => {
            otp += input.value;
            if (input.value) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
        });
        document.getElementById('otp').value = otp;
    }

    // Update progress indicator
    function updateProgressIndicator() {
        const progressSteps = document.querySelectorAll('.progress-step');
        const progressFill = document.querySelector('.progress-fill');
        
        progressSteps.forEach((step, index) => {
            const stepNumber = parseInt(step.dataset.step);
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Update progress bar
        const progressPercentage = ((currentStep - 1) / 3) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }

    // Show error message
    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        const errorText = element.querySelector('.error-text');
        errorText.textContent = message;
        element.classList.add('show');
        
        // Add error state to input if applicable
        const input = document.querySelector(`#${elementId.replace('-error', '')}`);
        if (input) {
            input.closest('.input-wrapper').classList.add('error');
        }
        
        setTimeout(() => {
            element.classList.remove('show');
            if (input) {
                input.closest('.input-wrapper').classList.remove('error');
            }
        }, 5000);
    }

    // Show success message
    function showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        const successText = element.querySelector('.success-text');
        successText.textContent = message;
        element.classList.add('show');
        
        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    }

    // Start countdown timer
    function startCountdown() {
        clearInterval(countdownInterval);
        countdownTime = 60;
        const resendOtp = document.getElementById('resend-otp');
        const countdown = document.getElementById('countdown');
        
        resendOtp.classList.add('disabled');
        
        countdownInterval = setInterval(function() {
            countdownTime--;
            const minutes = Math.floor(countdownTime / 60);
            const seconds = countdownTime % 60;
            countdown.textContent = `(${minutes}:${seconds < 10 ? '0' + seconds : seconds})`;
            
            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                resendOtp.classList.remove('disabled');
                countdown.textContent = '';
            }
        }, 1000);
    }

    // Change step
    function goToStep(step) {
        currentStep = step;
        document.querySelectorAll('.step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        document.getElementById(`step${step}`).classList.add('active');
        
        updateProgressIndicator();
        
        if (step === 2) {
            startCountdown();
        }
        
        // Scroll to top of container
        document.querySelector('.password-reset-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    // Validate password strength
    function validatePassword(password) {
        const rules = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        // Update UI indicators
        Object.keys(rules).forEach(rule => {
            const element = document.getElementById(`pw-${rule}`);
            if (rules[rule]) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        });
        
        // Update strength meter
        const strengthFill = document.getElementById('strength-fill');
        const validRules = Object.values(rules).filter(Boolean).length;
        
        strengthFill.className = 'strength-fill';
        if (validRules <= 2) {
            strengthFill.classList.add('strength-weak');
        } else if (validRules === 3) {
            strengthFill.classList.add('strength-fair');
        } else if (validRules === 4) {
            strengthFill.classList.add('strength-good');
        } else if (validRules === 5) {
            strengthFill.classList.add('strength-strong');
        }
        
        return Object.values(rules).every(Boolean);
    }

    // Event Listeners for forms to prevent default submission
    document.getElementById('emailForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleEmailSubmit();
    });

    document.getElementById('otpForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleOtpSubmit();
    });

    document.getElementById('passwordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handlePasswordSubmit();
    });

    // Handle Email Submission
    function handleEmailSubmit() {
        email = document.getElementById('email').value.trim();
        const sendOtpBtn = document.getElementById('send-otp-btn');
        
        if (!email) {
            showError('email-error', 'Please enter your email address');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email-error', 'Please enter a valid email address');
            return;
        }

        // Show loading state
        sendOtpBtn.classList.add('loading');
        sendOtpBtn.disabled = true;

        // Send request to server
        fetch('/request_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('email-display').textContent = email;
                goToStep(2);
            } else {
                showError('email-error', data.message);
            }
        })
        .catch(error => {
            showError('email-error', 'An error occurred. Please try again.');
            console.error('Error:', error);
        })
        .finally(() => {
            sendOtpBtn.classList.remove('loading');
            sendOtpBtn.disabled = false;
        });
    }

    // Handle OTP Submission
    function handleOtpSubmit() {
        const otp = document.getElementById('otp').value;
        const verifyOtpBtn = document.getElementById('verify-otp-btn');

        if (!otp || otp.length !== 6) {
            showError('otp-error', 'Please enter the 6-digit verification code');
            return;
        }

        verifyOtpBtn.classList.add('loading');
        verifyOtpBtn.disabled = true;

        fetch('/verify_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                otp: otp
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                goToStep(3);
            } else {
                showError('otp-error', data.message);
            }
        })
        .catch(error => {
            showError('otp-error', 'An error occurred. Please try again.');
            console.error('Error:', error);
        })
        .finally(() => {
            verifyOtpBtn.classList.remove('loading');
            verifyOtpBtn.disabled = false;
        });
    }

    // Handle Password Reset
    function handlePasswordSubmit() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const resetPasswordBtn = document.getElementById('reset-password-btn');

        if (!newPassword) {
            showError('password-error', 'Please enter a new password');
            return;
        }

        if (!validatePassword(newPassword)) {
            showError('password-error', 'Please meet all password requirements');
            return;
        }

        if (!confirmPassword) {
            showError('confirm-error', 'Please confirm your new password');
            return;
        }

        if (newPassword !== confirmPassword) {
            showError('confirm-error', 'Passwords do not match');
            return;
        }

        resetPasswordBtn.classList.add('loading');
        resetPasswordBtn.disabled = true;

        fetch('/reset_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                goToStep(4);
            } else {
                showError('confirm-error', data.message);
            }
        })
        .catch(error => {
            showError('confirm-error', 'An error occurred. Please try again.');
            console.error('Error:', error);
        })
        .finally(() => {
            resetPasswordBtn.classList.remove('loading');
            resetPasswordBtn.disabled = false;
        });
    }

    // Resend OTP handler
    document.getElementById('resend-otp').addEventListener('click', function() {
        if (this.classList.contains('disabled')) return;

        this.classList.add('disabled');
        document.querySelectorAll('.otp-input').forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });
        document.getElementById('otp').value = '';
        document.getElementById('otp-error').classList.remove('show');

        fetch('/request_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('otp-success', 'New verification code sent successfully');
                startCountdown();
            } else {
                showError('otp-error', data.message);
            }
        })
        .catch(error => {
            showError('otp-error', 'An error occurred. Please try again.');
            console.error('Error:', error);
        });
    });

    // Real-time password validation
    document.getElementById('new-password').addEventListener('input', function() {
        validatePassword(this.value);
    });

    // Back button handlers
    document.getElementById('back-to-email-btn').addEventListener('click', function() {
        goToStep(1);
    });

    document.getElementById('back-to-otp-btn').addEventListener('click', function() {
        goToStep(2);
    });

    // Enter key support for forms
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const activeStep = document.querySelector('.step.active');
            if (activeStep) {
                const form = activeStep.querySelector('form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        }
    });

    // Auto-focus first input on step change
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const activeStep = document.querySelector('.step.active');
                if (activeStep) {
                    const firstInput = activeStep.querySelector('input');
                    if (firstInput && firstInput.type !== 'hidden') {
                        setTimeout(() => firstInput.focus(), 300);
                    }
                }
            }
        });
    });

    document.querySelectorAll('.step').forEach(step => {
        observer.observe(step, { attributes: true });
    });
});