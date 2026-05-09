// ============================================
// ETHIOHEALTH AI PRO - SETTINGS MANAGER
// ============================================

const Settings = (function() {
    'use strict';
    
    const settings = {
        // Default settings
        defaults: {
            language: 'en',
            notifications: {
                healthReminders: true,
                voiceFeedback: true,
                emergencyAlerts: true,
                medicationReminders: false
            },
            privacy: {
                shareAnalytics: false,
                storeHistory: true,
                locationTracking: false
            },
            display: {
                fontSize: 'medium',
                highContrast: false,
                reduceMotion: false
            },
            reminders: {
                bpCheckTime: '08:00',
                glucoseCheckTime: '07:00',
                waterReminderInterval: 60, // minutes
                medicationTimes: []
            }
        },
        
        // Current settings
        current: {},
        
        /**
         * Initialize settings
         */
        init: function() {
            settings.loadSettings();
            settings.applySettings();
        },
        
        /**
         * Load settings from storage
         */
        loadSettings: async function() {
            // Try to load from DB
            if (typeof DB !== 'undefined' && DB.getAllSettings) {
                const savedSettings = await DB.getAllSettings();
                
                // Merge with defaults
                settings.current = { ...settings.defaults };
                
                savedSettings.forEach(item => {
                    const keys = item.key.split('.');
                    let target = settings.current;
                    
                    for (let i = 0; i < keys.length - 1; i++) {
                        if (!target[keys[i]]) target[keys[i]] = {};
                        target = target[keys[i]];
                    }
                    target[keys[keys.length - 1]] = item.value;
                });
            } else {
                // Load from localStorage
                const saved = localStorage.getItem('ethiohealth_settings');
                settings.current = saved ? 
                    { ...settings.defaults, ...JSON.parse(saved) } : 
                    { ...settings.defaults };
            }
            
            // Load profile separately
            await settings.loadProfile();
        },
        
        /**
         * Load user profile
         */
        loadProfile: async function() {
            if (typeof DB !== 'undefined' && DB.getUserProfile) {
                const profile = await DB.getUserProfile();
                if (profile) {
                    document.getElementById('profileName').value = profile.name || '';
                    document.getElementById('profileAge').value = profile.age || '';
                    document.getElementById('profileLocation').value = profile.location || '';
                }
            }
        },
        
        /**
         * Apply settings to app
         */
        applySettings: function() {
            // Apply language
            const lang = settings.current.language || 'en';
            if (I18n && I18n.changeLanguage) {
                I18n.changeLanguage(lang);
            }
            
            // Apply display settings
            document.documentElement.style.fontSize = 
                settings.current.display.fontSize === 'large' ? '18px' :
                settings.current.display.fontSize === 'small' ? '14px' : '16px';
            
            if (settings.current.display.highContrast) {
                document.body.classList.add('high-contrast');
            }
            
            if (settings.current.display.reduceMotion) {
                document.body.classList.add('reduce-motion');
            }
            
            // Apply notification settings
            if (settings.current.notifications.voiceFeedback) {
                VoiceAssistant.config.autoSpeak = true;
            } else {
                VoiceAssistant.config.autoSpeak = false;
            }
            
            // Setup reminders if enabled
            if (settings.current.notifications.healthReminders) {
                settings.setupReminders();
            }
            
            // Update toggle switches in UI
            settings.updateToggleUI();
        },
        
        /**
         * Update toggle switches in settings page
         */
        updateToggleUI: function() {
            const toggleReminders = document.getElementById('toggleReminders');
            const toggleVoice = document.getElementById('toggleVoice');
            const toggleEmergency = document.getElementById('toggleEmergency');
            
            if (toggleReminders) {
                toggleReminders.checked = settings.current.notifications.healthReminders;
            }
            if (toggleVoice) {
                toggleVoice.checked = settings.current.notifications.voiceFeedback;
            }
            if (toggleEmergency) {
                toggleEmergency.checked = settings.current.notifications.emergencyAlerts;
            }
        },
        
        /**
         * Save a setting
         */
        saveSetting: async function(key, value) {
            // Update current settings
            const keys = key.split('.');
            let target = settings.current;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!target[keys[i]]) target[keys[i]] = {};
                target = target[keys[i]];
            }
            target[keys[keys.length - 1]] = value;
            
            // Save to DB
            if (typeof DB !== 'undefined' && DB.saveSetting) {
                await DB.saveSetting(key, value);
            }
            
            // Save to localStorage as backup
            localStorage.setItem('ethiohealth_settings', JSON.stringify(settings.current));
            
            // Apply immediately
            settings.applySettings();
        },
        
        /**
         * Get a setting
         */
        getSetting: function(key, defaultValue = null) {
            const keys = key.split('.');
            let target = settings.current;
            
            for (let i = 0; i < keys.length; i++) {
                if (target[keys[i]] === undefined) return defaultValue;
                target = target[keys[i]];
            }
            
            return target;
        },
        
        /**
         * Save user profile
         */
        saveProfile: async function() {
            const profile = {
                name: document.getElementById('profileName')?.value || '',
                age: parseInt(document.getElementById('profileAge')?.value) || 30,
                location: document.getElementById('profileLocation')?.value || ''
            };
            
            if (typeof DB !== 'undefined' && DB.saveUserProfile) {
                await DB.saveUserProfile(profile);
            }
            
            localStorage.setItem('ethiohealth_profile', JSON.stringify(profile));
            
            Utils.showToast(I18n.t('profile_saved') || 'Profile saved!', 'success');
        },
        
        /**
         * Toggle notification setting
         */
        toggleNotification: function(type) {
            const newValue = !settings.current.notifications[type];
            settings.saveSetting(`notifications.${type}`, newValue);
            
            const message = newValue ? 
                (I18n.t('enabled') || 'Enabled') : 
                (I18n.t('disabled') || 'Disabled');
            Utils.showToast(`${type}: ${message}`, 'info');
        },
        
        /**
         * Setup health reminders
         */
        setupReminders: function() {
            // Schedule BP check reminder
            if (settings.current.notifications.healthReminders) {
                const now = new Date();
                const bpTime = settings.current.reminders.bpCheckTime.split(':');
                const bpReminder = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
                    parseInt(bpTime[0]), parseInt(bpTime[1]));
                
                if (bpReminder > now) {
                    const delay = bpReminder - now;
                    setTimeout(function() {
                        if (window.Bridge && Bridge.showNotification) {
                            Bridge.showNotification(
                                I18n.t('reminder_bp') || 'Blood Pressure Check',
                                I18n.t('reminder_bp_message') || 'Time to check your blood pressure'
                            );
                        }
                    }, delay);
                }
                
                // Schedule water reminder
                setInterval(function() {
                    if (settings.current.notifications.healthReminders) {
                        if (window.Bridge && Bridge.showNotification) {
                            Bridge.showNotification(
                                '💧 ' + (I18n.t('reminder_water') || 'Hydration'),
                                I18n.t('reminder_water_message') || 'Remember to drink water!'
                            );
                        }
                    }
                }, settings.current.reminders.waterReminderInterval * 60 * 1000);
            }
        },
        
        /**
         * Export all data
         */
        exportData: async function() {
            Utils.showLoading(I18n.t('exporting') || 'Exporting...');
            
            try {
                let data;
                
                if (typeof DB !== 'undefined' && DB.exportAllData) {
                    data = await DB.exportAllData();
                } else {
                    data = JSON.stringify({
                        profile: localStorage.getItem('ethiohealth_profile'),
                        settings: localStorage.getItem('ethiohealth_settings'),
                        analyses: localStorage.getItem('ethiohealth_analyses'),
                        exportedAt: new Date().toISOString()
                    });
                }
                
                Utils.hideLoading();
                
                // Create downloadable file
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ethiohealth_backup_${new Date().toISOString().slice(0,10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                Utils.showToast(I18n.t('data_exported') || 'Data exported!', 'success');
            } catch (error) {
                Utils.hideLoading();
                Utils.showToast(I18n.t('export_error') || 'Export failed', 'error');
            }
        },
        
        /**
         * Import data
         */
        importData: function(fileInput) {
            const file = fileInput.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const data = e.target.result;
                    
                    if (typeof DB !== 'undefined' && DB.importData) {
                        await DB.importData(data);
                    }
                    
                    localStorage.setItem('ethiohealth_backup', data);
                    
                    Utils.showToast(I18n.t('data_imported') || 'Data imported!', 'success');
                    
                    // Reload settings
                    await settings.loadSettings();
                    settings.applySettings();
                    
                } catch (error) {
                    Utils.showToast(I18n.t('import_error') || 'Import failed', 'error');
                }
            };
            reader.readAsText(file);
        },
        
        /**
         * Clear all data
         */
        clearAllData: function() {
            const confirmed = confirm(I18n.t('confirm_clear_data'));
            
            if (confirmed) {
                if (typeof DB !== 'undefined' && DB.clearOldData) {
                    DB.clearOldData(0); // Clear all
                }
                
                localStorage.clear();
                settings.current = { ...settings.defaults };
                settings.applySettings();
                
                Utils.showToast(I18n.t('data_cleared') || 'Data cleared!', 'success');
            }
        },
        
        /**
         * Change language
         */
        changeLanguage: function(lang) {
            settings.saveSetting('language', lang);
            
            // Update language button UI
            document.getElementById('currentLangText').textContent = lang.toUpperCase();
            
            const langNames = { en: 'English', am: 'አማርኛ', om: 'Oromo' };
            document.getElementById('currentLangText').textContent = 
                lang === 'en' ? 'EN' : lang === 'am' ? 'አማ' : 'OM';
            
            // Update voice assistant language
            if (VoiceAssistant && VoiceAssistant.setLanguage) {
                VoiceAssistant.setLanguage(lang);
            }
        },
        
        /**
         * Get available languages for UI
         */
        getLanguageOptions: function() {
            return [
                { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
                { code: 'am', name: 'Amharic', flag: '🇪🇹', native: 'አማርኛ' },
                { code: 'om', name: 'Oromo', flag: '🇪🇹', native: 'Afaan Oromoo' }
            ];
        }
    };
    
    console.log('✅ Settings initialized');
    return settings;
})();