// ============================================
// ETHIOHEALTH AI PRO - MULTILINGUAL (i18n)
// ============================================

const I18n = (function() {
    'use strict';
    
    // Complete translations for all languages
    const translations = {
        en: {
            // App
            app_name: "EthioHealth AI Pro",
            ai_agent_active: "AI Agent Active",
            
            // Tabs
            home: "Home",
            symptoms: "Symptoms",
            traditional: "Traditional",
            voice: "Voice",
            settings: "Settings",
            
            // Home
            health_score: "Health Score",
            last_updated: "Updated just now",
            quick_check: "Quick Health Check",
            systolic: "Systolic BP",
            diastolic: "Diastolic BP",
            glucose: "Blood Sugar",
            bmi: "BMI",
            temp: "Temperature",
            age: "Age",
            analyze_now: "Analyze Now",
            risk_overview: "Risk Overview",
            enter_vitals: "Enter your vitals and analyze to see results",
            trends: "Health Trends",
            
            // Analysis Results
            hypertension_risk: "Hypertension Risk",
            diabetes_risk: "Diabetes Risk",
            malaria_risk: "Malaria Risk",
            high_risk: "HIGH RISK",
            medium_risk: "MEDIUM RISK",
            low_risk: "LOW RISK",
            recommendations: "Recommendations",
            reduce_salt: "Reduce salt intake. Monitor BP weekly at health center.",
            exercise_daily: "Exercise 30 min daily. Reduce sugary foods and refined carbs.",
            use_nets: "Sleep under treated nets. Seek testing if fever persists.",
            
            // Symptoms
            holistic_symptoms: "Holistic Symptom Checker",
            body: "Body",
            mind: "Mind",
            spirit: "Spirit",
            social: "Social",
            duration: "Duration",
            severity: "Severity (1-10)",
            notes: "Additional Notes",
            analyze_symptoms: "AI Diagnose Symptoms",
            analysis_results: "Analysis Results",
            few_hours: "Few hours",
            one_day: "1 day",
            two_three_days: "2-3 days",
            one_week: "1 week",
            several_weeks: "Several weeks",
            months: "Months",
            
            // Body symptoms
            headache: "Headache",
            dizziness: "Dizziness",
            fever: "Fever",
            chills: "Chills",
            fatigue: "Fatigue",
            nausea: "Nausea",
            vomiting: "Vomiting",
            diarrhea: "Diarrhea",
            chest_pain: "Chest Pain",
            abdominal_pain: "Abdominal Pain",
            back_pain: "Back Pain",
            joint_pain: "Joint Pain",
            muscle_pain: "Muscle Pain",
            cough: "Cough",
            sore_throat: "Sore Throat",
            shortness_breath: "Shortness of Breath",
            rapid_heartbeat: "Rapid Heartbeat",
            swelling: "Swelling",
            rash: "Rash",
            weight_loss: "Unexplained Weight Loss",
            night_sweats: "Night Sweats",
            vision_problems: "Vision Problems",
            numbness: "Numbness/Tingling",
            
            // Mind symptoms
            anxiety: "Anxiety",
            depression: "Depression",
            stress: "High Stress",
            insomnia: "Insomnia",
            poor_concentration: "Poor Concentration",
            memory_loss: "Memory Problems",
            mood_swings: "Mood Swings",
            irritability: "Irritability",
            panic_attacks: "Panic Attacks",
            brain_fog: "Brain Fog",
            restlessness: "Restlessness",
            hopelessness: "Hopelessness",
            
            // Spirit symptoms
            lack_purpose: "Lack of Purpose",
            spiritual_distress: "Spiritual Distress",
            loneliness: "Loneliness",
            grief: "Grief",
            fear: "Fear",
            guilt: "Guilt",
            shame: "Shame",
            emptiness: "Emptiness",
            disconnection: "Feeling Disconnected",
            
            // Social symptoms
            isolation: "Social Isolation",
            family_conflict: "Family Conflict",
            financial_stress: "Financial Stress",
            work_stress: "Work-related Stress",
            discrimination: "Discrimination",
            lack_support: "Lack of Support System",
            housing_issues: "Housing Issues",
            food_insecurity: "Food Insecurity",
            
            // Traditional Medicine
            traditional_medicine: "Ethiopian Traditional Medicine",
            search_herbs: "Search herbs...",
            safety_warnings: "Safety & Interactions",
            select_herb: "Select a herb to see interactions with modern medicines",
            scientific_name: "Scientific Name",
            uses: "Uses",
            preparation: "Preparation",
            dosage: "Dosage",
            warnings: "Warnings",
            regions: "Growing Regions",
            category: "Category",
            
            // Voice
            voice_assistant: "Voice Health Assistant",
            tap_mic: "Tap the microphone and speak",
            ready: "Ready to listen",
            start_listening: "Start Listening",
            stop_listening: "Stop Listening",
            listening: "Listening...",
            processing: "Processing...",
            voice_text_appear: "Your speech will appear here...",
            agent_response: "Agent Response:",
            voice_history: "Voice Command History",
            no_history: "No voice commands yet",
            heard: "Heard",
            
            // Settings
            language_settings: "Language Settings",
            profile_settings: "Profile",
            notification_settings: "Notifications",
            name: "Name",
            location: "Location",
            save_profile: "Save Profile",
            health_reminders: "Health Reminders",
            voice_feedback: "Voice Feedback",
            emergency_alerts: "Emergency Alerts",
            data_management: "Data Management",
            export_data: "Export Health Data",
            import_data: "Import Health Data",
            clear_data: "Clear All Data",
            about: "About",
            
            // Emergency
            emergency_sos: "Emergency SOS",
            emergency_message: "I need emergency medical assistance. My location:",
            call_emergency: "Call 907 (Emergency)",
            share_location: "Share Location with Contacts",
            emergency_contacts: "Emergency Contacts",
            add_contact: "Add Emergency Contact",
            no_emergency_contacts: "No emergency contacts set",
            
            // General
            loading: "Loading...",
            save: "Save",
            cancel: "Cancel",
            close: "Close",
            confirm: "Confirm",
            delete: "Delete",
            edit: "Edit",
            search: "Search",
            no_results: "No results found",
            try_again: "Try Again",
            success: "Success",
            error: "Error",
            warning: "Warning",
            info: "Information",
            
            // Notifications
            new_analysis: "New Health Analysis Available",
            reminder_bp: "Time to check your blood pressure",
            reminder_glucose: "Time to check your blood sugar",
            reminder_water: "Remember to drink water",
            reminder_medication: "Time for your medication",
            
            // Disease Advice
            hypertension_advice: "Your blood pressure is elevated. Reduce salt intake, exercise regularly, and monitor weekly at your health center.",
            diabetes_advice: "Your blood sugar levels are concerning. Exercise 30 minutes daily, reduce refined carbohydrates, and consult your doctor.",
            malaria_advice: "Malaria is a risk in many Ethiopian regions. Use insecticide-treated nets, eliminate standing water, and seek immediate testing if fever develops.",
            tb_advice: "Persistent cough may indicate TB. Free testing and treatment is available at Ethiopian government health centers through the DOTS program.",
            general_advice: "Based on your symptoms, I recommend visiting a health center for proper diagnosis. Ethiopia has over 3,500 public health facilities available.",
            
            // Confirmation dialogs
            confirm_clear_data: "Are you sure you want to clear all health data? This cannot be undone.",
            confirm_emergency: "Do you want to call emergency services (907)?",
            confirm_delete_contact: "Delete this emergency contact?",
            profile_saved: "Profile saved successfully!",
            data_exported: "Health data exported successfully!",
            data_cleared: "All health data cleared successfully!"
        },
        
        am: {
            // App (Amharic)
            app_name: "ኢትዮሄልዝ AI ፕሮ",
            ai_agent_active: "AI ወኪል ንቁ ነው",
            
            // Tabs
            home: "መነሻ",
            symptoms: "ምልክቶች",
            traditional: "ባህላዊ",
            voice: "ድምጽ",
            settings: "ቅንብሮች",
            
            // Home
            health_score: "የጤና ውጤት",
            last_updated: "አሁን ተዘምኗል",
            quick_check: "ፈጣን የጤና ምርመራ",
            systolic: "ሲስቶሊክ የደም ግፊት",
            diastolic: "ዳያስቶሊክ የደም ግፊት",
            glucose: "የስኳር መጠን",
            bmi: "BMI",
            temp: "ሙቀት",
            age: "እድሜ",
            analyze_now: "አሁን ይመርምሩ",
            risk_overview: "የአደጋ አጠቃላይ እይታ",
            enter_vitals: "ውጤቶችን ለማየት የጤና መረጃዎን ያስገቡ",
            trends: "የጤና አዝማሚያዎች",
            
            // Analysis
            hypertension_risk: "የደም ግፊት አደጋ",
            diabetes_risk: "የስኳር በሽታ አደጋ",
            malaria_risk: "የወባ አደጋ",
            high_risk: "ከፍተኛ አደጋ",
            medium_risk: "መካከለኛ አደጋ",
            low_risk: "ዝቅተኛ አደጋ",
            recommendations: "ምክሮች",
            reduce_salt: "የጨው አወሳሰድን ይቀንሱ። በየሳምንቱ የደም ግፊትዎን ይመርምሩ።",
            exercise_daily: "በየቀኑ 30 ደቂቃ የአካል ብቃት እንቅስቃሴ ያድርጉ።",
            use_nets: "በታከመ አጎበር ስር ይተኙ። ትኩሳት ከተሰማዎ ምርመራ ይፈልጉ።",
            
            // Symptoms
            holistic_symptoms: "አጠቃላይ የምልክት ምርመራ",
            body: "አካል",
            mind: "አእምሮ",
            spirit: "መንፈስ",
            social: "ማህበራዊ",
            duration: "ቆይታ",
            severity: "ከባድነት (1-10)",
            notes: "ተጨማሪ ማስታወሻዎች",
            analyze_symptoms: "AI ምልክቶችን ይመርምር",
            analysis_results: "የምርመራ ውጤቶች",
            few_hours: "ጥቂት ሰዓታት",
            one_day: "1 ቀን",
            two_three_days: "2-3 ቀናት",
            one_week: "1 ሳምንት",
            several_weeks: "በርካታ ሳምንታት",
            months: "ወራት",
            
            // Body symptoms (Amharic)
            headache: "ራስ ምታት",
            dizziness: "ማዞር",
            fever: "ትኩሳት",
            chills: "ብርድ ብርድ",
            fatigue: "ድካም",
            nausea: "ማቅለሽለሽ",
            vomiting: "ማስታወክ",
            diarrhea: "ተቅማጥ",
            chest_pain: "የደረት ህመም",
            abdominal_pain: "የሆድ ህመም",
            back_pain: "የጀርባ ህመም",
            joint_pain: "የመገጣጠሚያ ህመም",
            muscle_pain: "የጡንቻ ህመም",
            cough: "ሳል",
            sore_throat: "የጉሮሮ ህመም",
            shortness_breath: "የትንፋሽ ማጠር",
            rapid_heartbeat: "ፈጣን የልብ ምት",
            swelling: "እብጠት",
            rash: "ሽፍታ",
            weight_loss: "ክብደት መቀነስ",
            night_sweats: "የሌሊት ላብ",
            vision_problems: "የማየት ችግር",
            numbness: "መደንዘዝ",
            
            // Mind symptoms (Amharic)
            anxiety: "ጭንቀት",
            depression: "ድብርት",
            stress: "ከፍተኛ ጭንቀት",
            insomnia: "እንቅልፍ ማጣት",
            poor_concentration: "የማተኮር ችግር",
            memory_loss: "የማስታወስ ችግር",
            mood_swings: "የስሜት መለዋወጥ",
            irritability: "ቁጣ",
            panic_attacks: "የመረበሽ ጥቃት",
            brain_fog: "የአእምሮ ጭጋግ",
            restlessness: "እረፍት ማጣት",
            hopelessness: "ተስፋ መቁረጥ",
            
            // Spirit symptoms (Amharic)
            lack_purpose: "ዓላማ ማጣት",
            spiritual_distress: "መንፈሳዊ ጭንቀት",
            loneliness: "ብቸኝነት",
            grief: "ሀዘን",
            fear: "ፍርሃት",
            guilt: "የጥፋተኝነት ስሜት",
            shame: "ሀፍረት",
            emptiness: "ባዶነት",
            disconnection: "የመለየት ስሜት",
            
            // Social symptoms (Amharic)
            isolation: "ማህበራዊ መገለል",
            family_conflict: "የቤተሰብ ግጭት",
            financial_stress: "የገንዘብ ጭንቀት",
            work_stress: "ከስራ ጋር የተያያዘ ጭንቀት",
            discrimination: "መድልዎ",
            lack_support: "የድጋፍ እጦት",
            housing_issues: "የመኖሪያ ቤት ችግር",
            food_insecurity: "የምግብ እጦት",
            
            // Traditional Medicine (Amharic)
            traditional_medicine: "የኢትዮጵያ ባህላዊ ሕክምና",
            search_herbs: "እፅዋትን ይፈልጉ...",
            safety_warnings: "የደህንነት ማስጠንቀቂያዎች",
            select_herb: "ከዘመናዊ መድኃኒቶች ጋር ያለውን ግንኙነት ለማየት እፅዋትን ይምረጡ",
            scientific_name: "ሳይንሳዊ ስም",
            uses: "ጥቅሞች",
            preparation: "አዘገጃጀት",
            dosage: "መጠን",
            warnings: "ማስጠንቀቂያዎች",
            regions: "የሚበቅልባቸው አካባቢዎች",
            category: "ምድብ",
            
            // Voice (Amharic)
            voice_assistant: "የድምጽ ጤና ረዳት",
            tap_mic: "ማይክሮፎኑን ይንኩ እና ይናገሩ",
            ready: "ለማዳመጥ ዝግጁ",
            start_listening: "ማዳመጥ ጀምር",
            stop_listening: "ማዳመጥ አቁም",
            listening: "በማዳመጥ ላይ...",
            processing: "በማስኬድ ላይ...",
            voice_text_appear: "ንግግርዎ እዚህ ይታያል...",
            agent_response: "የወኪል ምላሽ:",
            voice_history: "የድምጽ ትዕዛዝ ታሪክ",
            no_history: "እስካሁን ምንም የድምጽ ትዕዛዞች የሉም",
            heard: "ተሰምቷል",
            
            // Settings (Amharic)
            language_settings: "የቋንቋ ቅንብሮች",
            profile_settings: "መገለጫ",
            notification_settings: "ማሳወቂያዎች",
            name: "ስም",
            location: "አድራሻ",
            save_profile: "መገለጫ አስቀምጥ",
            health_reminders: "የጤና አስታዋሾች",
            voice_feedback: "የድምጽ ምላሽ",
            emergency_alerts: "የአደጋ ጊዜ ማስጠንቀቂያዎች",
            data_management: "የውሂብ አስተዳደር",
            export_data: "የጤና ውሂብ ላክ",
            import_data: "የጤና ውሂብ አስገባ",
            clear_data: "ሁሉንም ውሂብ አጽዳ",
            about: "ስለ",
            
            // Emergency (Amharic)
            emergency_sos: "የአደጋ ጊዜ SOS",
            emergency_message: "አስቸኳይ የሕክምና እርዳታ እፈልጋለሁ። ያለሁበት ቦታ:",
            call_emergency: "907 ይደውሉ (ድንገተኛ)",
            share_location: "አካባቢን ለአደጋ ጊዜ እውቂያዎች ያጋሩ",
            emergency_contacts: "የአደጋ ጊዜ እውቂያዎች",
            add_contact: "አዲስ የአደጋ ጊዜ እውቂያ ያክሉ",
            no_emergency_contacts: "ምንም የአደጋ ጊዜ እውቂያዎች አልተቀመጡም",
            
            // General (Amharic)
            loading: "በመጫን ላይ...",
            save: "አስቀምጥ",
            cancel: "ሰርዝ",
            close: "ዝጋ",
            confirm: "አረጋግጥ",
            delete: "ሰርዝ",
            edit: "አስተካክል",
            search: "ፈልግ",
            no_results: "ምንም ውጤት አልተገኘም",
            try_again: "እንደገና ሞክር",
            success: "ተሳክቷል",
            error: "ስህተት",
            warning: "ማስጠንቀቂያ",
            info: "መረጃ",
            
            // Disease Advice (Amharic)
            hypertension_advice: "የደም ግፊትዎ ከፍ ያለ ነው። የጨው አወሳሰድን ይቀንሱ፣ አዘውትረው የአካል ብቃት እንቅስቃሴ ያድርጉ፣ እና በየሳምንቱ በጤና ጣቢያ ይመርምሩ።",
            diabetes_advice: "የስኳር መጠንዎ አሳሳቢ ነው። በየቀኑ 30 ደቂቃ የአካል ብቃት እንቅስቃሴ ያድርጉ፣ የተቀነባበሩ ካርቦሃይድሬቶችን ይቀንሱ፣ እና ሐኪምዎን ያማክሩ።",
            malaria_advice: "ወባ በብዙ የኢትዮጵያ አካባቢዎች አደጋ ነው። በታከመ አጎበር ይተኙ፣ የቆመ ውሃ ያስወግዱ፣ እና ትኩሳት ከተሰማዎ ወዲያውኑ ምርመራ ይፈልጉ።",
            tb_advice: "የማያቋርጥ ሳል ሳንባ ነቀርሳን ሊያመለክት ይችላል። በ DOTS ፕሮግራም በኩል በኢትዮጵያ መንግሥት የጤና ጣቢያዎች ነፃ ምርመራ እና ሕክምና ይገኛል።",
            general_advice: "በምልክቶችዎ መሰረት፣ ለትክክለኛ ምርመራ ወደ ጤና ጣቢያ እንዲሄዱ እመክራለሁ። ኢትዮጵያ ከ3,500 በላይ የሕዝብ ጤና ተቋማት አሏት።",
            
            // Confirmation (Amharic)
            confirm_clear_data: "ሁሉንም የጤና ውሂብ ማጽዳትዎን እርግጠኛ ነዎት? ይህ ሊቀለበስ አይችልም።",
            confirm_emergency: "የአደጋ ጊዜ አገልግሎት (907) መደወል ይፈልጋሉ?",
            confirm_delete_contact: "ይህን የአደጋ ጊዜ እውቂያ ይሰረዝ?",
            profile_saved: "መገለጫ በተሳካ ሁኔታ ተቀምጧል!",
            data_exported: "የጤና ውሂብ በተሳካ ሁኔታ ተልኳል!",
            data_cleared: "ሁሉም የጤና ውሂብ በተሳካ ሁኔታ ተጠርጓል!"
        },
        
        om: {
            // App (Oromo)
            app_name: "EthioHealth AI Pro",
            ai_agent_active: "AI Agent Active ta'aa jira",
            
            // Tabs
            home: "Mana",
            symptoms: "Mallattoolee",
            traditional: "Aadaa",
            voice: "Sagalee",
            settings: "Sajoo",
            
            // Home
            health_score: "Sadarkaa Fayyaa",
            last_updated: "Amma yeroo har'oomfame",
            quick_check: "Qormaata Fayyaa Saffisaa",
            systolic: "Dhiibbaa Dhiigaa Sistoolik",
            diastolic: "Dhiibbaa Dhiigaa Daayastoolik",
            glucose: "Sukkaara Dhiigaa",
            bmi: "BMI",
            temp: "Ho'ina",
            age: "Umurii",
            analyze_now: "Amma Xiinxali",
            risk_overview: "Ilaalcha Baloo",
            enter_vitals: "Bu'aa argachuuf odeeffannoo fayyaa kee galchi",
            trends: "Adeemsa Fayyaa",
            
            // Analysis
            hypertension_risk: "Baloo Dhiibbaa Dhiigaa",
            diabetes_risk: "Baloo Sukkaara",
            malaria_risk: "Baloo Busaa",
            high_risk: "BALOO OL'AANAA",
            medium_risk: "BALOO GIDDUGALEESSAA",
            low_risk: "BALOO GADII",
            recommendations: "Gorsa",
            
            // Symptoms
            holistic_symptoms: "Mallattoolee Guutuu",
            body: "Qaama",
            mind: "Sammuu",
            spirit: "Hafuura",
            social: "Hawaasummaa",
            duration: "Yeroo Turmaataa",
            severity: "Cimina (1-10)",
            notes: "Yaadannoo Dabalataa",
            analyze_symptoms: "AI Mallattoolee Xiinxali",
            analysis_results: "Bu'aa Xiinxalaa",
            few_hours: "Sa'aatii muraasa",
            one_day: "Guyyaa 1",
            two_three_days: "Guyyaa 2-3",
            one_week: "Torban 1",
            several_weeks: "Torbanoota hedduu",
            months: "Ji'oota",
            
            // Body symptoms (Oromo)
            headache: "Mataa Bowwu",
            dizziness: "Maraammartuu",
            fever: "Ho'ina Qaamaa",
            chills: "Qorramuu",
            fatigue: "Dadhabbii",
            nausea: "Lololaa",
            vomiting: "Hooqisisuu",
            diarrhea: "Garaa Kaasaa",
            chest_pain: "Dhukkubbii Laphee",
            abdominal_pain: "Dhukkubbii Garaa",
            cough: "Qufaa",
            sore_throat: "Dhukkubbii Kokkee",
            
            // Mind symptoms (Oromo)
            anxiety: "Yaaddoo",
            depression: "Gadda",
            stress: "Dhiphina Garmalee",
            insomnia: "Hirriba Dhabuu",
            poor_concentration: "Xiyyeeffannaa Dhabuu",
            
            // Traditional Medicine (Oromo)
            traditional_medicine: "Qoricha Aadaa Itoophiyaa",
            search_herbs: "Margoota barbaadi...",
            safety_warnings: "Akeekkachiisa Nageenyaa",
            scientific_name: "Maqaa Saayinsii",
            uses: "Faayidaa",
            preparation: "Qophii",
            dosage: "Hammamtaa",
            warnings: "Akeekkachiisa",
            
            // Voice (Oromo)
            voice_assistant: "Gargaaraa Sagalee Fayyaa",
            tap_mic: "Maayikiroofoonii tuqiitii dubbadhu",
            ready: "Dhaggeeffachuuf qophaa'e",
            start_listening: "Dhaggeeffachuu Jalqabi",
            stop_listening: "Dhaggeeffachuu Dhaabi",
            listening: "Dhaggeeffachaa jira...",
            processing: "Adeessaa jira...",
            
            // Settings (Oromo)
            language_settings: "Sajoo Afaanii",
            profile_settings: "Profaayilii",
            notification_settings: "Beeksisoota",
            name: "Maqaa",
            location: "Bakka",
            save_profile: "Profaayilii Olkaa'i",
            
            // Emergency (Oromo)
            emergency_sos: "Tasgabbiilee SOS",
            call_emergency: "907 Bilbili (Tasgabbiilee)",
            share_location: "Bakka jirtan qoodi",
            
            // General (Oromo)
            loading: "Fe'aa jira...",
            save: "Olkaa'i",
            cancel: "Haqi",
            close: "Cufi",
            confirm: "Mirkaneessi",
            delete: "Haqi",
            search: "Barbaadi",
            no_results: "Bu'aan hin argamne",
            try_again: "Irra deebi'ii yaali",
            success: "Milkaa'e",
            error: "Dogoggora",
            warning: "Akeekkachiisa",
            info: "Odeeffannoo",
            
            // Disease Advice (Oromo)
            hypertension_advice: "Dhiibbaan dhiigaa kee ol'aanaa dha. Soogidda hir'isi, yeroo hunda socho'i, torban torbaniin buufata fayyaa kee keessatti ilaali.",
            diabetes_advice: "Sukkaari dhiigaa kee yaaddoo dha. Guyyaa guyyaadhaan daqiiqaa 30 socho'i, nyaata sukkaara qabu hir'isi.",
            malaria_advice: "Busaan naannoo Itoophiyaa hedduu keessatti baloo dha. Saaftuu busaa fayyadamuu, bishaan dhaabatuu balleessi.",
            general_advice: "Mallattoolee kee irratti hundaa'un, buufata fayyaa dhaquun qormaata sirrii argachuuf gorsa."
        }
    };
    
    // Initialize i18next
    i18next.use(i18nextBrowserLanguageDetector).init({
        resources: {
            en: { translation: translations.en },
            am: { translation: translations.am },
            om: { translation: translations.om }
        },
        lng: localStorage.getItem('lang') || 'en',
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        interpolation: {
            escapeValue: false
        }
    }, function(err, t) {
        if (err) {
            console.error('i18n initialization error:', err);
        }
        I18n.updateDirection();
        I18n.applyTranslations();
    });
    
    const i18n = {
        /**
         * Get translation
         */
        t: function(key, options = {}) {
            return i18next.t(key, options);
        },
        
        /**
         * Change language
         */
        changeLanguage: function(lang) {
            i18next.changeLanguage(lang, function() {
                localStorage.setItem('lang', lang);
                i18n.updateDirection();
                i18n.applyTranslations();
                
                // Save to native if available
                if (window.Bridge && Bridge.savePreference) {
                    Bridge.savePreference('language', lang);
                }
                
                // Update all dynamic content
                if (typeof App !== 'undefined' && App.onLanguageChanged) {
                    App.onLanguageChanged(lang);
                }
                
                console.log('Language changed to:', lang);
            });
        },
        
        /**
         * Get current language
         */
        getCurrentLanguage: function() {
            return i18next.language || 'en';
        },
        
        /**
         * Update document direction
         */
        updateDirection: function() {
            const lang = i18n.getCurrentLanguage();
            const rtlLanguages = ['am']; // Amharic is RTL
            
            if (rtlLanguages.includes(lang)) {
                document.documentElement.setAttribute('dir', 'rtl');
                document.body.classList.add('rtl');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.body.classList.remove('rtl');
            }
        },
        
        /**
         * Apply translations to all elements with data-i18n attribute
         */
        applyTranslations: function() {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (key) {
                    // Check if it's a placeholder
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.setAttribute('placeholder', i18next.t(key));
                    } else {
                        element.textContent = i18next.t(key);
                    }
                }
            });
            
            // Update language switch button
            const langText = document.getElementById('currentLangText');
            if (langText) {
                const currentLang = i18n.getCurrentLanguage();
                const langNames = { en: 'EN', am: 'አማ', om: 'OM' };
                langText.textContent = langNames[currentLang] || 'EN';
            }
        },
        
        /**
         * Get available languages
         */
        getAvailableLanguages: function() {
            return [
                { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
                { code: 'am', name: 'Amharic', flag: '🇪🇹', nativeName: 'አማርኛ' },
                { code: 'om', name: 'Oromo', flag: '🇪🇹', nativeName: 'Afaan Oromoo' }
            ];
        }
    };
    
    console.log('✅ i18n initialized');
    return i18n;
})();