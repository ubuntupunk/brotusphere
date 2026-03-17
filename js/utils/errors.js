import { MESSAGES, TIMING } from './config.js';

class ErrorHandler {
    constructor() {
        this.errorContainer = null;
    }

    init() {
        this.errorContainer = document.getElementById('error-container');
    }

    showError(message, duration = TIMING.ANIMATION_DELAY_MS * 3) {
        if (!this.errorContainer) {
            this.createContainer();
        }
        
        this.errorContainer.textContent = message;
        this.errorContainer.classList.add('visible');
        
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
            this.hideError();
        }, duration);
    }

    hideError() {
        if (this.errorContainer) {
            this.errorContainer.classList.remove('visible');
        }
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'error-container';
        container.className = 'error-toast';
        document.body.appendChild(container);
        this.errorContainer = container;
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
