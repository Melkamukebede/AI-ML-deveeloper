// ============================================
// GROK AI AGENT - Disease Reasoning Engine
// Simulates Grok-style comprehensive analysis
// ============================================

const GrokAI = (function() {
    'use strict';
    
    /**
     * Grok AI Disease Knowledge Base
     * Ethiopian-specific disease patterns with multi-factor analysis
     */
    const diseaseKB = {
        hypertension: {
            name: { en: 'Hypertension', am: 'የደም ግፊት', om: 'Dhiibbaa Dhiigaa' },
            icon: '🩸',
            category: 'cardiovascular',
            prevalence: { en: '16-20% of Ethiopian adults', am: 'ከ16-20% የኢትዮጵያ አዋቂዎች', om: '16-20% namoota Itoophiyaa' },
            riskFactors: {
                systolic: { threshold: 130, weight: 35, description: 'Systolic BP ≥130 mmHg' },
                diastolic: { threshold: 85, weight: 25, description: 'Diastolic BP ≥85 mmHg' },
                age: { threshold: 40, weight: 15, description: 'Age ≥40 years' },
                bmi: { threshold: 25, weight: 15, description: 'BMI ≥25 (overweight)' },
                lifestyle: { weight: 10, description: 'High salt diet, sedentary lifestyle' }
            },
            symptoms: ['headache', 'dizziness', 'blurred_vision', 'chest_pain', 'shortness_breath', 'fatigue', 'nosebleeds', 'irregular_heartbeat'],
            complications: ['stroke', 'heart_attack', 'kidney_failure', 'vision_loss', 'heart_failure'],
            treatment: {
                modern: ['Enalapril', 'Amlodipine', 'Hydrochlorothiazide', 'Atenolol', 'Lisinopril'],
                traditional: ['Moringa', 'Tosign', 'Gesho'],
                lifestyle: ['Reduce salt to <5g/day', '30 min daily walk', 'Stress reduction', 'Weight management']
            },
            emergencyThreshold: 70
        },
        diabetes_type2: {
            name: { en: 'Type 2 Diabetes', am: 'ዓይነት 2 የስኳር ህመም', om: 'Sukkaara Gosa 2' },
            icon: '🍬',
            category: 'metabolic',
            prevalence: { en: '5-8% of adults, rising in urban areas', am: '5-8% አዋቂዎች', om: '5-8% namoota magaalaa' },
            riskFactors: {
                glucose: { threshold: 126, weight: 40, description: 'Fasting glucose ≥126 mg/dL' },
                bmi: { threshold: 25, weight: 20, description: 'BMI ≥25' },
                age: { threshold: 45, weight: 15, description: 'Age ≥45 years' },
                hypertension: { weight: 15, description: 'Co-existing hypertension' },
                familyHistory: { weight: 10, description: 'Family history of diabetes' }
            },
            symptoms: ['frequent_urination', 'excessive_thirst', 'extreme_hunger', 'unexplained_weight_loss', 'fatigue', 'blurred_vision', 'slow_healing_wounds', 'frequent_infections', 'numbness_hands', 'numbness_feet'],
            complications: ['kidney_disease', 'blindness', 'amputation', 'heart_disease', 'stroke', 'nerve_damage'],
            treatment: {
                modern: ['Metformin', 'Glibenclamide', 'Insulin NPH', 'Insulin Regular'],
                traditional: ['Moringa', 'Grawa', 'Koseret'],
                lifestyle: ['Exercise 30 min daily', 'Reduce refined carbs', 'Eat teff injera instead of white', 'Regular glucose monitoring']
            },
            emergencyThreshold: 65
        },
        malaria: {
            name: { en: 'Malaria', am: 'ወባ', om: 'Busaa' },
            icon: '🦟',
            category: 'infectious',
            prevalence: { en: '60% of population at risk, seasonal', am: '60% ህዝብ ለአደጋ ተጋላጭ', om: '60% uummataa balaadhaaf saaxilama' },
            riskFactors: {
                temperature: { threshold: 38, weight: 35, description: 'Fever ≥38°C' },
                season: { weight: 25, description: 'Rainy season (Jun-Sep) peak' },
                location: { weight: 20, description: 'Lowland areas, <2,000m altitude' },
                symptoms: { weight: 20, description: 'Chills, sweating, headache' }
            },
            symptoms: ['fever', 'chills', 'sweating', 'headache', 'muscle_pain', 'fatigue', 'nausea', 'vomiting', 'diarrhea', 'jaundice'],
            complications: ['cerebral_malaria', 'severe_anemia', 'organ_failure', 'death'],
            treatment: {
                modern: ['Artemether-Lumefantrine (Coartem)', 'Chloroquine', 'Quinine', 'Primaquine'],
                traditional: ['Neem', 'Gesho', 'Grawa'],
                lifestyle: ['Sleep under treated nets', 'Eliminate standing water', 'Indoor residual spraying', 'Seek early diagnosis']
            },
            emergencyThreshold: 50,
            seasonal: true,
            peakMonths: [6, 7, 8, 9]
        },
        tuberculosis: {
            name: { en: 'Tuberculosis (TB)', am: 'ሳንባ ነቀርሳ', om: 'Sombisaa (TB)' },
            icon: '🫁',
            category: 'infectious',
            prevalence: { en: 'High burden: 150+ per 100,000', am: 'ከፍተኛ ሸክም: 150+ በ100,000', om: 'Ba\'aa guddaa: 150+ 100,000 keessatti' },
            riskFactors: {
                cough: { threshold: 14, weight: 30, description: 'Persistent cough >2 weeks' },
                nightSweats: { weight: 20, description: 'Night sweats' },
                weightLoss: { weight: 20, description: 'Unexplained weight loss' },
                fever: { weight: 15, description: 'Low-grade fever' },
                contact: { weight: 15, description: 'Contact with TB patient' }
            },
            symptoms: ['persistent_cough', 'coughing_blood', 'chest_pain', 'night_sweats', 'weight_loss', 'fatigue', 'fever', 'loss_appetite', 'shortness_breath'],
            complications: ['lung_damage', 'spread_to_other_organs', 'drug_resistant_tb', 'death'],
            treatment: {
                modern: ['Rifampicin', 'Isoniazid', 'Pyrazinamide', 'Ethambutol (DOTS program)'],
                traditional: [],
                lifestyle: ['Complete full treatment course', 'Good nutrition', 'Adequate rest', 'Respiratory hygiene']
            },
            emergencyThreshold: 60
        },
        typhoid: {
            name: { en: 'Typhoid Fever', am: 'ታይፎይድ', om: 'Taayifooyidii' },
            icon: '🤒',
            category: 'infectious',
            prevalence: { en: 'Common in areas with poor sanitation', am: 'ንጽህና በጎደላቸው አካባቢዎች የተለመደ', om: 'Bakkeewwan qulqullina hin qabne keessatti beekamaa dha' },
            symptoms: ['fever', 'headache', 'abdominal_pain', 'constipation', 'diarrhea', 'rose_spots', 'fatigue', 'loss_appetite', 'dry_cough'],
            treatment: {
                modern: ['Ciprofloxacin', 'Ceftriaxone', 'Azithromycin'],
                traditional: [],
                lifestyle: ['Boil drinking water', 'Wash hands frequently', 'Avoid street food', 'Complete antibiotic course']
            }
        },
        anemia: {
            name: { en: 'Anemia/Malnutrition', am: 'የደም ማነስ', om: 'Dhiiga Hanqina' },
            icon: '🩸',
            category: 'nutritional',
            prevalence: { en: '24% women, 57% children <5', am: '24% ሴቶች፣ 57% ህፃናት', om: '24% dubartoota, 57% daa\'imman <5' },
            symptoms: ['fatigue', 'pale_skin', 'shortness_breath', 'dizziness', 'rapid_heartbeat', 'brittle_nails', 'cold_hands_feet', 'headache'],
            treatment: {
                modern: ['Iron + Folic Acid', 'Vitamin B12', 'Blood transfusion (severe)'],
                traditional: ['Moringa', 'Teff', 'Koseret'],
                lifestyle: ['Eat iron-rich foods (teff, lentils, spinach)', 'Vitamin C with meals', 'Regular deworming']
            }
        },
        gastroenteritis: {
            name: { en: 'Gastroenteritis/Diarrhea', am: 'የሆድ ቁርጠት/ተቅማጥ', om: 'Garaa Kaasaa' },
            icon: '💧',
            category: 'digestive',
            symptoms: ['diarrhea', 'vomiting', 'abdominal_pain', 'nausea', 'fever', 'dehydration', 'cramps', 'bloating'],
            treatment: {
                modern: ['ORS (Oral Rehydration Salts)', 'Zinc supplements', 'Loperamide (caution)'],
                traditional: ['Tena Adam tea', 'Gesho'],
                lifestyle: ['ORS immediately', 'Continue feeding', 'Breastfeed infants', 'Seek care if severe']
            }
        },
        respiratory_infection: {
            name: { en: 'Respiratory Infection', am: 'የመተንፈሻ ኢንፌክሽን', om: 'Infekshinii Hargansuu' },
            icon: '🫁',
            category: 'respiratory',
            symptoms: ['cough', 'fever', 'sore_throat', 'runny_nose', 'chest_congestion', 'wheezing', 'shortness_breath', 'fatigue', 'body_aches'],
            treatment: {
                modern: ['Amoxicillin', 'Azithromycin', 'Paracetamol'],
                traditional: ['Damakese', 'Tena Adam steam', 'Tosign tea'],
                lifestyle: ['Rest and hydrate', 'Steam inhalation', 'Avoid smoke', 'Warm fluids']
            }
        }
    };
    
    const grok = {
        /**
         * Grok-style comprehensive disease reasoning
         */
        analyzeWithReasoning: function(input) {
            const results = {
                timestamp: Date.now(),
                score: 100,
                findings: [],
                reasoning: [],
                recommendations: [],
                urgencyLevel: 'normal',
                primaryDiagnosis: null,
                differentialDiagnoses: [],
                followUpPlan: []
            };
            
            let penaltyScore = 0;
            const allFindings = [];
            
            // Analyze each potential disease
            for (const [diseaseId, disease] of Object.entries(diseaseKB)) {
                const analysis = grok.analyzeSpecificDisease(diseaseId, disease, input);
                if (analysis && analysis.risk > 5) {
                    allFindings.push(analysis);
                    penaltyScore += analysis.penalty;
                }
            }
            
            // Sort by risk
            allFindings.sort((a, b) => b.risk - a.risk);
            results.findings = allFindings.slice(0, 6);
            results.score = Math.max(0, Math.min(100, 100 - penaltyScore));
            
            // Determine primary diagnosis
            if (results.findings.length > 0) {
                results.primaryDiagnosis = results.findings[0];
                results.differentialDiagnoses = results.findings.slice(1, 4);
            }
            
            // Generate Grok-style reasoning
            results.reasoning = grok.generateReasoning(results, input);
            
            // Determine urgency
            if (results.findings.some(f => f.risk >= 50 && f.level === 'high')) {
                results.urgencyLevel = 'urgent';
            } else if (results.findings.some(f => f.risk >= 30)) {
                results.urgencyLevel = 'attention';
            }
            
            // Generate recommendations
            results.recommendations = grok.generateRecommendations(results);
            
            // Generate follow-up plan
            results.followUpPlan = grok.generateFollowUpPlan(results);
            
            return results;
        },
        
        /**
         * Analyze specific disease
         */
        analyzeSpecificDisease: function(diseaseId, disease, input) {
            let risk = 0;
            const matchedFactors = [];
            const matchedSymptoms = [];
            
            // Check risk factors
            if (disease.riskFactors) {
                for (const [factor, config] of Object.entries(disease.riskFactors)) {
                    let matched = false;
                    
                    switch(factor) {
                        case 'systolic':
                            if (input.systolic >= config.threshold) { risk += config.weight; matched = true; }
                            break;
                        case 'diastolic':
                            if (input.diastolic >= config.threshold) { risk += config.weight; matched = true; }
                            break;
                        case 'glucose':
                            if (input.glucose >= config.threshold) { risk += config.weight; matched = true; }
                            break;
                        case 'bmi':
                            if (input.bmi >= config.threshold) { risk += config.weight; matched = true; }
                            break;
                        case 'age':
                            if (input.age >= config.threshold) { risk += config.weight; matched = true; }
                            break;
                        case 'temperature':
                            if (input.temperature >= config.threshold) { risk += config.weight; matched = true; }
                            break;
                        case 'cough':
                            if (input.symptoms && input.symptoms.includes('persistent_cough') && input.duration >= config.threshold) {
                                risk += config.weight; matched = true;
                            }
                            break;
                        case 'season':
                            if (disease.seasonal) {
                                const month = new Date().getMonth() + 1;
                                if (disease.peakMonths && disease.peakMonths.includes(month)) {
                                    risk += config.weight; matched = true;
                                }
                            }
                            break;
                        case 'location':
                            risk += config.weight; matched = true; // Assume risk for Ethiopian context
                            break;
                        case 'nightSweats':
                            if (input.symptoms && input.symptoms.includes('night_sweats')) { risk += config.weight; matched = true; }
                            break;
                        case 'weightLoss':
                            if (input.symptoms && input.symptoms.includes('weight_loss')) { risk += config.weight; matched = true; }
                            break;
                        case 'hypertension':
                            if (input.systolic >= 130 || input.diastolic >= 85) { risk += config.weight; matched = true; }
                            break;
                        case 'symptoms':
                            if (input.symptoms && input.symptoms.length >= 3) { risk += config.weight; matched = true; }
                            break;
                    }
                    
                    if (matched) {
                        matchedFactors.push(config.description);
                    }
                }
            }
            
            // Check symptom matches
            if (disease.symptoms && input.symptoms) {
                for (const symptom of disease.symptoms) {
                    if (input.symptoms.includes(symptom)) {
                        matchedSymptoms.push(symptom);
                        risk += 5; // Each matched symptom adds 5%
                    }
                }
            }
            
            // Cap risk at 100
            risk = Math.min(100, risk);
            
            // Determine level
            let level = 'low';
            if (risk >= 60) level = 'high';
            else if (risk >= 30) level = 'medium';
            else if (risk >= 15) level = 'low';
            
            // Calculate penalty
            let penalty = 0;
            if (level === 'high') penalty = 30;
            else if (level === 'medium') penalty = 15;
            else if (level === 'low') penalty = 5;
            
            if (risk < 5) return null;
            
            return {
                id: diseaseId,
                name: disease.name,
                icon: disease.icon,
                category: disease.category,
                risk: risk,
                level: level,
                penalty: penalty,
                matchedFactors: matchedFactors,
                matchedSymptoms: matchedSymptoms,
                prevalence: disease.prevalence,
                complications: disease.complications || [],
                treatment: disease.treatment,
                emergencyThreshold: disease.emergencyThreshold || 70
            };
        },
        
        /**
         * Generate Grok-style AI reasoning
         */
        generateReasoning: function(results, input) {
            const reasoning = [];
            const lang = localStorage.getItem('lang') || 'en';
            
            // Opening statement
            reasoning.push({
                en: `Based on comprehensive analysis of ${Object.keys(input).length} health parameters and ${input.symptoms?.length || 0} reported symptoms, here is my clinical reasoning:`,
                am: `${Object.keys(input).length} የጤና መለኪያዎች እና ${input.symptoms?.length || 0} ምልክቶች ላይ በተመሠረተ አጠቃላይ ትንተና፣ ክሊኒካዊ ምክንያቴ ይህ ነው፡`,
                om: `Qormaata bal'aa ${Object.keys(input).length} sadarkaawwan fayyaa fi ${input.symptoms?.length || 0} mallattoolee irratti hundaa'un, sababni kiliinikaa koo kana:`
            });
            
            // Primary finding reasoning
            if (results.primaryDiagnosis) {
                const pd = results.primaryDiagnosis;
                reasoning.push({
                    en: `Primary finding: ${pd.name.en} with ${pd.risk}% probability. This is based on ${pd.matchedFactors.length} risk factors (${pd.matchedFactors.join(', ')}) and ${pd.matchedSymptoms.length} matching symptoms.`,
                    am: `ዋና ግኝት፡ ${pd.name.am} በ${pd.risk}% ዕድል። ይህ ${pd.matchedFactors.length} አደጋ ምክንያቶች እና ${pd.matchedSymptoms.length} ተዛማጅ ምልክቶች ላይ የተመሠረተ ነው።`,
                    om: `Argannoo ijoo: ${pd.name.om} ${pd.risk}% tokkoffaa. Kun ${pd.matchedFactors.length} sababa baloo fi ${pd.matchedSymptoms.length} mallattoolee walsimaniirratti hundaa'e.`
                });
            }
            
            // Differential reasoning
            if (results.differentialDiagnoses.length > 0) {
                reasoning.push({
                    en: `Differential diagnoses considered: ${results.differentialDiagnoses.map(d => d.name.en).join(', ')}. These share overlapping symptoms but have lower probability scores.`,
                    am: `ልዩ ምርመራዎች፡ ${results.differentialDiagnoses.map(d => d.name.am).join('፣ ')}። እነዚህ ተደራራቢ ምልክቶች አሏቸው ነገር ግን ዝቅተኛ ዕድል አላቸው።`,
                    om: `Qormaata addaa ilaalamani: ${results.differentialDiagnoses.map(d => d.name.om).join(', ')}. Isaan kun mallattoolee wal-irraa bu'uu qabu garuu tokkoffaa xiqqaa qabu.`
                });
            }
            
            return reasoning;
        },
        
        /**
         * Generate recommendations
         */
        generateRecommendations: function(results) {
            const recs = [];
            
            if (results.urgencyLevel === 'urgent') {
                recs.push({
                    en: '🚨 URGENT: Seek medical attention immediately. Visit nearest health center or call 907.',
                    am: '🚨 አስቸኳይ፡ ወዲያውኑ የህክምና እርዳታ ይፈልጉ። በአቅራቢያዎ የሚገኝ ጤና ጣቢያ ይጎብኙ ወይም 907 ይደውሉ።',
                    om: '🚨 TASGABBII: Hatattamaan gargaarsa fayyaa barbaadi. Buufata fayyaa dhiyoo jiru daawwadhu ykn 907 bilbili.'
                });
            }
            
            results.findings.forEach(finding => {
                if (finding.treatment?.lifestyle) {
                    const tip = finding.treatment.lifestyle[0];
                    recs.push({
                        en: `For ${finding.name.en}: ${tip}`,
                        am: `ለ${finding.name.am}፡ ${tip}`,
                        om: `${finding.name.om}f: ${tip}`
                    });
                }
            });
            
            return recs;
        },
        
        /**
         * Generate follow-up plan
         */
        generateFollowUpPlan: function(results) {
            const plan = [];
            
            if (results.urgencyLevel === 'urgent') {
                plan.push({ en: 'Immediate: Visit health center today', am: 'ወዲያውኑ፡ ዛሬ ጤና ጣቢያ ይጎብኙ', om: 'Hatattamaan: Har\'a buufata fayyaa daawwadhu' });
            } else if (results.urgencyLevel === 'attention') {
                plan.push({ en: 'Within 1 week: Schedule check-up', am: 'በ1 ሳምንት ውስጥ፡ ቀጠሮ ይያዙ', om: 'Torban 1 keessatti: Qormaata beellamaa' });
            }
            
            plan.push({ en: 'Ongoing: Monitor symptoms daily', am: 'ቀጣይ፡ ምልክቶችን በየቀኑ ይቆጣጠሩ', om: 'Itti fufaa: Guyyaa guyyaadhaan mallattoolee to\'adhu' });
            
            return plan;
        },
        
        /**
         * Analyze symptoms with Grok reasoning
         */
        analyzeSymptoms: function(symptoms, duration, severity, notes) {
            const input = {
                symptoms: symptoms,
                duration: duration,
                severity: severity,
                temperature: severity >= 7 ? 39 : 37,
                systolic: symptoms.includes('headache') ? 140 : 120,
                diastolic: symptoms.includes('dizziness') ? 90 : 80,
                glucose: symptoms.includes('frequent_urination') ? 150 : 95,
                bmi: 25,
                age: 35
            };
            
            return grok.analyzeWithReasoning(input);
        }
    };
    
    return grok;
})();

console.log('✅ Grok AI Engine initialized');