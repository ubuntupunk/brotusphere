import { ENDPOINTS } from '../config.js';

export function resetPassword() {
    return `
<div class="page" id="page-reset-password">
    <div class="auth-hero">
        <h1>Reset Password</h1>
    </div>
    <div class="auth-content">
        <form class="reset-form" id="resetPasswordForm">
            <div class="form-group">
                <label>New Password</label>
                <input type="password" name="password" required minlength="6" placeholder="Enter new password">
            </div>
            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" required minlength="6" placeholder="Confirm new password">
            </div>
            <button type="submit" class="auth-submit">Reset Password</button>
            <p class="auth-message" id="resetMessage"></p>
        </form>
    </div>
</div>
    `;
}

export async function initResetPasswordPage() {
    const form = document.getElementById('resetPasswordForm');
    const message = document.getElementById('resetMessage');
    
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
        message.textContent = 'Invalid reset link. Please request a new password reset.';
        message.className = 'auth-message error';
        form.reset();
        return;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        
        if (password !== confirmPassword) {
            message.textContent = 'Passwords do not match';
            message.className = 'auth-message error';
            return;
        }
        
        if (password.length < 6) {
            message.textContent = 'Password must be at least 6 characters';
            message.className = 'auth-message error';
            return;
        }
        
        try {
            const response = await fetch(`${ENDPOINTS.AUTH}?action=reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                message.textContent = 'Password reset successful! Redirecting to login...';
                message.className = 'auth-message success';
                setTimeout(() => {
                    window.router.navigate('/');
                }, 2000);
            } else {
                message.textContent = data.error || 'Failed to reset password';
                message.className = 'auth-message error';
            }
        } catch (error) {
            message.textContent = 'Connection error';
            message.className = 'auth-message error';
        }
    });
}
