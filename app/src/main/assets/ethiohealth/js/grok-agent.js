// ============================================
// GROK-STYLE AI AGENT USING GROQ API
// With PubMed/OpenFDA Integration for Evidence
// Free Tier: groq.com (get API key)
// ============================================

const GrokAgent = (function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION - GET YOUR FREE API KEY AT:
    // https://console.groq.com
    // ============================================
    const CONFIG = {
        // GROQ API (free tier: https://console.groq.com)
        groqAPIKey: "YOUR_GROQ_API_KEY_HERE", // ← REPLACE WITH YOUR KEY
        groqEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
        groqModel: 'llama-3.3-70b-versatile', // Fast & powerful free model
        // Alternative models: 'mixtral-8x7b-32768', 'gemma2-9b-it'
        
        // PubMed API (free, no key needed for basic searches)
        pubmedEndpoint: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
        
        // OpenFDA API (free, get key for higher limits)
        openFDAEndpoint: 'https://api.fda.gov/drug/label.json',
        openFDAKey: '', // Optional: get from https://open.fda.gov/apis/
        
        // Ethiopian-specific health data
        ethiopianHealthStats: {
            hypertension: '16-20% prevalence in adults',
            diabetes: '5-8% prevalence, rising in urban areas',
            malaria: '60% of population at risk, seasonal peaks Jun-Sep',
            tuberculosis: 'High burden: 150+ per 100,000 population',
            malnutrition: '24% women, 57% children under 5 affected',
            typhoid: 'Common in areas with poor sanitation',
            respiratory: 'Leading cause of outpatient visits'
        }
    };
    
    // ============================================
    // MEDICAL KNOWLEDGE BASE (Ethiopian context)
    // ============================================
    const medicalKB = {
        diseases: {
            hypertension: {
                name: { en: 'Hypertension', am: 'የደም ግፊት', om: 'Dhiibbaa Dhiigaa' },
                icd10: 'I10',
                symptoms: ['headache', 'dizziness', 'blurred_vision', 'chest_pain', 'shortness_breath', 'nosebleeds', 'fatigue'],
                riskFactors: ['systolic_bp_above_130', 'diastolic_bp_above_85', 'age_over_40', 'bmi_above_25', 'high_salt_diet', 'family_history'],
                complications: ['stroke', 'heart_attack', 'kidney_failure', 'vision_loss'],
                labTests: ['Blood pressure measurement', 'Lipid profile', 'Kidney function test', 'Urinalysis'],
                treatment: {
                    firstLine: ['Enalapril 5-20mg daily', 'Amlodipine 5-10mg daily'],
                    alternatives: ['Hydrochlorothiazide 12.5-25mg daily', 'Atenolol 25-100mg daily'],
                    lifestyle: ['Reduce salt to <5g/day', '30 min walk daily', 'Weight management', 'Stress reduction'],
                    traditionalEthiopian: ['Moringa leaf powder', 'Tosign (Thymus schimperi) tea', 'Gesho leaf extract']
                },
                pubmedQuery: 'hypertension Ethiopia prevalence treatment',
                openFDAQuery: 'enalapril+amlodipine'
            },
            diabetes_type2: {
                name: { en: 'Type 2 Diabetes', am: 'ዓይነት 2 የስኳር ህመም', om: 'Sukkaara Gosa 2' },
                icd10: 'E11',
                symptoms: ['frequent_urination', 'excessive_thirst', 'extreme_hunger', 'fatigue', 'blurred_vision', 'slow_healing', 'numbness'],
                riskFactors: ['glucose_above_126', 'bmi_above_25', 'age_over_45', 'family_history', 'sedentary_lifestyle'],
                complications: ['kidney_disease', 'blindness', 'amputation', 'heart_disease', 'stroke'],
                labTests: ['Fasting blood glucose', 'HbA1c', 'Oral glucose tolerance test', 'Kidney function'],
                treatment: {
                    firstLine: ['Metformin 500mg 2-3x daily', 'Lifestyle modification'],
                    alternatives: ['Glibenclamide 5mg daily', 'Insulin NPH (as prescribed)'],
                    lifestyle: ['Exercise 30 min daily', 'Reduce refined carbs', 'Eat teff injera instead of white', 'Regular glucose monitoring'],
                    traditionalEthiopian: ['Moringa leaf powder', 'Grawa (Vernonia amygdalina)', 'Koseret tea']
                },
                pubmedQuery: 'diabetes mellitus Ethiopia management',
                openFDAQuery: 'metformin+glibenclamide'
            },
            malaria: {
                name: { en: 'Malaria', am: 'ወባ', om: 'Busaa' },
                icd10: 'B54',
                symptoms: ['fever', 'chills', 'sweating', 'headache', 'muscle_pain', 'fatigue', 'nausea', 'vomiting'],
                riskFactors: ['temperature_above_38', 'rainy_season_jun_sep', 'lowland_area', 'no_bed_net'],
                complications: ['cerebral_malaria', 'severe_anemia', 'organ_failure', 'death'],
                labTests: ['Rapid Diagnostic Test (RDT)', 'Blood smear microscopy', 'Complete blood count'],
                treatment: {
                    firstLine: ['Artemether-Lumefantrine (Coartem) 80/480mg'],
                    alternatives: ['Chloroquine (sensitive strains)', 'Quinine (severe cases)'],
                    lifestyle: ['Sleep under ITN', 'Eliminate standing water', 'Indoor residual spraying', 'Seek early diagnosis'],
                    traditionalEthiopian: ['Neem leaf tea', 'Gesho bark decoction', 'Grawa leaf (bitter)']
                },
                pubmedQuery: 'malaria Ethiopia treatment artemisinin',
                openFDAQuery: 'artemether+lumefantrine'
            },
            tuberculosis: {
                name: { en: 'Tuberculosis', am: 'ሳንባ ነቀርሳ', om: 'Sombisaa' },
                icd10: 'A15',
                symptoms: ['persistent_cough_2weeks', 'coughing_blood', 'night_sweats', 'weight_loss', 'fever', 'chest_pain', 'fatigue'],
                riskFactors: ['cough_above_2weeks', 'night_sweats', 'weight_loss', 'tb_contact', 'hiv_status'],
                complications: ['lung_damage', 'miliary_tb', 'drug_resistant_tb'],
                labTests: ['Sputum smear microscopy', 'GeneXpert MTB/RIF', 'Chest X-ray', 'Tuberculin skin test'],
                treatment: {
                    firstLine: ['DOTS Program: Rifampicin + Isoniazid + Pyrazinamide + Ethambutol'],
                    alternatives: ['MDR-TB regimen (specialized centers)'],
                    lifestyle: ['Complete full 6-month course', 'Good nutrition', 'Adequate rest', 'Respiratory hygiene'],
                    traditionalEthiopian: [] // No proven traditional treatments for TB
                },
                pubmedQuery: 'tuberculosis Ethiopia DOTS treatment outcomes',
                openFDAQuery: 'rifampicin+isoniazid'
            },
            typhoid: {
                name: { en: 'Typhoid Fever', am: 'ታይፎይድ', om: 'Taayifooyidii' },
                icd10: 'A01.0',
                symptoms: ['fever', 'headache', 'abdominal_pain', 'constipation', 'diarrhea', 'rose_spots', 'fatigue'],
                riskFactors: ['contaminated_water', 'poor_sanitation', 'street_food'],
                complications: ['intestinal_perforation', 'internal_bleeding'],
                labTests: ['Widal test', 'Blood culture', 'Stool culture'],
                treatment: {
                    firstLine: ['Ciprofloxacin 500mg 2x daily', 'Ceftriaxone injection'],
                    alternatives: ['Azithromycin 500mg daily'],
                    lifestyle: ['Boil drinking water', 'Wash hands frequently', 'Avoid street food', 'Complete antibiotics'],
                    traditionalEthiopian: []
                },
                pubmedQuery: 'typhoid fever Ethiopia antibiotic resistance',
                openFDAQuery: 'ciprofloxacin+ceftriaxone'
            }
        }
    };
    
    // ============================================
    // API CALL FUNCTIONS
    // ============================================
    
    /**
     * Call Groq API for AI reasoning
     * @param {Object} patientData - Patient vitals and symptoms
     * @returns {Object} AI reasoning results
     */
    async function callGroqAPI(patientData) {
        const lang = localStorage.getItem('lang') || 'en';
        
        // Build the medical prompt
        const prompt = buildMedicalPrompt(patientData, lang);
        
        try {
            const response = await fetch(CONFIG.groqEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.groqAPIKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.groqModel,
                    messages: [
                        {
                            role: 'system',
                            content: `You are an AI medical reasoning assistant for Ethiopian healthcare. 
                            You provide structured differential diagnoses with confidence levels.
                            Always include: possible conditions, reasoning, recommended tests, treatments, 
                            Ethiopian-specific context, traditional medicine options where applicable.
                            Always state: "This is AI-assisted analysis, not a medical diagnosis. Consult a healthcare provider."
                            Respond in ${lang === 'am' ? 'Amharic' : lang === 'om' ? 'Oromo' : 'English'}.
                            Format as JSON with keys: primaryDiagnosis, differentialDiagnoses, reasoning, 
                            recommendedTests, treatments, ethiopianContext, disclaimer.`
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3, // Lower temperature for more factual medical responses
                    max_tokens: 2000,
                    response_format: { type: 'json_object' }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status}`);
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content;
            
            try {
                return JSON.parse(content);
            } catch (e) {
                // If not valid JSON, return raw text
                return { rawResponse: content };
            }
            
        } catch (error) {
            console.error('Groq API error:', error);
            // Return fallback analysis
            return fallbackAnalysis(patientData);
        }
    }
    
    /**
     * Build a comprehensive medical prompt for the AI
     */
    function buildMedicalPrompt(patientData, lang) {
        let prompt = `Analyze the following Ethiopian patient data and provide differential diagnosis:\n\n`;
        
        // Vitals
        prompt += `PATIENT VITALS:\n`;
        if (patientData.systolic) prompt += `- Blood Pressure: ${patientData.systolic}/${patientData.diastolic || '?'} mmHg\n`;
        if (patientData.glucose) prompt += `- Blood Glucose: ${patientData.glucose} mg/dL\n`;
        if (patientData.bmi) prompt += `- BMI: ${patientData.bmi}\n`;
        if (patientData.temperature) prompt += `- Temperature: ${patientData.temperature}°C\n`;
        if (patientData.age) prompt += `- Age: ${patientData.age} years\n`;
        
        // Symptoms
        if (patientData.symptoms && patientData.symptoms.length > 0) {
            prompt += `\nREPORTED SYMPTOMS:\n`;
            patientData.symptoms.forEach(s => prompt += `- ${s.replace(/_/g, ' ')}\n`);
        }
        
        // Duration & Severity
        if (patientData.duration) prompt += `\nDuration: ${patientData.duration}\n`;
        if (patientData.severity) prompt += `\nSeverity (1-10): ${patientData.severity}\n`;
        
        // Ethiopian context
        prompt += `\nETHIOPIAN CONTEXT:\n`;
        prompt += `- Location: Ethiopia (highlands/lowlands)\n`;
        prompt += `- Common diseases: Malaria, TB, Typhoid, Hypertension, Diabetes, Malnutrition\n`;
        prompt += `- Healthcare access: Public health centers, DOTS program for TB, free malaria RDT\n`;
        
        // Instructions
        prompt += `\nPlease provide:
        1. Primary diagnosis with confidence percentage
        2. 2-3 differential diagnoses
        3. Clinical reasoning (explain WHY)
        4. Recommended lab tests
        5. Treatment options (modern and traditional Ethiopian)
        6. Follow-up recommendations
        7. When to seek emergency care`;
        
        return prompt;
    }
    
    /**
     * Search PubMed for evidence
     */
    async function searchPubMed(query) {
        try {
            // Search for article IDs
            const searchUrl = `${CONFIG.pubmedEndpoint}/esearch.fcgi?db=pubmed&retmax=3&retmode=json&term=${encodeURIComponent(query)}&sort=relevance`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();
            
            if (!searchData.esearchresult?.idlist?.length) return [];
            
            // Get summaries
            const ids = searchData.esearchresult.idlist.join(',');
            const summaryUrl = `${CONFIG.pubmedEndpoint}/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
            const summaryResponse = await fetch(summaryUrl);
            const summaryData = await summaryResponse.json();
            
            const articles = [];
            for (const id of searchData.esearchresult.idlist) {
                const article = summaryData.result?.[id];
                if (article) {
                    articles.push({
                        title: article.title,
                        authors: article.authors?.map(a => a.name).join(', '),
                        journal: article.source,
                        pubDate: article.pubdate,
                        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
                    });
                }
            }
            return articles;
        } catch (error) {
            console.error('PubMed search error:', error);
            return [];
        }
    }
    
    /**
     * Search OpenFDA for drug information
     */
    async function searchOpenFDA(drugQuery) {
        try {
            const apiKey = CONFIG.openFDAKey ? `&api_key=${CONFIG.openFDAKey}` : '';
            const url = `${CONFIG.openFDAEndpoint}?search=active_ingredient:${encodeURIComponent(drugQuery)}&limit=3${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.results) {
                return data.results.map(r => ({
                    brandName: r.openfda?.brand_name?.[0] || 'Generic',
                    genericName: r.openfda?.generic_name?.[0] || drugQuery,
                    manufacturer: r.openfda?.manufacturer_name?.[0] || 'Various',
                    indications: r.indications_and_usage?.[0]?.substring(0, 200) || 'See label',
                    warnings: r.warnings?.[0]?.substring(0, 200) || 'See full prescribing information',
                    dosage: r.dosage_and_administration?.[0]?.substring(0, 150) || 'Consult physician'
                }));
            }
            return [];
        } catch (error) {
            console.error('OpenFDA error:', error);
            return [];
        }
    }
    
    // ============================================
    // FALLBACK ANALYSIS (When API is unavailable)
    // ============================================
    function fallbackAnalysis(patientData) {
        const findings = [];
        let totalPenalty = 0;
        
        // Check each disease in knowledge base
        for (const [diseaseId, disease] of Object.entries(medicalKB.diseases)) {
            let riskScore = 0;
            let matchedSymptoms = [];
            let matchedFactors = [];
            
            // Match symptoms
            if (patientData.symptoms && disease.symptoms) {
                disease.symptoms.forEach(symptom => {
                    if (patientData.symptoms.includes(symptom)) {
                        matchedSymptoms.push(symptom);
                        riskScore += 10;
                    }
                });
            }
            
            // Check vital-based risk factors
            if (diseaseId === 'hypertension') {
                if (patientData.systolic >= 140) { riskScore += 30; matchedFactors.push('Systolic ≥140'); }
                else if (patientData.systolic >= 130) { riskScore += 20; matchedFactors.push('Systolic ≥130'); }
                if (patientData.diastolic >= 90) { riskScore += 20; matchedFactors.push('Diastolic ≥90'); }
                if (patientData.age >= 40) { riskScore += 10; matchedFactors.push('Age ≥40'); }
            }
            
            if (diseaseId === 'diabetes_type2') {
                if (patientData.glucose >= 200) { riskScore += 40; matchedFactors.push('Glucose ≥200'); }
                else if (patientData.glucose >= 126) { riskScore += 25; matchedFactors.push('Glucose ≥126'); }
                if (patientData.bmi >= 25) { riskScore += 10; matchedFactors.push('BMI ≥25'); }
            }
            
            if (diseaseId === 'malaria') {
                if (patientData.temperature >= 38) { riskScore += 30; matchedFactors.push('Fever ≥38°C'); }
                const month = new Date().getMonth() + 1;
                if (month >= 6 && month <= 9) { riskScore += 15; matchedFactors.push('Peak malaria season'); }
            }
            
            if (diseaseId === 'tuberculosis') {
                const hasCough = patientData.symptoms?.includes('persistent_cough') || 
                                patientData.symptoms?.includes('cough');
                if (hasCough && patientData.duration === 'weeks') { riskScore += 30; matchedFactors.push('Cough >2 weeks'); }
                if (patientData.symptoms?.includes('night_sweats')) { riskScore += 15; }
            }
            
            riskScore = Math.min(100, riskScore);
            
            if (riskScore >= 15) {
                const level = riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
                findings.push({
                    disease: diseaseId,
                    name: disease.name,
                    icd10: disease.icd10,
                    risk: riskScore,
                    level: level,
                    matchedSymptoms: matchedSymptoms,
                    matchedFactors: matchedFactors,
                    treatment: disease.treatment,
                    complications: disease.complications,
                    labTests: disease.labTests
                });
                totalPenalty += level === 'high' ? 25 : level === 'medium' ? 12 : 5;
            }
        }
        
        // Sort by risk
        findings.sort((a, b) => b.risk - a.risk);
        
        return {
            score: Math.max(0, 100 - totalPenalty),
            primaryDiagnosis: findings[0] || null,
            differentialDiagnoses: findings.slice(1, 4),
            findings: findings,
            reasoning: "⚠️ Groq API unavailable - using offline medical knowledge base. Results based on Ethiopian epidemiological data and clinical guidelines.",
            disclaimer: "This is AI-assisted analysis, not a medical diagnosis. Consult a healthcare provider.",
            source: 'offline-knowledge-base'
        };
    }
    
    // ============================================
    // MAIN ANALYSIS FUNCTION
    // ============================================
    async function analyzePatient(patientData) {
        let aiResult;
        let evidenceArticles = [];
        let drugInfo = [];
        
        // Try Groq API first
        if (CONFIG.groqAPIKey && CONFIG.groqAPIKey !== 'YOUR_GROQ_API_KEY_HERE') {
            aiResult = await callGroqAPI(patientData);
        } else {
            // Use fallback
            console.warn('⚠️ No Groq API key set - using offline analysis');
            aiResult = fallbackAnalysis(patientData);
        }
        
        // Get evidence from PubMed
        if (aiResult.primaryDiagnosis?.disease) {
            const disease = medicalKB.diseases[aiResult.primaryDiagnosis.disease];
            if (disease?.pubmedQuery) {
                evidenceArticles = await searchPubMed(disease.pubmedQuery);
            }
        } else if (aiResult.findings?.[0]) {
            const disease = medicalKB.diseases[aiResult.findings[0].disease];
            if (disease?.pubmedQuery) {
                evidenceArticles = await searchPubMed(disease.pubmedQuery);
            }
        }
        
        // Get drug information from OpenFDA
        if (aiResult.primaryDiagnosis?.treatment?.firstLine?.[0]) {
            const drug = aiResult.primaryDiagnosis.treatment.firstLine[0].split(' ')[0];
            drugInfo = await searchOpenFDA(drug);
        } else if (aiResult.findings?.[0]?.treatment?.firstLine?.[0]) {
            const drug = aiResult.findings[0].treatment.firstLine[0].split(' ')[0];
            drugInfo = await searchOpenFDA(drug);
        }
        
        // Combine results
        return {
            ...aiResult,
            evidence: {
                pubmedArticles: evidenceArticles,
                drugInformation: drugInfo,
                ethiopianStats: CONFIG.ethiopianHealthStats
            },
            timestamp: Date.now(),
            generatedBy: CONFIG.groqAPIKey !== 'YOUR_GROQ_API_KEY_HERE' ? 'Groq AI (llama-3.3-70b)' : 'Offline Knowledge Base'
        };
    }
    
    /**
     * Get Ethiopian health statistics
     */
    function getEthiopianStats() {
        return CONFIG.ethiopianHealthStats;
    }
    
    /**
     * Get disease information from knowledge base
     */
    function getDiseaseInfo(diseaseId) {
        return medicalKB.diseases[diseaseId] || null;
    }
    
    /**
     * Check if Groq API is configured
     */
    function isAPIConfigured() {
        return CONFIG.groqAPIKey && CONFIG.groqAPIKey !== 'YOUR_GROQ_API_KEY_HERE';
    }
    
    // Public API
    return {
        analyzePatient,
        getEthiopianStats,
        getDiseaseInfo,
        isAPIConfigured,
        searchPubMed,
        searchOpenFDA
    };
})();

console.log('✅ Grok Agent initialized (Groq API + PubMed + OpenFDA)');
console.log('🔑 API configured:', GrokAgent.isAPIConfigured() ? 'YES ✅' : 'NO - Using offline mode ⚠️');