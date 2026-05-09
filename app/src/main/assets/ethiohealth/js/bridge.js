// ============================================
// ETHIOHEALTH AI PRO - ANDROID BRIDGE
// ============================================

const Bridge = (function() {
    'use strict';
    
    const bridge = {
        /**
         * Check if running inside Android WebView
         */
        isAndroidWebView: function() {
            const userAgent = navigator.userAgent.toLowerCase();
            return userAgent.includes('android') || userAgent.includes('ethiohealth');
        },
        
        /**
         * Call Android method safely
         */
        callNative: function(methodName, ...args) {
            try {
                if (window.NativeBridge && typeof window.NativeBridge[methodName] === 'function') {
                    return window.NativeBridge[methodName](...args);
                }
                console.warn(`Native method "${methodName}" not available`);
                return null;
            } catch (error) {
                console.error(`Error calling ${methodName}:`, error);
                return null;
            }
        },
        
        // --- VOICE RECOGNITION ---
        
        /**
         * Start listening for voice input
         */
        startListening: function(language) {
            const lang = language || Utils.getCurrentLanguage();
            
            // Map language codes to Android locale codes
            const localeMap = {
                'en': 'en-US',
                'am': 'am-ET',
                'om': 'om-ET'
            };
            
            const locale = localeMap[lang] || 'en-US';
            
            // Try native bridge first
            const nativeResult = bridge.callNative('startSpeechRecognition', locale);
            
            if (nativeResult === null) {
                // Fallback: Use Web Speech API
                bridge.webSpeechRecognition(locale);
            }
            
            return true;
        },
        
        /**
         * Stop listening
         */
        stopListening: function() {
            bridge.callNative('stopSpeechRecognition');
            
            // Stop Web Speech API if active
            if (bridge._webRecognition) {
                bridge._webRecognition.stop();
            }
        },
        
        /**
         * Web Speech API fallback
         */
        webSpeechRecognition: function(locale) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            if (!SpeechRecognition) {
                console.warn('Speech recognition not available');
                if (typeof App !== 'undefined' && App.onVoiceError) {
                    App.onVoiceError('Speech recognition not supported');
                }
                return;
            }
            
            const recognition = new SpeechRecognition();
            recognition.lang = locale;
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;
            
            recognition.onstart = function() {
                console.log('Web speech started');
                if (typeof App !== 'undefined' && App.onVoiceStart) {
                    App.onVoiceStart();
                }
            };
            
            recognition.onresult = function(event) {
                let interim = '';
                let final = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcript;
                    } else {
                        interim += transcript;
                    }
                }
                
                // Show interim results
                if (interim && typeof App !== 'undefined' && App.onVoiceInterim) {
                    App.onVoiceInterim(interim);
                }
                
                // Process final result
                if (final && typeof App !== 'undefined' && App.onVoiceResult) {
                    App.onVoiceResult(final);
                }
            };
            
            recognition.onerror = function(event) {
                console.error('Speech error:', event.error);
                if (typeof App !== 'undefined' && App.onVoiceError) {
                    App.onVoiceError(event.error);
                }
            };
            
            recognition.onend = function() {
                console.log('Web speech ended');
                if (typeof App !== 'undefined' && App.onVoiceEnd) {
                    App.onVoiceEnd();
                }
            };
            
            bridge._webRecognition = recognition;
            recognition.start();
        },
        
        // --- TEXT TO SPEECH ---
        
        /**
         * Speak text using TTS
         */
        speak: function(text, language) {
            const lang = language || Utils.getCurrentLanguage();
            
            // Map language to TTS locale
            const localeMap = {
                'en': 'en-US',
                'am': 'am-ET',
                'om': 'om-ET'
            };
            
            const locale = localeMap[lang] || 'en-US';
            
            // Try native TTS first
            const nativeResult = bridge.callNative('speakText', text, locale);
            
            if (nativeResult === null) {
                // Fallback: Web Speech Synthesis
                bridge.webSpeechSynthesis(text, locale);
            }
        },
        
        /**
         * Stop speaking
         */
        stopSpeaking: function() {
            bridge.callNative('stopSpeaking');
            
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        },
        
        /**
         * Web Speech Synthesis fallback
         */
        webSpeechSynthesis: function(text, locale) {
            if (!window.speechSynthesis) {
                console.warn('TTS not available');
                return;
            }
            
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = locale;
            utterance.rate = 0.9;  // Slightly slower for clarity
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // Try to find best voice for locale
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const matchingVoice = voices.find(v => v.lang.startsWith(locale.split('-')[0]));
                if (matchingVoice) {
                    utterance.voice = matchingVoice;
                }
            }
            
            utterance.onstart = function() {
                console.log('TTS started');
            };
            
            utterance.onend = function() {
                console.log('TTS ended');
            };
            
            utterance.onerror = function(event) {
                console.error('TTS error:', event.error);
            };
            
            window.speechSynthesis.speak(utterance);
        },
        
        // --- EMERGENCY SOS ---
        
        /**
         * Trigger emergency call (Ethiopian emergency: 907)
         */
        emergencyCall: function() {
            // Try native first
            const nativeResult = bridge.callNative('callEmergency');
            
            if (nativeResult === null) {
                // Fallback: Open phone dialer
                window.location.href = 'tel:907';
            }
        },
        
        /**
         * Share location with emergency contacts
         */
        shareEmergencyLocation: function(locationData) {
            bridge.callNative('shareEmergencyLocation', JSON.stringify(locationData));
            
            // Also create SMS intent if possible
            if (locationData && locationData.latitude) {
                const mapsUrl = `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`;
                const message = `🚨 EMERGENCY - I need help! My location: ${mapsUrl}`;
                window.location.href = `sms:?body=${encodeURIComponent(message)}`;
            }
        },
        
        // --- DEVICE INFO ---
        
        /**
         * Get device information
         */
        getDeviceInfo: function() {
            const nativeInfo = bridge.callNative('getDeviceInfo');
            
            if (nativeInfo) {
                try {
                    return JSON.parse(nativeInfo);
                } catch (e) {
                    return nativeInfo;
                }
            }
            
            // Fallback: Get from browser
            return {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                pixelRatio: window.devicePixelRatio,
                online: navigator.onLine,
                memory: navigator.deviceMemory || 'unknown',
                cores: navigator.hardwareConcurrency || 'unknown'
            };
        },
        
        /**
         * Get current GPS location
         */
        getCurrentLocation: function() {
            return new Promise((resolve, reject) => {
                // Try native GPS first
                const nativeLocation = bridge.callNative('getLocation');
                if (nativeLocation) {
                    try {
                        resolve(JSON.parse(nativeLocation));
                        return;
                    } catch (e) {}
                }
                
                // Fallback: Browser Geolocation API
                if (!navigator.geolocation) {
                    reject(new Error('Geolocation not supported'));
                    return;
                }
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            altitude: position.coords.altitude,
                            timestamp: position.timestamp
                        });
                    },
                    (error) => {
                        reject(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000
                    }
                );
            });
        },
        
        // --- NOTIFICATIONS ---
        
        /**
         * Show native notification
         */
        showNotification: function(title, message, tag = 'ethiohealth') {
            // Try native first
            bridge.callNative('showNotification', title, message, tag);
            
            // Fallback: Web Notifications API
            if ('Notification' in window && Notification.permission === 'granted') {
                try {
                    new Notification(title, {
                        body: message,
                        tag: tag,
                        icon: '/images/icon-192.png',
                        badge: '/images/icon-72.png'
                    });
                } catch (e) {
                    console.warn('Notification failed:', e);
                }
            }
        },
        
        /**
         * Request notification permission
         */
        requestNotificationPermission: function() {
            return new Promise((resolve) => {
                // Try native
                bridge.callNative('requestNotificationPermission');
                
                // Web API
                if (!('Notification' in window)) {
                    resolve('denied');
                    return;
                }
                
                Notification.requestPermission().then(resolve);
            });
        },
        
        // --- STORAGE ---
        
        /**
         * Save preference (synced to native if available)
         */
        savePreference: function(key, value) {
            localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
            bridge.callNative('savePreference', key, value);
        },
        
        /**
         * Get preference
         */
        getPreference: function(key, defaultValue = null) {
            const local = localStorage.getItem(key);
            if (local !== null) {
                try { return JSON.parse(local); } catch (e) {}
                return local;
            }
            
            const native = bridge.callNative('getPreference', key);
            return native !== null ? native : defaultValue;
        },
        
        // --- HEALTH CONNECT ---
        
        /**
         * Sync with Google Fit / Health Connect
         */
        syncHealthData: function(data) {
            bridge.callNative('syncHealthData', JSON.stringify(data));
        },
        
        /**
         * Get step count from sensors
         */
        getStepCount: function() {
            const nativeSteps = bridge.callNative('getStepCount');
            if (nativeSteps) {
                try {
                    return JSON.parse(nativeSteps).steps || 0;
                } catch (e) {}
            }
            return 0;
        },
        
        // --- APP LIFECYCLE ---
        
        /**
         * Bring app to foreground
         */
        bringToForeground: function() {
            bridge.callNative('bringToForeground');
        },
        
        /**
         * Minimize app
         */
        minimizeApp: function() {
            bridge.callNative('minimizeApp');
        },
        
        /**
         * Exit app
         */
        exitApp: function() {
            bridge.callNative('exitApp');
        },
        
        // --- MISC ---
        
        /**
         * Open URL in external browser
         */
        openExternalUrl: function(url) {
            bridge.callNative('openUrl', url);
            
            // Fallback
            window.open(url, '_blank');
        },
        
        /**
         * Open app settings
         */
        openAppSettings: function() {
            bridge.callNative('openSettings');
        },
        
        /**
         * Check if battery optimization is disabled
         */
        isBatteryOptimized: function() {
            return bridge.callNative('isBatteryOptimized') === 'true';
        },
        
        /**
         * Request battery optimization exemption
         */
        requestBatteryExemption: function() {
            bridge.callNative('requestBatteryExemption');
        },
        
        /**
         * Get app version
         */
        getAppVersion: function() {
            return bridge.callNative('getAppVersion') || '2.0.0';
        },
        
        /**
         * Log to native console
         */
        nativeLog: function(level, message) {
            bridge.callNative('log', level, message);
        }
    };
    
    // --- CALLBACKS FROM ANDROID ---
    
    // These functions are called by Android WebView
    window.onVoiceResult = function(text) {
        console.log('Voice result from Android:', text);
        if (typeof App !== 'undefined' && App.onVoiceResult) {
            App.onVoiceResult(text);
        }
    };
    
    window.onVoiceError = function(error) {
        console.error('Voice error from Android:', error);
        if (typeof App !== 'undefined' && App.onVoiceError) {
            App.onVoiceError(error);
        }
    };
    
    window.onVoiceStart = function() {
        console.log('Voice started from Android');
        if (typeof App !== 'undefined' && App.onVoiceStart) {
            App.onVoiceStart();
        }
    };
    
    window.onVoiceEnd = function() {
        console.log('Voice ended from Android');
        if (typeof App !== 'undefined' && App.onVoiceEnd) {
            App.onVoiceEnd();
        }
    };
    
    window.onLocationUpdate = function(locationJson) {
        try {
            const location = JSON.parse(locationJson);
            if (typeof App !== 'undefined' && App.onLocationUpdate) {
                App.onLocationUpdate(location);
            }
        } catch (e) {
            console.error('Error parsing location:', e);
        }
    };
    
    window.onAppResume = function() {
        console.log('App resumed');
        if (typeof App !== 'undefined' && App.onResume) {
            App.onResume();
        }
    };
    
    window.onAppPause = function() {
        console.log('App paused');
        if (typeof App !== 'undefined' && App.onPause) {
            App.onPause();
        }
    };
    
    window.onNotificationClick = function(tag) {
        console.log('Notification clicked:', tag);
        if (typeof App !== 'undefined' && App.onNotificationClick) {
            App.onNotificationClick(tag);
        }
    };
    
    // Initialize voices for TTS
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = function() {
            window.speechSynthesis.getVoices();
        };
    }
    
    console.log('✅ Bridge initialized');
    return bridge;
})();