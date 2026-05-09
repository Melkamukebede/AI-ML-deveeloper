// ============================================
// ETHIOHEALTH AI PRO - VOICE ASSISTANT
// ============================================

const VoiceAssistant = (function() {
    'use strict';
    
    const assistant = {
        // State
        isListening: false,
        isProcessing: false,
        transcript: '',
        response: '',
        voiceHistory: [],
        
        // Configuration
        config: {
            autoSpeak: true,
            language: 'en',
            continuousMode: false
        },
        
        /**
         * Initialize voice assistant
         */
        init: function() {
            assistant.config.language = I18n.getCurrentLanguage();
            assistant.setupEventListeners();
            assistant.loadHistory();
        },
        
        /**
         * Setup event listeners
         */
        setupEventListeners: function() {
            // Main mic button in tab
            const voiceBtn = document.getElementById('voiceListenBtn');
            if (voiceBtn) {
                voiceBtn.addEventListener('click', function() {
                    assistant.toggleListening();
                });
            }
            
            // Floating mic button
            const micFab = document.getElementById('micBtn');
            if (micFab) {
                micFab.addEventListener('click', function() {
                    assistant.toggleListening();
                });
            }
            
            // Keyboard shortcut (Space bar when in voice tab)
            document.addEventListener('keydown', function(e) {
                if (e.code === 'Space' && document.getElementById('tab-voice')?.classList.contains('active')) {
                    e.preventDefault();
                    assistant.toggleListening();
                }
            });
        },
        
        /**
         * Toggle listening state
         */
        toggleListening: function() {
            if (assistant.isListening) {
                assistant.stopListening();
            } else {
                assistant.startListening();
            }
        },
        
        /**
         * Start listening for voice input
         */
        startListening: function() {
            if (assistant.isListening) return;
            
            assistant.isListening = true;
            assistant.isProcessing = false;
            assistant.transcript = '';
            assistant.response = '';
            
            // Update UI
            assistant.updateUI('listening');
            
            // Vibrate feedback
            Utils.vibrate(50);
            
            // Start native or web speech recognition
            const lang = assistant.config.language;
            const localeMap = { en: 'en-US', am: 'am-ET', om: 'om-ET' };
            const locale = localeMap[lang] || 'en-US';
            
            if (window.Bridge && Bridge.startListening) {
                Bridge.startListening(lang);
            } else {
                assistant.webSpeechRecognition(locale);
            }
            
            // Auto-stop after silence (10 seconds)
            assistant.silenceTimer = setTimeout(function() {
                if (assistant.isListening) {
                    assistant.stopListening();
                }
            }, 10000);
        },
        
        /**
         * Stop listening
         */
        stopListening: function() {
            if (!assistant.isListening) return;
            
            assistant.isListening = false;
            
            // Clear silence timer
            if (assistant.silenceTimer) {
                clearTimeout(assistant.silenceTimer);
                assistant.silenceTimer = null;
            }
            
            // Stop recognition
            if (window.Bridge && Bridge.stopListening) {
                Bridge.stopListening();
            }
            
            if (assistant.webRecognition) {
                assistant.webRecognition.stop();
            }
            
            Utils.vibrate(50);
            
            // Process if we have transcript
            if (assistant.transcript.trim()) {
                assistant.processCommand(assistant.transcript);
            } else {
                assistant.updateUI('idle');
            }
        },
        
        /**
         * Web Speech API recognition
         */
        webSpeechRecognition: function(locale) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            if (!SpeechRecognition) {
                assistant.handleError('Speech recognition not supported in this browser');
                return;
            }
            
            const recognition = new SpeechRecognition();
            recognition.lang = locale;
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;
            
            recognition.onstart = function() {
                console.log('🎤 Web speech started');
            };
            
            recognition.onresult = function(event) {
                let interim = '';
                let final = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcript + ' ';
                    } else {
                        interim += transcript;
                    }
                }
                
                if (final) {
                    assistant.transcript = final.trim();
                    document.getElementById('voiceTranscript').innerHTML = 
                        `<p>${assistant.transcript}</p>`;
                }
                
                if (interim) {
                    document.getElementById('voiceTranscript').innerHTML = 
                        `<p><em>${interim}</em></p>`;
                }
                
                // Auto-stop after getting final result
                if (final && !assistant.config.continuousMode) {
                    setTimeout(function() {
                        assistant.stopListening();
                    }, 500);
                }
            };
            
            recognition.onerror = function(event) {
                console.error('Speech error:', event.error);
                
                if (event.error === 'no-speech') {
                    // No speech detected, keep listening
                    return;
                }
                
                assistant.handleError(event.error);
            };
            
            recognition.onend = function() {
                console.log('🎤 Web speech ended');
                if (assistant.isListening && assistant.config.continuousMode) {
                    recognition.start();
                }
            };
            
            assistant.webRecognition = recognition;
            recognition.start();
        },
        
        /**
         * Handle voice recognition error
         */
        handleError: function(error) {
            assistant.isListening = false;
            assistant.updateUI('error');
            
            let message = 'Voice recognition error';
            switch (error) {
                case 'not-allowed':
                    message = I18n.t('mic_permission_denied') || 'Microphone permission denied';
                    break;
                case 'network':
                    message = I18n.t('network_error') || 'Network error. Check connection.';
                    break;
                case 'no-speech':
                    message = I18n.t('no_speech') || 'No speech detected. Please try again.';
                    break;
                default:
                    message = error;
            }
            
            Utils.showToast(message, 'error');
            
            setTimeout(function() {
                assistant.updateUI('idle');
            }, 2000);
        },
        
        /**
         * Process voice command
         */
        processCommand: function(text) {
            assistant.isProcessing = true;
            assistant.updateUI('processing');
            
            const lower = text.toLowerCase();
            let response = '';
            let action = null;
            
            // ====================
            // COMMAND PATTERNS
            // ====================
            
            // Blood Pressure Commands
            if (lower.includes('blood pressure') || lower.includes('dhiibbaa') || 
                lower.includes('ግፊት') || lower.includes('check my bp')) {
                action = 'navigate';
                response = I18n.t('opening_bp_check') || 'Opening blood pressure check. Please enter your readings.';
                setTimeout(function() {
                    App.switchTab('home');
                    document.getElementById('inputSystolic')?.focus();
                }, 1500);
            }
            
            // Symptom Checker Commands
            else if (lower.includes('symptom') || lower.includes('mallattoo') || 
                     lower.includes('ምልክት') || lower.includes('not feeling well') ||
                     lower.includes('sick') || lower.includes('pain')) {
                action = 'navigate';
                response = I18n.t('opening_symptoms') || 'Opening symptom checker. You can select your symptoms on the body map.';
                setTimeout(function() {
                    App.switchTab('symptoms');
                }, 1500);
            }
            
            // Traditional Medicine Commands
            else if (lower.includes('herb') || lower.includes('traditional') || 
                     lower.includes('natural') || lower.includes('aadaa') ||
                     lower.includes('ባህላዊ') || lower.includes('እፅ')) {
                action = 'navigate';
                response = I18n.t('opening_traditional') || 'Opening Ethiopian traditional medicine database.';
                setTimeout(function() {
                    App.switchTab('traditional');
                }, 1500);
            }
            
            // Emergency Commands
            else if (lower.includes('emergency') || lower.includes('help me') || 
                     lower.includes('tasgabbii') || lower.includes('አደጋ') ||
                     lower.includes('እርዳታ') || lower.includes('urgent')) {
                action = 'emergency';
                response = I18n.t('emergency_confirm') || 'Do you want me to call emergency services? Say "yes" to confirm.';
                assistant.pendingEmergency = true;
            }
            
            // Emergency confirmation
            else if ((lower.includes('yes') || lower.includes('eyyee') || lower.includes('አዎ')) && 
                     assistant.pendingEmergency) {
                assistant.pendingEmergency = false;
                response = I18n.t('calling_emergency') || 'Calling Ethiopian emergency services (907) now.';
                setTimeout(function() {
                    if (window.Bridge && Bridge.emergencyCall) {
                        Bridge.emergencyCall();
                    } else {
                        window.location.href = 'tel:907';
                    }
                }, 1000);
            }
            
            // Cancel pending emergency
            else if ((lower.includes('no') || lower.includes('cancel') || lower.includes('lakki') || 
                      lower.includes('አይ') || lower.includes('ሰርዝ')) && assistant.pendingEmergency) {
                assistant.pendingEmergency = false;
                response = I18n.t('emergency_cancelled') || 'Emergency call cancelled.';
            }
            
            // Health Advice Commands
            else if (lower.includes('advice') || lower.includes('tip') || 
                     lower.includes('gorsa') || lower.includes('ምክር')) {
                response = Agent.getAdvice(text);
            }
            
            // Analysis Commands
            else if (lower.includes('analyze') || lower.includes('check') || 
                     lower.includes('xiinxali') || lower.includes('መርምር')) {
                action = 'analyze';
                response = I18n.t('running_analysis') || 'Running health analysis with your latest data...';
                setTimeout(function() {
                    App.runAnalysis();
                }, 1000);
            }
            
            // Settings Commands
            else if (lower.includes('setting') || lower.includes('language') || 
                     lower.includes('sajoo') || lower.includes('ቅንብር') ||
                     lower.includes('ቋንቋ')) {
                action = 'navigate';
                response = I18n.t('opening_settings') || 'Opening settings. You can change language and preferences here.';
                setTimeout(function() {
                    App.switchTab('settings');
                }, 1500);
            }
            
            // Greeting Commands
            else if (lower.includes('hello') || lower.includes('hi') || 
                     lower.includes('akkam') || lower.includes('ሰላም') ||
                     lower.includes('selam') || lower.includes('nagaa')) {
                const greetings = {
                    en: 'Hello! I am your EthioHealth AI assistant. I can help you check your health, analyze symptoms, or provide medical advice. What would you like to do?',
                    am: 'ሰላም! እኔ የኢትዮሄልዝ AI ረዳት ነኝ። ጤናዎን ለመመርመር፣ ምልክቶችን ለመተንተን ወይም የህክምና ምክር ለመስጠት እችላለሁ። ምን ማድረግ ይፈልጋሉ?',
                    om: 'Akkam! Ani gargaaraa EthioHealth AI ti. Fayyaa kee ilaaluu, mallattoolee xiinxaluu, ykn gorsa fayyaa kennuu nan danda\'a. Maal gochuu barbaadda?'
                };
                response = greetings[I18n.getCurrentLanguage()] || greetings.en;
            }
            
            // Help Commands
            else if (lower.includes('help') || lower.includes('what can you do') || 
                     lower.includes('gargaarsa') || lower.includes('እርዳታ') ||
                     lower.includes('ምን ታደርጋለህ')) {
                const helpMessages = {
                    en: 'I can help you with: 1. Check blood pressure and vitals, 2. Analyze symptoms using body map, 3. Find traditional Ethiopian medicines, 4. Emergency assistance, 5. Health advice. Just say what you need!',
                    am: 'እንዲህ ልረዳዎ እችላለሁ: 1. የደም ግፊት እና የጤና ምርመራ, 2. ምልክቶችን መተንተን, 3. ባህላዊ መድሃኒቶችን ማግኘት, 4. የአደጋ ጊዜ እርዳታ, 5. የጤና ምክር። የሚፈልጉትን ብቻ ይናገሩ!',
                    om: 'Waanan si gargaaruu danda\'u: 1. Dhiibbaa dhiigaa ilaaluu, 2. Mallattoolee xiinxaluu, 3. Qoricha aadaa Itoophiyaa barbaaduu, 4. Tasgabbii, 5. Gorsa fayyaa. Waan barbaaddu dubbadhu!'
                };
                response = helpMessages[I18n.getCurrentLanguage()] || helpMessages.en;
            }
            
            // Unknown Command
            else {
                const unknownMessages = {
                    en: 'I didn\'t understand that. You can say: "check blood pressure", "I have symptoms", "traditional medicine", "emergency", or "help" for more options.',
                    am: 'ያልክትን አልገባኝም። እንዲህ ማለት ይችላሉ: "የደም ግፊት አረጋግጥ", "ምልክቶች አሉኝ", "ባህላዊ መድሃኒት", "አደጋ", ወይም "እርዳታ"።',
                    om: 'Waan ati jette hin hubanne. Dubbachuu dandeessa: "dhiibbaa dhiigaa ilaali", "mallattoolee qaba", "qoricha aadaa", "tasgabbii", ykn "gargaarsa".'
                };
                response = unknownMessages[I18n.getCurrentLanguage()] || unknownMessages.en;
            }
            
            // Update response
            assistant.response = response;
            assistant.updateUI('response');
            
            // Speak response
            if (assistant.config.autoSpeak) {
                assistant.speakResponse(response);
            }
            
            // Save to history
            assistant.saveToHistory(text, response);
            
            assistant.isProcessing = false;
        },
        
        /**
         * Speak response using TTS
         */
        speakResponse: function(text) {
            const lang = assistant.config.language;
            
            if (window.Bridge && Bridge.speak) {
                Bridge.speak(text, lang);
            } else if ('speechSynthesis' in window) {
                // Cancel any ongoing speech
                window.speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang === 'am' ? 'am-ET' : lang === 'om' ? 'om-ET' : 'en-US';
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                
                // Try to find best voice
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
                    if (matchingVoice) {
                        utterance.voice = matchingVoice;
                    }
                }
                
                window.speechSynthesis.speak(utterance);
            }
        },
        
        /**
         * Update UI based on state
         */
        updateUI: function(state) {
            const voiceRing = document.getElementById('voiceRing');
            const voiceStatus = document.getElementById('voiceStatus');
            const voiceTranscript = document.getElementById('voiceTranscript');
            const voiceResponse = document.getElementById('voiceResponse');
            const voiceResponseText = document.getElementById('voiceResponseText');
            const listenBtn = document.getElementById('voiceListenBtn');
            const micFab = document.getElementById('micBtn');
            
            switch (state) {
                case 'listening':
                    if (voiceRing) voiceRing.classList.add('active');
                    if (voiceStatus) voiceStatus.innerHTML = '<span class="status-dot" style="background:#ef4444;"></span> ' + (I18n.t('listening') || 'Listening...');
                    if (voiceTranscript) voiceTranscript.innerHTML = '<p class="placeholder-text">' + (I18n.t('listening') || 'Listening...') + '</p>';
                    if (voiceResponse) voiceResponse.style.display = 'none';
                    if (listenBtn) {
                        listenBtn.innerHTML = '<span>🔴</span><span>' + (I18n.t('stop_listening') || 'Stop Listening') + '</span>';
                        listenBtn.classList.add('btn-danger');
                    }
                    if (micFab) micFab.classList.add('listening');
                    break;
                    
                case 'processing':
                    if (voiceRing) voiceRing.classList.remove('active');
                    if (voiceStatus) voiceStatus.innerHTML = '<span class="status-dot" style="background:#f59e0b;"></span> ' + (I18n.t('processing') || 'Processing...');
                    if (listenBtn) {
                        listenBtn.innerHTML = '<span>⏳</span><span>' + (I18n.t('processing') || 'Processing...') + '</span>';
                        listenBtn.disabled = true;
                    }
                    break;
                    
                case 'response':
                    if (voiceRing) voiceRing.classList.remove('active');
                    if (voiceStatus) voiceStatus.innerHTML = '<span class="status-dot" style="background:#10b981;"></span> ' + (I18n.t('ready') || 'Ready');
                    if (voiceResponse) {
                        voiceResponse.style.display = 'block';
                        if (voiceResponseText) voiceResponseText.textContent = assistant.response;
                    }
                    if (listenBtn) {
                        listenBtn.innerHTML = '<span>🎤</span><span>' + (I18n.t('start_listening') || 'Start Listening') + '</span>';
                        listenBtn.classList.remove('btn-danger');
                        listenBtn.disabled = false;
                    }
                    if (micFab) micFab.classList.remove('listening');
                    break;
                    
                case 'error':
                    if (voiceRing) voiceRing.classList.remove('active');
                    if (voiceStatus) voiceStatus.innerHTML = '<span class="status-dot" style="background:#ef4444;"></span> ' + (I18n.t('error') || 'Error');
                    if (listenBtn) {
                        listenBtn.innerHTML = '<span>🎤</span><span>' + (I18n.t('try_again') || 'Try Again') + '</span>';
                        listenBtn.classList.remove('btn-danger');
                        listenBtn.disabled = false;
                    }
                    if (micFab) micFab.classList.remove('listening');
                    break;
                    
                case 'idle':
                default:
                    if (voiceRing) voiceRing.classList.remove('active');
                    if (voiceStatus) voiceStatus.innerHTML = '<span class="status-dot"></span> ' + (I18n.t('ready') || 'Ready');
                    if (listenBtn) {
                        listenBtn.innerHTML = '<span>🎤</span><span>' + (I18n.t('start_listening') || 'Start Listening') + '</span>';
                        listenBtn.classList.remove('btn-danger');
                        listenBtn.disabled = false;
                    }
                    if (micFab) micFab.classList.remove('listening');
                    break;
            }
        },
        
        /**
         * Save voice command to history
         */
        saveToHistory: function(command, response) {
            const entry = {
                timestamp: Date.now(),
                command: command,
                response: response,
                language: assistant.config.language
            };
            
            assistant.voiceHistory.unshift(entry);
            
            // Keep only last 50 entries
            if (assistant.voiceHistory.length > 50) {
                assistant.voiceHistory = assistant.voiceHistory.slice(0, 50);
            }
            
            // Save to DB
            if (typeof DB !== 'undefined' && DB.saveVoiceCommand) {
                DB.saveVoiceCommand(command, response, assistant.config.language);
            }
            
            // Update history UI
            assistant.renderHistory();
        },
        
        /**
         * Load voice history from DB
         */
        loadHistory: async function() {
            if (typeof DB !== 'undefined' && DB.getVoiceHistory) {
                const history = await DB.getVoiceHistory(20);
                assistant.voiceHistory = history.map(h => ({
                    timestamp: h.timestamp,
                    command: h.command,
                    response: h.response,
                    language: h.language
                }));
                assistant.renderHistory();
            }
        },
        
        /**
         * Render voice history in UI
         */
        renderHistory: function() {
            const container = document.getElementById('voiceHistory');
            if (!container) return;
            
            if (assistant.voiceHistory.length === 0) {
                container.innerHTML = '<p class="placeholder-text">' + (I18n.t('no_history') || 'No voice commands yet') + '</p>';
                return;
            }
            
            container.innerHTML = assistant.voiceHistory.slice(0, 10).map(entry => `
                <div class="voice-history-entry" style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
                    <div style="font-size:12px;color:#9ca3af;">${Utils.formatDate(entry.timestamp, 'relative')}</div>
                    <div style="font-weight:600;font-size:13px;">🗣️ "${entry.command}"</div>
                    <div style="font-size:12px;color:#6b7280;">🤖 ${Utils.truncate(entry.response, 80)}</div>
                </div>
            `).join('');
        },
        
        /**
         * Set language for voice recognition
         */
        setLanguage: function(lang) {
            assistant.config.language = lang;
        },
        
        /**
         * Toggle continuous mode
         */
        toggleContinuousMode: function() {
            assistant.config.continuousMode = !assistant.config.continuousMode;
            return assistant.config.continuousMode;
        },
        
        /**
         * Toggle auto-speak responses
         */
        toggleAutoSpeak: function() {
            assistant.config.autoSpeak = !assistant.config.autoSpeak;
            return assistant.config.autoSpeak;
        },
        
        /**
         * Clean up resources
         */
        destroy: function() {
            if (assistant.isListening) {
                assistant.stopListening();
            }
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        }
    };
    
    console.log('✅ Voice Assistant initialized');
    return assistant;
})();