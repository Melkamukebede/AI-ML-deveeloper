// ============================================
// ETHIOHEALTH AI PRO - UTILITY FUNCTIONS
// ============================================

const Utils = (function() {
    'use strict';
    
    const utils = {
        /**
         * Show toast notification
         */
        showToast: function(message, type = 'info', duration = 3000) {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            
            container.appendChild(toast);
            
            // Animate in
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });
            
            // Remove after duration
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, duration);
        },
        
        /**
         * Show loading overlay
         */
        showLoading: function(message = 'Loading...') {
            const overlay = document.getElementById('loadingOverlay');
            const text = overlay ? overlay.querySelector('.loading-text') : null;
            
            if (overlay) {
                if (text && message) {
                    text.textContent = message;
                }
                overlay.style.display = 'flex';
            }
        },
        
        /**
         * Hide loading overlay
         */
        hideLoading: function() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        },
        
        /**
         * Show modal
         */
        showModal: function(title, content, options = {}) {
            const container = document.getElementById('modalContainer');
            if (!container) return;
            
            const modalHTML = `
                <div class="modal-overlay" onclick="Utils.closeModal(event)">
                    <div class="modal-sheet" onclick="event.stopPropagation()">
                        <div class="modal-handle"></div>
                        <h2 class="modal-title">${title}</h2>
                        <div class="modal-content">${content}</div>
                        ${options.showClose !== false ? `
                        <button class="btn btn-secondary btn-full" onclick="Utils.closeModal()" style="margin-top:16px;">
                            ${options.closeText || 'Close'}
                        </button>` : ''}
                    </div>
                </div>
            `;
            
            container.innerHTML = modalHTML;
            container.classList.add('active');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Store callback if provided
            if (options.onClose) {
                container._onClose = options.onClose;
            }
        },
        
        /**
         * Close modal
         */
        closeModal: function(event) {
            const container = document.getElementById('modalContainer');
            if (!container) return;
            
            // If clicking overlay, close
            if (event && event.target !== event.currentTarget) {
                if (!event.target.classList.contains('modal-overlay')) {
                    return;
                }
            }
            
            container.classList.remove('active');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Call callback if exists
            if (container._onClose) {
                container._onClose();
                container._onClose = null;
            }
            
            // Clear content after animation
            setTimeout(() => {
                if (!container.classList.contains('active')) {
                    container.innerHTML = '';
                }
            }, 300);
        },
        
        /**
         * Format date
         */
        formatDate: function(timestamp, format = 'short') {
            const date = new Date(timestamp);
            
            switch (format) {
                case 'time':
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                case 'date':
                    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
                case 'full':
                    return date.toLocaleString([], { 
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    });
                case 'relative':
                    return utils.timeAgo(timestamp);
                case 'short':
                default:
                    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }
        },
        
        /**
         * Time ago string
         */
        timeAgo: function(timestamp) {
            const now = Date.now();
            const diff = now - timestamp;
            
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 7) {
                return utils.formatDate(timestamp, 'date');
            } else if (days > 0) {
                return days === 1 ? '1 day ago' : `${days} days ago`;
            } else if (hours > 0) {
                return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
            } else if (minutes > 0) {
                return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
            } else {
                return 'Just now';
            }
        },
        
        /**
         * Debounce function
         */
        debounce: function(func, wait = 300) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        /**
         * Throttle function
         */
        throttle: function(func, limit = 300) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        /**
         * Generate unique ID
         */
        generateId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },
        
        /**
         * Validate number input
         */
        isValidNumber: function(value, min = null, max = null) {
            const num = parseFloat(value);
            if (isNaN(num)) return false;
            if (min !== null && num < min) return false;
            if (max !== null && num > max) return false;
            return true;
        },
        
        /**
         * Capitalize first letter
         */
        capitalize: function(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        
        /**
         * Truncate text
         */
        truncate: function(text, length = 100, suffix = '...') {
            if (!text) return '';
            if (text.length <= length) return text;
            return text.substring(0, length) + suffix;
        },
        
        /**
         * Check if online
         */
        isOnline: function() {
            return navigator.onLine;
        },
        
        /**
         * Get current language
         */
        getCurrentLanguage: function() {
            return localStorage.getItem('lang') || 'en';
        },
        
        /**
         * Format number with commas
         */
        formatNumber: function(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        
        /**
         * Parse JSON safely
         */
        safeJSONParse: function(str, fallback = null) {
            try {
                return JSON.parse(str);
            } catch (e) {
                return fallback;
            }
        },
        
        /**
         * Get CSS variable value
         */
        getCSSVariable: function(variableName) {
            return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
        },
        
        /**
         * Vibrate device if supported
         */
        vibrate: function(pattern = 200) {
            if (navigator.vibrate) {
                navigator.vibrate(pattern);
            }
            // Also try Android bridge
            if (window.AndroidBridge && window.AndroidBridge.vibrate) {
                window.AndroidBridge.vibrate(Array.isArray(pattern) ? pattern[0] : pattern);
            }
        },
        
        /**
         * Copy to clipboard
         */
        copyToClipboard: async function(text) {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                    utils.showToast('Copied to clipboard!', 'success');
                    return true;
                } else {
                    // Fallback
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    utils.showToast('Copied!', 'success');
                    return true;
                }
            } catch (error) {
                utils.showToast('Failed to copy', 'error');
                return false;
            }
        },
        
        /**
         * Share content
         */
        shareContent: async function(title, text, url = '') {
            if (navigator.share) {
                try {
                    await navigator.share({ title, text, url });
                    return true;
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error('Share error:', error);
                    }
                    return false;
                }
            } else {
                return await utils.copyToClipboard(text);
            }
        },
        
        /**
         * Get URL parameters
         */
        getURLParams: function() {
            const params = {};
            const searchParams = new URLSearchParams(window.location.search);
            for (const [key, value] of searchParams) {
                params[key] = value;
            }
            return params;
        },
        
        /**
         * Set body direction for RTL support
         */
        setDocumentDirection: function(language) {
            const rtlLanguages = ['am']; // Amharic is RTL
            if (rtlLanguages.includes(language)) {
                document.documentElement.setAttribute('dir', 'rtl');
                document.body.classList.add('rtl');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.body.classList.remove('rtl');
            }
        },
        
        /**
         * Animate element
         */
        animateElement: function(element, animation, duration = 500) {
            if (!element) return;
            
            element.style.animation = `${animation} ${duration}ms ease`;
            
            element.addEventListener('animationend', function() {
                element.style.animation = '';
            }, { once: true });
        },
        
        /**
         * Smooth scroll to element
         */
        scrollToElement: function(element, offset = 0) {
            if (!element) return;
            
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        },
        
        /**
         * Check if element is in viewport
         */
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        
        /**
         * Log error to console and optionally to DB
         */
        logError: function(error, context = '') {
            console.error(`[EthioHealth] ${context}:`, error);
            
            // Store error in DB if available
            if (typeof DB !== 'undefined' && DB.saveSetting) {
                DB.saveSetting('lastError', {
                    message: error.message,
                    context: context,
                    timestamp: Date.now()
                }).catch(() => {});
            }
        }
    };
    
    return utils;
})();

console.log('✅ Utils initialized');