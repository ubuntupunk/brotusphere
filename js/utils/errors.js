import { MESSAGES, TIMING } from '../config.js';

class ErrorHandler {
    constructor() {
        this.errorContainer = null;
        this.successContainer = null;
    }

    init() {
        this.errorContainer = document.getElementById('error-container');
        this.successContainer = document.getElementById('success-container');
    }

    showError(message, duration = TIMING.ANIMATION_DELAY_MS * 3) {
        if (!this.errorContainer) {
            this.createContainer('error');
        }
        
        this.errorContainer.textContent = message;
        this.errorContainer.classList.add('visible');
        
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
            this.hideError();
        }, duration);
    }

    showSuccess(message, duration = TIMING.ANIMATION_DELAY_MS * 3) {
        if (!this.successContainer) {
            this.createContainer('success');
        }
        
        this.successContainer.textContent = message;
        this.successContainer.classList.add('visible');
        
        clearTimeout(this.hideSuccessTimeout);
        this.hideSuccessTimeout = setTimeout(() => {
            this.hideSuccess();
        }, duration);
    }

    hideError() {
        if (this.errorContainer) {
            this.errorContainer.classList.remove('visible');
        }
    }

    hideSuccess() {
        if (this.successContainer) {
            this.successContainer.classList.remove('visible');
        }
    }

    createContainer(type) {
        const container = document.createElement('div');
        container.id = `${type}-container`;
        container.className = `${type}-toast`;
        document.body.appendChild(container);
        
        if (type === 'error') {
            this.errorContainer = container;
        } else {
            this.successContainer = container;
        }
    }

    handleApiError(error, fallbackMessage = MESSAGES.SERVER_ERROR) {
        console.error('API Error:', error);
        
        if (error.response) {
            const status = error.response.status;
            
            if (status === 401) {
                this.showError(MESSAGES.AUTH_ERROR);
            } else if (status === 404) {
                this.showError(MESSAGES.NOT_FOUND);
            } else if (status >= 500) {
                this.showError(MESSAGES.SERVER_ERROR);
            } else {
                const data = error.response.data;
                this.showError(data?.error || fallbackMessage);
            }
        } else if (error.request) {
            this.showError(MESSAGES.NETWORK_ERROR);
        } else {
            this.showError(fallbackMessage);
        }
    }
}

window.errorHandler = new ErrorHandler();
