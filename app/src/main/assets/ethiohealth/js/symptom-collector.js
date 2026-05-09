// ============================================
// ETHIOHEALTH AI PRO - SYMPTOM COLLECTOR
// ============================================

const SymptomCollector = (function() {
    'use strict';
    
    const collector = {
        // Currently selected symptoms
        selectedSymptoms: [],
        
        // Current holistic category
        currentCategory: 'body',
        
        // Currently selected body part
        selectedBodyPart: null,
        
        /**
         * Initialize symptom collector
         */
        init: function() {
            collector.renderHolisticTabs();
            collector.renderBodyMap();
            collector.setupEventListeners();
        },
        
        /**
         * Render holistic category tabs
         */
        renderHolisticTabs: function() {
            const tabsContainer = document.getElementById('holisticTabs');
            if (!tabsContainer) return;
            
            const tabs = [
                { id: 'body', icon: '🧍', i18n: 'body' },
                { id: 'mind', icon: '🧠', i18n: 'mind' },
                { id: 'spirit', icon: '✨', i18n: 'spirit' },
                { id: 'social', icon: '👥', i18n: 'social' }
            ];
            
            tabsContainer.innerHTML = tabs.map(tab => `
                <button class="holistic-tab ${tab.id === 'body' ? 'active' : ''}" 
                        data-category="${tab.id}" 
                        onclick="SymptomCollector.switchCategory('${tab.id}')">
                    <span>${tab.icon}</span>
                    <span data-i18n="${tab.i18n}">${I18n.t(tab.i18n)}</span>
                </button>
            `).join('');
        },
        
        /**
         * Switch holistic category
         */
        switchCategory: function(category) {
            collector.currentCategory = category;
            
            // Update active tab
            document.querySelectorAll('.holistic-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.category === category);
            });
            
            // Show/hide body map
            const bodyMap = document.getElementById('bodyMapContainer');
            const categorySymptoms = document.getElementById('categorySymptoms');
            
            if (bodyMap) bodyMap.style.display = category === 'body' ? 'block' : 'none';
            if (categorySymptoms) categorySymptoms.style.display = category !== 'body' ? 'grid' : 'none';
            
            // Render symptoms for category
            if (category !== 'body') {
                collector.renderCategorySymptoms(category);
            }
        },
        
        /**
         * Render body map SVG
         */
        renderBodyMap: function() {
            const svgObject = document.getElementById('bodyMapSVG');
            if (!svgObject) return;
            
            svgObject.addEventListener('load', function() {
                const svgDoc = svgObject.contentDocument;
                if (!svgDoc) return;
                
                const bodyParts = svgDoc.querySelectorAll('[data-part]');
                bodyParts.forEach(part => {
                    part.style.cursor = 'pointer';
                    part.addEventListener('click', function(e) {
                        const partName = this.dataset.part;
                        collector.selectBodyPart(partName);
                        
                        // Highlight selected part
                        bodyParts.forEach(p => p.classList.remove('selected'));
                        this.classList.add('selected');
                    });
                });
            });
        },
        
        /**
         * Select body part and show related symptoms
         */
        selectBodyPart: function(partName) {
            collector.selectedBodyPart = partName;
            
            // Get symptoms for this body part
            const symptoms = collector.getSymptomsForBodyPart(partName);
            
            const container = document.getElementById('bodyPartSymptoms');
            if (!container) return;
            
            container.innerHTML = `
                <h4 style="margin-top:12px;margin-bottom:8px;text-transform:capitalize;">
                    ${partName.replace(/_/g, ' ')} Symptoms
                </h4>
                <div class="symptom-list">
                    ${symptoms.map(s => `
                        <span class="symptom-tag ${collector.selectedSymptoms.includes(s) ? 'selected' : ''}" 
                              data-symptom="${s}" 
                              onclick="SymptomCollector.toggleSymptom('${s}')">
                            ${I18n.t(s) || s.replace(/_/g, ' ')}
                        </span>
                    `).join('')}
                </div>
            `;
        },
        
        /**
         * Get symptoms for specific body part
         */
        getSymptomsForBodyPart: function(part) {
            const symptomMap = {
                'head': ['headache', 'dizziness', 'vision_problems', 'fever'],
                'neck': ['sore_throat', 'swelling', 'stiff_neck'],
                'chest': ['chest_pain', 'shortness_breath', 'rapid_heartbeat', 'cough'],
                'abdomen': ['abdominal_pain', 'nausea', 'vomiting', 'diarrhea', 'constipation'],
                'left_arm_upper': ['muscle_pain', 'joint_pain', 'numbness', 'swelling'],
                'left_arm_lower': ['muscle_pain', 'numbness', 'swelling'],
                'right_arm_upper': ['muscle_pain', 'joint_pain', 'numbness', 'swelling'],
                'right_arm_lower': ['muscle_pain', 'numbness', 'swelling'],
                'left_leg_upper': ['muscle_pain', 'joint_pain', 'swelling', 'numbness'],
                'left_leg_lower': ['muscle_pain', 'swelling', 'numbness'],
                'right_leg_upper': ['muscle_pain', 'joint_pain', 'swelling', 'numbness'],
                'right_leg_lower': ['muscle_pain', 'swelling', 'numbness'],
                'left_hand': ['numbness', 'swelling', 'joint_pain'],
                'right_hand': ['numbness', 'swelling', 'joint_pain'],
                'left_foot': ['swelling', 'numbness', 'muscle_pain'],
                'right_foot': ['swelling', 'numbness', 'muscle_pain']
            };
            
            return symptomMap[part] || ['muscle_pain', 'swelling'];
        },
        
        /**
         * Render symptoms for mind/spirit/social categories
         */
        renderCategorySymptoms: function(category) {
            const container = document.getElementById('categorySymptoms');
            if (!container) return;
            
            const symptomsByCategory = {
                'mind': [
                    'anxiety', 'depression', 'stress', 'insomnia', 'poor_concentration',
                    'memory_loss', 'mood_swings', 'irritability', 'panic_attacks',
                    'brain_fog', 'restlessness', 'hopelessness'
                ],
                'spirit': [
                    'lack_purpose', 'spiritual_distress', 'loneliness', 'grief',
                    'fear', 'guilt', 'shame', 'emptiness', 'disconnection'
                ],
                'social': [
                    'isolation', 'family_conflict', 'financial_stress', 'work_stress',
                    'discrimination', 'lack_support', 'housing_issues', 'food_insecurity'
                ]
            };
            
            const symptoms = symptomsByCategory[category] || [];
            
            container.innerHTML = symptoms.map(s => `
                <span class="symptom-tag ${collector.selectedSymptoms.includes(s) ? 'selected' : ''}" 
                      data-symptom="${s}" 
                      onclick="SymptomCollector.toggleSymptom('${s}')">
                    ${I18n.t(s) || s.replace(/_/g, ' ')}
                </span>
            `).join('');
        },
        
        /**
         * Toggle symptom selection
         */
        toggleSymptom: function(symptomId) {
            const index = collector.selectedSymptoms.indexOf(symptomId);
            
            if (index > -1) {
                collector.selectedSymptoms.splice(index, 1);
            } else {
                collector.selectedSymptoms.push(symptomId);
            }
            
            // Update UI
            document.querySelectorAll(`[data-symptom="${symptomId}"]`).forEach(el => {
                el.classList.toggle('selected', collector.selectedSymptoms.includes(symptomId));
            });
            
            // Update count if exists
            const countEl = document.getElementById('symptomCount');
            if (countEl) {
                countEl.textContent = `${collector.selectedSymptoms.length} selected`;
            }
        },
        
        /**
         * Setup event listeners
         */
        setupEventListeners: function() {
            // Severity slider
            const slider = document.getElementById('severitySlider');
            const valueDisplay = document.getElementById('severityValue');
            
            if (slider && valueDisplay) {
                slider.addEventListener('input', function() {
                    valueDisplay.textContent = this.value;
                });
            }
        },
        
        /**
         * Get all selected symptom data
         */
        getSymptomData: function() {
            return {
                symptoms: collector.selectedSymptoms,
                duration: document.getElementById('symptomDuration')?.value || 'days',
                severity: parseInt(document.getElementById('severitySlider')?.value || '5'),
                notes: document.getElementById('symptomNotes')?.value || '',
                bodyPart: collector.selectedBodyPart,
                category: collector.currentCategory
            };
        },
        
        /**
         * Clear all selected symptoms
         */
        clearSelection: function() {
            collector.selectedSymptoms = [];
            collector.selectedBodyPart = null;
            
            document.querySelectorAll('.symptom-tag.selected').forEach(el => {
                el.classList.remove('selected');
            });
            
            const bodyParts = document.querySelectorAll('#bodyMapSVG [data-part]');
            if (bodyParts) {
                bodyParts.forEach(p => p.classList.remove('selected'));
            }
        },
        
        /**
         * Get quick symptom presets
         */
        getQuickPresets: function() {
            return [
                {
                    name: 'Common Cold',
                    icon: '🤧',
                    symptoms: ['headache', 'cough', 'sore_throat', 'fatigue', 'fever'],
                    duration: '2-3days'
                },
                {
                    name: 'Malaria Suspect',
                    icon: '🦟',
                    symptoms: ['fever', 'chills', 'headache', 'muscle_pain', 'fatigue', 'nausea'],
                    duration: '1day'
                },
                {
                    name: 'Stomach Issues',
                    icon: '🤢',
                    symptoms: ['abdominal_pain', 'nausea', 'vomiting', 'diarrhea'],
                    duration: 'hours'
                },
                {
                    name: 'Stress & Anxiety',
                    icon: '😰',
                    symptoms: ['anxiety', 'stress', 'insomnia', 'fatigue', 'headache'],
                    duration: 'weeks'
                }
            ];
        }
    };
    
    console.log('✅ Symptom Collector initialized');
    return collector;
})();