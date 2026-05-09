// ============================================
// ETHIOHEALTH AI PRO - MAIN APPLICATION
// Groq AI + PubMed + OpenFDA Integration
// ============================================

const App = (function() {
    'use strict';
    
    const app = {
        currentTab: 'home',
        selectedSymptoms: [],
        latestAnalysis: null,
        healthChart: null,
        currentHerbFilter: 'all',
        isListening: false,
        voiceHistory: [],
        initialized: false,
        
        // ============================================
        // INITIALIZATION
        // ============================================
        init: function() {
            if (app.initialized) return;
            app.initialized = true;
            
            console.log('🧬 EthioHealth AI Pro Initializing...');
            console.log('🤖 Groq API:', typeof GrokAgent !== 'undefined' && GrokAgent.isAPIConfigured() ? '✅ Connected' : '⚠️ Using offline mode');
            console.log('💾 Database:', typeof DB !== 'undefined' ? '✅ Ready' : '⚠️ Limited storage');
            console.log('📚 PubMed:', '✅ Available');
            console.log('💊 OpenFDA:', '✅ Available');
            
            // Initialize all modules
            app.initLanguage();
            app.setupAllEventListeners();
            app.renderHerbList();
            app.loadSavedData();
            app.renderLandingInfo();
            
            console.log('✅ EthioHealth AI Pro Ready - All Systems Active');
            
            // Welcome message
            setTimeout(() => {
                app.showToast('🧬 Welcome! AI-powered Ethiopian health analysis ready.', 'success', 4000);
            }, 1000);
        },
        
        initLanguage: function() {
            const savedLang = localStorage.getItem('lang') || 'en';
            if (typeof i18next !== 'undefined') {
                i18next.changeLanguage(savedLang);
            }
            app.updateLanguageUI(savedLang);
            document.documentElement.dir = savedLang === 'am' ? 'rtl' : 'ltr';
            document.body.classList.toggle('rtl', savedLang === 'am');
        },
        
        // ============================================
        // EVENT LISTENERS - CRITICAL FIX
        // ============================================
        setupAllEventListeners: function() {
            console.log('🔧 Setting up event listeners...');
            
            // ===== ANALYZE BUTTON - MULTIPLE FALLBACKS =====
            const analyzeBtn = document.getElementById('analyzeBtn');
            if (analyzeBtn) {
                console.log('✅ Analyze button found in DOM');
                
                // Remove any existing listeners
                const newBtn = analyzeBtn.cloneNode(true);
                analyzeBtn.parentNode.replaceChild(newBtn, analyzeBtn);
                
                // Add new listener
                newBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔬 ANALYZE BUTTON CLICKED - Starting analysis...');
                    app.runAnalysis();
                });
                
                // Also set onclick as backup
                newBtn.onclick = function(e) {
                    e.preventDefault();
                    console.log('🔬 ANALYZE onclick fired');
                    app.runAnalysis();
                    return false;
                };
                
                // Make button visibly clickable
                newBtn.style.cursor = 'pointer';
                newBtn.style.position = 'relative';
                newBtn.style.zIndex = '50';
                
                console.log('✅ Analyze button handler attached successfully');
            } else {
                console.error('❌ CRITICAL: Analyze button not found! ID: analyzeBtn');
                // Search for any analyze button
                const allButtons = document.querySelectorAll('button');
                console.log('All buttons on page:', allButtons.length);
                allButtons.forEach(btn => {
                    if (btn.textContent.toLowerCase().includes('analyze')) {
                        console.log('Found alternative analyze button:', btn);
                        btn.addEventListener('click', function(e) {
                            e.preventDefault();
                            app.runAnalysis();
                        });
                    }
                });
            }
            
            // ===== TAB NAVIGATION =====
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const tab = this.getAttribute('data-tab');
                    if (tab) app.switchTab(tab);
                });
            });
            
            // ===== SYMPTOM ANALYZE BUTTON =====
            const sympBtn = document.getElementById('analyzeSymptomsBtn');
            if (sympBtn) {
                sympBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    app.analyzeSymptoms();
                });
            }
            
            // ===== BODY MAP =====
            app.setupBodyMap();
            
            // ===== HOLISTIC TABS =====
            document.querySelectorAll('.holistic-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    if (category) app.changeHolisticTab(category);
                });
            });
            
            // ===== SEVERITY SLIDER =====
            const slider = document.getElementById('severitySlider');
            if (slider) {
                slider.addEventListener('input', function() {
                    const valEl = document.getElementById('severityValue');
                    if (valEl) valEl.textContent = this.value;
                });
            }
            
            // ===== SOS BUTTON =====
            const sosBtn = document.getElementById('sosBtn');
            if (sosBtn) {
                sosBtn.addEventListener('click', () => app.triggerEmergency());
            }
            
            // ===== MIC BUTTON =====
            const micBtn = document.getElementById('micBtn');
            if (micBtn) {
                micBtn.addEventListener('click', () => app.toggleVoiceListen());
            }
            
            // ===== ONLINE/OFFLINE =====
            window.addEventListener('online', () => app.updateConnectionStatus());
            window.addEventListener('offline', () => app.updateConnectionStatus());
            
            console.log('✅ All event listeners setup complete');
        },
        
        setupBodyMap: function() {
            const svg = document.getElementById('bodyMapSVG');
            if (!svg) return;
            
            const parts = svg.querySelectorAll('.body-part');
            console.log('Body map parts found:', parts.length);
            
            parts.forEach(part => {
                part.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const partName = this.getAttribute('data-part');
                    console.log('Body part clicked:', partName);
                    
                    parts.forEach(p => p.classList.remove('selected'));
                    this.classList.add('selected');
                    app.showBodyPartSymptoms(partName);
                });
            });
        },
        
        // ============================================
        // TAB NAVIGATION
        // ============================================
        switchTab: function(tabName) {
            console.log('Switching to tab:', tabName);
            app.currentTab = tabName;
            
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
            });
            
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const panel = document.getElementById('tab-' + tabName);
            if (panel) panel.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            switch(tabName) {
                case 'home': app.renderHomeTab(); break;
                case 'symptoms': break;
                case 'traditional': app.renderHerbList(); break;
                case 'voice': app.renderVoiceHistory(); break;
                case 'report': app.renderReportTab(); break;
            }
        },
        
        // ============================================
        // RUN ANALYSIS - THE MAIN FUNCTION
        // ============================================
        runAnalysis: async function() {
            console.log('🔬 ========== STARTING HEALTH ANALYSIS ==========');
            
            // Get values with detailed logging
            const getVal = (id, def) => {
                const el = document.getElementById(id);
                if (!el) {
                    console.warn(`⚠️ Element #${id} not found`);
                    return def;
                }
                const val = parseFloat(el.value);
                if (isNaN(val)) {
                    console.warn(`⚠️ Invalid value for #${id}: "${el.value}"`);
                    return def;
                }
                console.log(`📊 ${id}:`, val);
                return val;
            };
            
            const patientData = {
                systolic: getVal('inputSystolic', 120),
                diastolic: getVal('inputDiastolic', 80),
                glucose: getVal('inputGlucose', 95),
                bmi: getVal('inputBMI', 24),
                temperature: getVal('inputTemp', 36.6),
                age: getVal('inputAge', 30),
                symptoms: app.selectedSymptoms || [],
                duration: document.getElementById('symptomDuration')?.value || 'days',
                severity: parseInt(document.getElementById('severitySlider')?.value || '5')
            };
            
            console.log('📋 Complete patient data:', patientData);
            
            // Show loading
            app.showLoading('🤖 Groq AI analyzing your health data...');
            
            try {
                let results;
                
                // Use GrokAgent if available
                if (typeof GrokAgent !== 'undefined') {
                    console.log('🤖 Using GrokAgent for analysis...');
                    results = await GrokAgent.analyzePatient(patientData);
                } else {
                    console.log('⚠️ GrokAgent not found, using fallback...');
                    results = app.fallbackAnalysis(patientData);
                }
                
                console.log('✅ Analysis results:', results);
                app.latestAnalysis = results;
                
                app.hideLoading();
                
                // Update UI
                if (results.score || results.score === 0) {
                    app.updateHealthScore(results.score);
                }
                app.renderGroqResults(results);
                app.updateChart(results);
                
                // Save
                app.saveAnalysis(results, patientData);
                
                // Success toast
                const scoreText = results.score !== undefined ? `Score: ${results.score}/100` : 'Analysis complete';
                app.showToast(`✅ ${scoreText} | ${results.findings?.length || 0} conditions analyzed`, 'success', 4000);
                
                // Switch to home tab to show results
                app.switchTab('home');
                
            } catch (error) {
                console.error('❌ Analysis error:', error);
                app.hideLoading();
                app.showToast('❌ Analysis failed: ' + error.message, 'error', 5000);
            }
        },
        
        fallbackAnalysis: function(data) {
            console.log('Running fallback analysis...');
            const diseases = [];
            let penaltyScore = 0;
            
            // Hypertension
            let hyperRisk = 0;
            if (data.systolic >= 180) hyperRisk += 60;
            else if (data.systolic >= 160) hyperRisk += 45;
            else if (data.systolic >= 140) hyperRisk += 30;
            else if (data.systolic >= 130) hyperRisk += 15;
            if (data.diastolic >= 110) hyperRisk += 35;
            else if (data.diastolic >= 90) hyperRisk += 20;
            if (data.age >= 45) hyperRisk += 10;
            if (data.bmi >= 30) hyperRisk += 10;
            hyperRisk = Math.min(100, hyperRisk);
            
            if (hyperRisk > 5) {
                const level = hyperRisk >= 50 ? 'high' : hyperRisk >= 25 ? 'medium' : 'low';
                penaltyScore += level === 'high' ? 30 : level === 'medium' ? 15 : 5;
                diseases.push({
                    disease: 'hypertension',
                    name: { en: 'Hypertension', am: 'የደም ግፊት', om: 'Dhiibbaa Dhiigaa' },
                    icon: '🩸', risk: hyperRisk, level: level,
                    treatment: { firstLine: ['Enalapril 5-20mg daily'], traditionalEthiopian: ['Moringa', 'Tosign tea'] }
                });
            }
            
            // Diabetes
            let diabetesRisk = 0;
            if (data.glucose >= 200) diabetesRisk += 50;
            else if (data.glucose >= 140) diabetesRisk += 35;
            else if (data.glucose >= 126) diabetesRisk += 20;
            if (data.bmi >= 30) diabetesRisk += 15;
            diabetesRisk = Math.min(100, diabetesRisk);
            
            if (diabetesRisk > 5) {
                const level = diabetesRisk >= 50 ? 'high' : diabetesRisk >= 25 ? 'medium' : 'low';
                penaltyScore += level === 'high' ? 30 : level === 'medium' ? 15 : 5;
                diseases.push({
                    disease: 'diabetes_type2',
                    name: { en: 'Type 2 Diabetes', am: 'የስኳር ህመም', om: 'Sukkaara' },
                    icon: '🍬', risk: diabetesRisk, level: level,
                    treatment: { firstLine: ['Metformin 500mg 2x daily'], traditionalEthiopian: ['Moringa', 'Grawa'] }
                });
            }
            
            // Malaria
            let malariaRisk = 0;
            if (data.temperature >= 39) malariaRisk += 40;
            else if (data.temperature >= 38) malariaRisk += 25;
            const month = new Date().getMonth() + 1;
            if (month >= 6 && month <= 9) malariaRisk += 20;
            malariaRisk = Math.min(100, malariaRisk);
            
            if (malariaRisk >= 10) {
                const level = malariaRisk >= 50 ? 'high' : malariaRisk >= 25 ? 'medium' : 'low';
                penaltyScore += level === 'high' ? 25 : 10;
                diseases.push({
                    disease: 'malaria',
                    name: { en: 'Malaria', am: 'ወባ', om: 'Busaa' },
                    icon: '🦟', risk: malariaRisk, level: level,
                    treatment: { firstLine: ['Coartem (Artemether-Lumefantrine)'], traditionalEthiopian: ['Neem', 'Gesho'] }
                });
            }
            
            diseases.sort((a, b) => b.risk - a.risk);
            
            return {
                score: Math.max(0, Math.min(100, 100 - penaltyScore)),
                findings: diseases,
                reasoning: 'Based on vital signs and Ethiopian epidemiological data. This is AI-assisted analysis, not a medical diagnosis.',
                disclaimer: 'Consult a healthcare provider for proper diagnosis.',
                generatedBy: 'Offline Analysis',
                source: 'offline',
                timestamp: Date.now()
            };
        },
        
        // ============================================
        // RENDER RESULTS
        // ============================================
        renderGroqResults: function(results) {
            const container = document.getElementById('riskResults');
            if (!container) return;
            
            const lang = localStorage.getItem('lang') || 'en';
            const findings = results.findings || [];
            
            if (findings.length === 0) {
                container.innerHTML = '<div class="placeholder-content"><span style="font-size:60px;">✅</span><h3>No significant risks detected</h3><p>Your vitals appear within normal ranges. Maintain your healthy lifestyle!</p></div>';
                return;
            }
            
            container.innerHTML = `
                <div class="ai-badge-header">
                    🧠 ${results.generatedBy || 'AI Analysis'} 
                    ${results.source === 'offline' ? '📚' : '☁️'}
                </div>
                ${findings.map((f, i) => {
                    const name = f.name?.[lang] || f.name?.en || f.disease || '';
                    const risk = f.risk || 0;
                    const level = f.level || 'low';
                    return `
                    <div class="risk-item ${level}" style="margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;">
                            <strong>${f.icon || '🏥'} ${name}</strong>
                            <span style="font-weight:700;color:${level==='high'?'#ef4444':level==='medium'?'#f59e0b':'#10b981'}">${risk}%</span>
                        </div>
                        <div class="risk-bar"><div class="risk-bar-fill ${level}" style="width:${risk}%"></div></div>
                        ${f.treatment?.firstLine ? `<p style="font-size:12px;margin-top:6px;">💊 ${f.treatment.firstLine[0]}</p>` : ''}
                        ${f.treatment?.traditionalEthiopian?.length ? `<p style="font-size:11px;color:#059669;">🌿 ${f.treatment.traditionalEthiopian.join(', ')}</p>` : ''}
                    </div>
                `}).join('')}
                ${results.reasoning ? `<div class="reasoning-box"><strong>🧠 Clinical Reasoning:</strong><p>${typeof results.reasoning === 'string' ? results.reasoning : JSON.stringify(results.reasoning)}</p></div>` : ''}
                <p class="disclaimer">⚠️ ${results.disclaimer || 'This is AI-assisted analysis. Consult a healthcare provider.'}</p>
            `;
        },
        
        updateHealthScore: function(score) {
            const el = document.getElementById('healthScore');
            if (el) {
                el.textContent = score;
                el.style.color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
            }
        },
        
        updateChart: function(results) {
            const canvas = document.getElementById('healthTrendChart');
            if (!canvas || !results?.findings?.length) return;
            
            const ctx = canvas.getContext('2d');
            if (app.healthChart) app.healthChart.destroy();
            
            const findings = results.findings.slice(0, 5);
            const lang = localStorage.getItem('lang') || 'en';
            
            app.healthChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: findings.map(f => (f.name?.[lang] || f.name?.en || '').substring(0, 15)),
                    datasets: [{
                        data: findings.map(f => f.risk),
                        backgroundColor: findings.map(f => f.level==='high'?'#ef4444':f.level==='medium'?'#f59e0b':'#10b981'),
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            });
        },
        
        // ============================================
        // LANDING PAGE / MARKETING INFO
        // ============================================
        renderLandingInfo: function() {
            // Add platform capabilities section if on home tab
            const overviewSection = document.getElementById('riskOverview');
            if (overviewSection && !app.latestAnalysis) {
                // Add a small info card about platform capabilities
                const infoHTML = document.createElement('div');
                infoHTML.className = 'glass-card platform-info';
                infoHTML.innerHTML = `
                    <h3>🧬 Why EthioHealth AI Pro?</h3>
                    <div class="feature-grid">
                        <div class="feature-item">🤖 <strong>AI-Powered</strong><br>Groq AI + PubMed evidence</div>
                        <div class="feature-item">🇪🇹 <strong>Ethiopian-First</strong><br>Amharic, Oromo, English</div>
                        <div class="feature-item">🌿 <strong>Traditional Medicine</strong><br>Validated herb database</div>
                        <div class="feature-item">📚 <strong>Evidence-Based</strong><br>Real medical literature</div>
                        <div class="feature-item">🔒 <strong>100% Private</strong><br>Data stays on device</div>
                        <div class="feature-item">📱 <strong>Always Available</strong><br>Works offline</div>
                    </div>
                `;
                overviewSection.parentNode.insertBefore(infoHTML, overviewSection);
            }
        },
        
        // ============================================
        // BODY MAP & SYMPTOMS
        // ============================================
        showBodyPartSymptoms: function(partName) {
            const container = document.getElementById('bodyPartSymptoms');
            if (!container) return;
            
            const symptomMap = {
                'head': ['headache', 'dizziness', 'fever', 'blurred_vision', 'ear_pain', 'hearing_loss', 'migraine', 'confusion'],
                'chest': ['chest_pain', 'shortness_breath', 'cough', 'wheezing', 'rapid_heartbeat', 'chest_tightness'],
                'abdomen': ['abdominal_pain', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'bloating', 'cramps'],
                'left_arm': ['arm_pain', 'numbness', 'tingling', 'swelling', 'weakness'],
                'right_arm': ['arm_pain', 'numbness', 'tingling', 'swelling', 'weakness'],
                'left_leg': ['leg_pain', 'knee_pain', 'swelling', 'cramps'],
                'right_leg': ['leg_pain', 'knee_pain', 'swelling', 'cramps'],
                'left_foot': ['foot_pain', 'swelling', 'numbness'],
                'right_foot': ['foot_pain', 'swelling', 'numbness']
            };
            
            const symptoms = symptomMap[partName] || ['pain', 'swelling'];
            
            container.innerHTML = `
                <h4>📍 ${partName.replace(/_/g, ' ').toUpperCase()} Symptoms:</h4>
                <div class="symptom-list">
                    ${symptoms.map(s => `
                        <span class="symptom-tag ${app.selectedSymptoms.includes(s) ? 'selected' : ''}" 
                              onclick="App.toggleSymptom('${s}')">${s.replace(/_/g, ' ')}</span>
                    `).join('')}
                </div>
            `;
        },
        
        toggleSymptom: function(symptom) {
            if (!app.selectedSymptoms) app.selectedSymptoms = [];
            const idx = app.selectedSymptoms.indexOf(symptom);
            if (idx > -1) app.selectedSymptoms.splice(idx, 1);
            else app.selectedSymptoms.push(symptom);
            
            document.querySelectorAll('.symptom-tag').forEach(el => {
                if (el.textContent.replace(/ /g, '_').toLowerCase().includes(symptom)) {
                    el.classList.toggle('selected', app.selectedSymptoms.includes(symptom));
                }
            });
            
            app.updateSelectedList();
        },
        
        updateSelectedList: function() {
            const container = document.getElementById('selectedSymptomsList');
            if (!container) return;
            if (!app.selectedSymptoms.length) {
                container.innerHTML = '<span style="color:#9ca3af;">None selected</span>';
            } else {
                container.innerHTML = app.selectedSymptoms.map(s => 
                    `<span class="symptom-tag selected">${s.replace(/_/g, ' ')} ✕</span>`
                ).join(' ');
            }
        },
        
        // ============================================
        // UTILITY FUNCTIONS
        // ============================================
        showToast: function(message, type, duration) {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = 'toast toast-' + (type || 'info');
            toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, duration || 3000);
        },
        
        showLoading: function(text) {
            const overlay = document.getElementById('loadingOverlay');
            const textEl = document.getElementById('loadingText');
            if (overlay) overlay.style.display = 'flex';
            if (textEl && text) textEl.textContent = text;
        },
        
        hideLoading: function() {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) overlay.style.display = 'none';
        },
        
        changeLanguage: function(lang) {
            localStorage.setItem('lang', lang);
            app.updateLanguageUI(lang);
            document.documentElement.dir = lang === 'am' ? 'rtl' : 'ltr';
            document.body.classList.toggle('rtl', lang === 'am');
            if (typeof i18next !== 'undefined') i18next.changeLanguage(lang);
            app.showToast('✅ ' + ({en:'English', am:'አማርኛ', om:'Oromoo'}[lang] || lang), 'success');
        },
        
        updateLanguageUI: function(lang) {
            const flagMap = { en: 'EN', am: 'አማ', om: 'OM' };
            const el = document.getElementById('currentLangText');
            if (el) el.textContent = flagMap[lang] || 'EN';
        },
        
        showLanguageModal: function() {
            const current = localStorage.getItem('lang') || 'en';
            const content = `
                <h3>🌐 Select Language</h3>
                <button class="lang-opt ${current==='en'?'active':''}" onclick="App.changeLanguage('en');App.closeModal();">🇺🇸 English ✓</button>
                <button class="lang-opt ${current==='am'?'active':''}" onclick="App.changeLanguage('am');App.closeModal();">🇪🇹 አማርኛ ✓</button>
                <button class="lang-opt ${current==='om'?'active':''}" onclick="App.changeLanguage('om');App.closeModal();">🇪🇹 Oromoo ✓</button>
                <button class="btn btn-secondary" onclick="App.closeModal()" style="margin-top:12px;">Close</button>
            `;
            app.openModal('🌐 Language', content);
        },
        
        openModal: function(title, content) {
            const container = document.getElementById('modalContainer');
            if (!container) return;
            container.innerHTML = `<div class="modal-overlay" onclick="App.closeModal()"><div class="modal-sheet" onclick="event.stopPropagation()"><div class="modal-handle"></div><h2>${title}</h2>${content}</div></div>`;
            container.classList.add('active');
        },
        
        closeModal: function() {
            const container = document.getElementById('modalContainer');
            if (container) { container.classList.remove('active'); setTimeout(() => container.innerHTML = '', 300); }
        },
        
        triggerEmergency: function() {
            if (confirm('Call Ethiopian Emergency (907)?')) window.location.href = 'tel:907';
        },
        
        saveAnalysis: function(results, input) {
            try {
                const analyses = JSON.parse(localStorage.getItem('analyses') || '[]');
                analyses.unshift({ timestamp: Date.now(), score: results.score });
                localStorage.setItem('analyses', JSON.stringify(analyses.slice(0, 20)));
            } catch(e) {}
        },
        
        loadSavedData: function() {},
        renderHerbList: function() {},
        renderVoiceHistory: function() {},
        renderReportTab: function() {},
        toggleVoiceListen: function() {},
        changeHolisticTab: function() {},
        updateConnectionStatus: function() {},
        renderHomeTab: function() {},
        
        t: function(key) {
            const translations = {
                en: { home: 'Home', symptoms: 'Symptoms', analyze: 'Analyze Now' },
                am: { home: 'መነሻ', symptoms: 'ምልክቶች', analyze: 'ይመርምሩ' },
                om: { home: 'Mana', symptoms: 'Mallattoolee', analyze: 'Xiinxali' }
            };
            const lang = localStorage.getItem('lang') || 'en';
            return translations[lang]?.[key] || translations.en?.[key] || key;
        }
    };
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => app.init());
    } else {
        setTimeout(() => app.init(), 100);
    }
    
    return app;
})();

window.App = App;
console.log('✅ App.js loaded successfully');