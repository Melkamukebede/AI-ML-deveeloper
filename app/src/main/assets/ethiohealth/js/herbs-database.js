// ============================================
// ETHIOPIAN TRADITIONAL MEDICINE DATABASE
// Complete with translations for EN/AM/OM
// ============================================

const HerbDatabase = {
    herbs: [
        {
            id: 'tena_adam',
            category: ['respiratory', 'digestive', 'skin'],
            names: {
                en: 'Tena Adam',
                am: 'ጤና አዳም',
                om: 'Tena Adam'
            },
            scientific: 'Ruta chalepensis',
            family: 'Rutaceae',
            icon: '🌿',
            images: 'tena-adam.jpg',
            description: {
                en: 'One of the most widely used medicinal plants in Ethiopia. Known as "Health of Adam", it grows commonly in Ethiopian highlands and gardens.',
                am: 'በኢትዮጵያ ውስጥ በስፋት ጥቅም ላይ ከሚውሉት የመድኃኒት ተክሎች አንዱ። "የአዳም ጤና" በመባል የሚታወቀው ይህ ተክል በኢትዮጵያ ደጋማ አካባቢዎች እና በአትክልት ስፍራዎች በብዛት ይበቅላል።',
                om: 'Biqiltuu qorichummaa Itoophiyaa keessatti bal\'inaan fayyadamamu keessaa tokko. "Fayyaa Adam" jedhamuun beekama, Itoophiyaa keessatti iddoo olka\'aa fi mandaroota keessatti biqila.'
            },
            parts_used: {
                en: 'Leaves, stems, flowers',
                am: 'ቅጠሎች፣ ግንዶች፣ አበቦች',
                om: 'Baala, hundee, daraaraa'
            },
            uses: {
                en: [
                    'Stomach pain and digestive issues',
                    'Headache and migraine',
                    'Fever and common cold',
                    'Cough and respiratory infections',
                    'Ear infections',
                    'Intestinal parasites/worms',
                    'Skin conditions and wounds',
                    'Eye infections (diluted)',
                    'Menstrual cramps',
                    'Anxiety and nervous tension'
                ],
                am: [
                    'የሆድ ህመም እና የምግብ መፈጨት ችግሮች',
                    'ራስ ምታት እና ማይግሬን',
                    'ትኩሳት እና ጉንፋን',
                    'ሳል እና የመተንፈሻ ኢንፌክሽኖች',
                    'የጆሮ ኢንፌክሽኖች',
                    'የአንጀት ትሎች',
                    'የቆዳ ችግሮች እና ቁስሎች',
                    'የአይን ኢንፌክሽኖች (የተቀላቀለ)',
                    'የወር አበባ ህመም',
                    'ጭንቀት እና የነርቭ ውጥረት'
                ],
                om: [
                    'Dhukkubbii garaa fi rakkoolee bullaa\'insa nyaataa',
                    'Mataa bowwuu fi migraine',
                    'Ho\'ina qaamaa fi qufaa',
                    'Qufaa fi infekshinii hargansuu',
                    'Infekshinii gurraa',
                    'Raammoo garaa',
                    'Rakkoolee gogaa fi madaa',
                    'Infekshinii ijaa (bishaanin bulbulame)',
                    'Cimbiicee laguu',
                    'Yaaddoo fi dhiphina narvii'
                ]
            },
            preparations: {
                en: [
                    {
                        method: 'Tea/Infusion',
                        directions: 'Boil 5-10 fresh or dried leaves in 2 cups of water for 10 minutes. Strain and drink warm.',
                        dosage: '1 cup, 2-3 times daily after meals',
                        duration: 'Not more than 7 consecutive days'
                    },
                    {
                        method: 'Steam Inhalation',
                        directions: 'Add handful of fresh leaves to boiling water. Inhale steam covered with towel for 5-10 minutes.',
                        dosage: '1-2 times daily',
                        duration: 'As needed for respiratory symptoms'
                    },
                    {
                        method: 'Poultice/Paste',
                        directions: 'Crush fresh leaves into paste. Apply directly to skin wounds, rashes, or infected areas.',
                        dosage: 'Apply thin layer, cover with clean cloth',
                        duration: 'Change every 8-12 hours'
                    }
                ],
                am: [
                    {
                        method: 'ሻይ/ቅመም',
                        directions: '5-10 ትኩስ ወይም ደረቅ ቅጠሎችን በ2 ኩባያ ውሃ ውስጥ ለ10 ደቂቃ ቀቅለው ያጣሩና በሙቀት ይጠጡ።',
                        dosage: '1 ኩባያ፣ በቀን 2-3 ጊዜ ከምግብ በኋላ',
                        duration: 'ከ7 ተከታታይ ቀናት መብለጥ የለበትም'
                    },
                    {
                        method: 'የእንፋሎት መተንፈስ',
                        directions: 'አንድ እፍኝ ትኩስ ቅጠሎችን በፈላ ውሃ ውስጥ ጨምረው በፎጣ ተሸፍነው ለ5-10 ደቂቃ እንፋሎቱን ይተንፍሱ።',
                        dosage: 'በቀን 1-2 ጊዜ',
                        duration: 'ለመተንፈሻ ምልክቶች እንደአስፈላጊነቱ'
                    }
                ],
                om: [
                    {
                        method: 'Shaayii/Dawaa',
                        directions: 'Baala 5-10 haaraa ykn gogaa bishaan 2 keessatti daqiiqaa 10 danfisi. Calaliitii o\'aa dhugi.',
                        dosage: 'Kubbaayaa 1, guyyaatti 2-3 yeroo nyaata booda',
                        duration: 'Guyyoota 7 walitti aananii caalaa hin ta\'u'
                    }
                ]
            },
            warnings: {
                en: [
                    'Avoid during pregnancy (may cause uterine contractions)',
                    'Avoid with blood thinners (Warfarin, Aspirin)',
                    'May cause photosensitivity - avoid direct sunlight after use',
                    'Not for children under 5 years',
                    'May interact with blood pressure medications',
                    'Stop use 2 weeks before any surgery'
                ],
                am: [
                    'በእርግዝና ወቅት አይጠቀሙ (የማህፀን መኮማተር ሊያስከትል ይችላል)',
                    'ደም ከሚያቀጭኑ መድሃኒቶች (ዋርፋሪን፣ አስፕሪን) ጋር አይጠቀሙ',
                    'ለፀሀይ ብርሀን ከፍተኛ ስሜትን ሊያስከትል ይችላል',
                    'ከ5 አመት በታች ላሉ ህፃናት አይጠቀሙ',
                    'ከደም ግፊት መድሃኒቶች ጋር መስተጋብር ሊፈጥር ይችላል',
                    'ከቀዶ ህክምና 2 ሳምንታት በፊት መጠቀም ያቁሙ'
                ],
                om: [
                    'Ulfa yeroo hin fayyadaminaa (walnyaatinsa gadameessaa fiduu danda\'a)',
                    'Qoricha dhiiga qallisan (Warfarin, Aspirin) wajjin hin fayyadaminaa',
                    'Ifa aduutiif miira garmalee fiduu danda\'a',
                    'Daa\'imman waggaa 5 gadittiif hin kenninaa',
                    'Qoricha dhiibbaa dhiigaa wajjin walitti bu\'uu danda\'a',
                    'Baquin dura torban 2 fayyadamuu dhaabi'
                ]
            },
            side_effects: {
                en: ['Nausea if taken on empty stomach', 'Skin irritation (topical)', 'Dizziness (rare)', 'Allergic reactions (rare)'],
                am: ['በባዶ ሆድ ከተወሰደ ማቅለሽለሽ', 'የቆዳ መቆጣት', 'ማዞር (ብርቅ)', 'አለርጂ (ብርቅ)'],
                om: ['Garuu duwwaa yoo fudhatame lololaa', 'Gogaa aarsuu', 'Maraammartuu (keessatti hin beekamne)', 'Alarjii (keessatti hin beekamne)']
            },
            regions: {
                en: 'Ethiopian highlands (1,500-3,000m), common in Tigray, Amhara, Oromia, SNNP regions. Also found in Eritrea, Kenya, and Middle East.',
                am: 'የኢትዮጵያ ደጋማ አካባቢዎች (1,500-3,000ሜ)፣ በትግራይ፣ አማራ፣ ኦሮሚያ፣ ደቡብ ክልሎች በብዛት ይገኛል።',
                om: 'Itoophiyaa keessatti iddoo olka\'aa (1,500-3,000m), Tigray, Amhara, Oromia, SNNP keessatti bal\'inaan argama.'
            }
        },
        {
            id: 'gesho',
            category: ['digestive', 'malaria', 'chronic'],
            names: {
                en: 'Gesho',
                am: 'ጌሾ',
                om: 'Gesho'
            },
            scientific: 'Rhamnus prinoides',
            family: 'Rhamnaceae',
            icon: '🌳',
            description: {
                en: 'A shrub whose leaves and stems are essential in Ethiopian traditional brewing of Tella and Tej. Medicinally used for digestive issues, malaria, and intestinal parasites.',
                am: 'ቅጠሎቹ እና ግንዶቹ በኢትዮጵያ ባህላዊ የጠላ እና የጠጅ አፈላላት ውስጥ አስፈላጊ የሆነ ቁጥቋጦ። ለምግብ መፈጨት ችግሮች፣ ወባ እና የአንጀት ትሎች ለህክምናነት ያገለግላል።',
                om: 'Baalli fi hundeen isaa Tellaa fi Tej aadaa Itoophiyaa keessatti barbaachisaa dha. Fayyaadhaaf, rakkoolee bullaa\'insaa, busaa, fi raammoo garaatiif fayyada.'
            },
            parts_used: {
                en: 'Leaves, stems, bark',
                am: 'ቅጠሎች፣ ግንዶች፣ ቅርፊት',
                om: 'Baala, hundee, qola'
            },
            uses: {
                en: [
                    'Digestive aid and stomach ache',
                    'Malaria treatment (traditional)',
                    'Intestinal worms/parasites',
                    'Tonsillitis and sore throat',
                    'Fever reducer',
                    'Anti-inflammatory'
                ],
                am: [
                    'የምግብ መፈጨት እገዛ እና የሆድ ህመም',
                    'የወባ ህክምና (ባህላዊ)',
                    'የአንጀት ትሎች',
                    'ቶንሲላይተስ እና የጉሮሮ ህመም',
                    'ትኩሳት ቅነሳ',
                    'ፀረ-ኢንፍላማቶሪ'
                ],
                om: [
                    'Gargaarsa bullaa\'insaa fi dhukkubbii garaa',
                    'Wal\'aansa busaa (aadaa)',
                    'Raammoo garaa',
                    'Tonsillitis fi dhukkubbii kokkee',
                    'Ho\'ina hir\'isuu',
                    'Anti-inflammatory'
                ]
            },
            preparations: {
                en: [
                    {
                        method: 'Tea Decoction',
                        directions: 'Boil 10-15 dried leaves/stems in 1 liter water for 15-20 minutes. Strain and drink.',
                        dosage: '1 cup, 2-3 times daily',
                        duration: 'Maximum 7-10 days'
                    }
                ],
                am: [
                    {
                        method: 'ሻይ አፈላል',
                        directions: '10-15 ደረቅ ቅጠሎች/ግንዶች በ1 ሊትር ውሃ ለ15-20 ደቂቃ ቀቅለው ያጣሩና ይጠጡ።',
                        dosage: '1 ኩባያ፣ በቀን 2-3 ጊዜ',
                        duration: 'ቢበዛ 7-10 ቀናት'
                    }
                ],
                om: [
                    {
                        method: 'Shaayii Danfisuu',
                        directions: 'Baala/hundee gogaa 10-15 bishaan 1 litir keessatti daqiiqaa 15-20 danfisi. Calaliitii dhugi.',
                        dosage: 'Kubbaayaa 1, guyyaatti 2-3',
                        duration: 'Guyyoota 7-10 ol hin ta\'in'
                    }
                ]
            },
            warnings: {
                en: [
                    'May interact with diabetes medications (lowers blood sugar)',
                    'Avoid excessive use with alcohol',
                    'Not recommended during pregnancy',
                    'May cause stomach upset in high doses'
                ],
                am: [
                    'ከስኳር ህመም መድሃኒቶች ጋር መስተጋብር ሊፈጥር ይችላል',
                    'ከአልኮል ጋር ከመጠን በላይ አይጠቀሙ',
                    'በእርግዝና ወቅት አይመከርም',
                    'በከፍተኛ መጠን የሆድ መበሳጨት ሊያስከትል ይችላል'
                ],
                om: [
                    'Qoricha sukkaara wajjin walitti bu\'uu danda\'a',
                    'Alkool wajjin garmalee hin fayyadaminaa',
                    'Ulfa yeroo hin gorfamu',
                    'Hammamtaa guddaan garaa jeequu danda\'a'
                ]
            },
            regions: {
                en: 'Widespread in Ethiopian highlands (1,800-3,200m). Common in Amhara, Oromia, Tigray, and Southern regions.',
                am: 'በኢትዮጵያ ደጋማ አካባቢዎች በስፋት ይገኛል። በአማራ፣ ኦሮሚያ፣ ትግራይ እና ደቡብ ክልሎች የተለመደ ነው።',
                om: 'Itoophiyaa olka\'aa (1,800-3,200m) keessatti bal\'inaan argama. Amhara, Oromia, Tigray fi Kibba keessatti beekamaa dha.'
            }
        },
        {
            id: 'moringa',
            category: ['nutrition', 'chronic', 'womens'],
            names: {
                en: 'Moringa',
                am: 'ሺፈራው / ሞሪንጋ',
                om: 'Shiferaw / Moringa'
            },
            scientific: 'Moringa stenopetala',
            family: 'Moringaceae',
            icon: '🥬',
            description: {
                en: 'Known as the "Miracle Tree" or "African Moringa". Ethiopian Moringa has larger leaves than the Indian variety. Extremely nutritious - used to combat malnutrition, boost immunity, and manage chronic diseases.',
                am: '"የተአምር ዛፍ" ወይም "አፍሪካዊ ሞሪንጋ" በመባል ይታወቃል። የኢትዮጵያ ሞሪንጋ ከህንድ ዝርያ የበለጠ ትላልቅ ቅጠሎች አሉት። የተመጣጠነ ምግብ እጥረትን ለመዋጋት፣ በሽታ የመከላከል አቅምን ለማሳደግ እና ስር የሰደዱ በሽታዎችን ለመቆጣጠር ያገለግላል።',
                om: '"Muka Dinqii" ykn "Moringa Afrikaa" jedhamuun beekama. Moringa Itoophiyaa kan Hindii caalaa baala gurguddaa qaba. Soorata garmalee qaba - hangina soorataa balleessuu, dhukkuba ofirraa ittisuu fi dhukkuboota dadhabsiisoo to\'achuuf fayyada.'
            },
            parts_used: {
                en: 'Leaves (primary), seeds, flowers, pods',
                am: 'ቅጠሎች (ዋና)፣ ዘሮች፣ አበቦች፣ ፍሬዎች',
                om: 'Baala (ijoo), sanyii, daraaraa, firii'
            },
            uses: {
                en: [
                    'Malnutrition and vitamin deficiency',
                    'High blood pressure management',
                    'Diabetes blood sugar control',
                    'Anemia (high iron content)',
                    'Breastfeeding support (increases milk production)',
                    'Immune system booster',
                    'Anti-inflammatory for arthritis',
                    'Cholesterol reduction',
                    'Digestive health'
                ],
                am: [
                    'የተመጣጠነ ምግብ እጥረት እና የቪታሚን እጥረት',
                    'የደም ግፊት ቁጥጥር',
                    'የስኳር ህመም ቁጥጥር',
                    'የደም ማነስ (ከፍተኛ የብረት ይዘት)',
                    'የጡት ወተት ምርትን ማሳደግ',
                    'የበሽታ መከላከል አቅም ማጎልበት',
                    'ለአርትራይተስ ፀረ-ኢንፍላማቶሪ',
                    'ኮሌስትሮል ቅነሳ',
                    'የምግብ መፈጨት ጤንነት'
                ],
                om: [
                    'Hangina soorataa fi vaayitaamina',
                    'Dhiibbaa dhiigaa to\'achuu',
                    'Sukkaara dhiigaa to\'achuu',
                    'Dhiiga hanqina (ayirenii guddaa qaba)',
                    'Annana harmaa dabaluu',
                    'Dhukkuba ofirraa ittisuu cimsuu',
                    'Anti-inflammatory arthritis',
                    'Kolestrooli hir\'isuu',
                    'Fayyaa bullaa\'insaa'
                ]
            },
            preparations: {
                en: [
                    {
                        method: 'Fresh Leaves',
                        directions: 'Wash fresh leaves thoroughly. Add to soups, stews (wot), or salads. Can be cooked like spinach.',
                        dosage: '1/2 cup fresh leaves daily with meals',
                        duration: 'Safe for daily long-term use'
                    },
                    {
                        method: 'Leaf Powder',
                        directions: 'Dry leaves in shade, grind to fine powder. Store in airtight container.',
                        dosage: '1-2 teaspoons daily in water, tea, or food',
                        duration: 'Can be used daily as supplement'
                    },
                    {
                        method: 'Moringa Tea',
                        directions: 'Steep 1 teaspoon dried leaf powder in hot water for 5-7 minutes.',
                        dosage: '1-2 cups daily',
                        duration: 'Safe for regular consumption'
                    }
                ],
                am: [
                    {
                        method: 'ትኩስ ቅጠሎች',
                        directions: 'ትኩስ ቅጠሎችን በደንብ ያጥቡ። በሾርባ፣ በወጥ ወይም በሰላጣ ውስጥ ይጨምሩ።',
                        dosage: 'በቀን ግማሽ ኩባያ ትኩስ ቅጠሎች ከምግብ ጋር',
                        duration: 'ለረጅም ጊዜ አገልግሎት ደህንነቱ የተጠበቀ ነው'
                    },
                    {
                        method: 'የቅጠል ዱቄት',
                        directions: 'ቅጠሎችን በጥላ ያድርቁ፣ ወደ ጥሩ ዱቄት ይፍጩ።',
                        dosage: 'በቀን 1-2 የሻይ ማንኪያ በውሃ፣ ሻይ ወይም ምግብ ውስጥ',
                        duration: 'በየቀኑ እንደ ተጨማሪ ምግብ መጠቀም ይቻላል'
                    }
                ],
                om: [
                    {
                        method: 'Baala Haaraa',
                        directions: 'Baala haaraa sirriitti dhiqi. Shorbaa, wot, ykn salaada keessatti dabali.',
                        dosage: 'Guyyaatti walakkaa kubbaayaa baala haaraa',
                        duration: 'Yeroo dheeraaf fayyadamuu ni danda\'ama'
                    },
                    {
                        method: 'Daakuu Baalaa',
                        directions: 'Baala gaaddidduutti gogsi, daakuu qulqulluu tolchi.',
                        dosage: 'Guyyaatti spoons shaayii 1-2',
                        duration: 'Guyyuu akka dabalataatti fayyadamuu danda\'ama'
                    }
                ]
            },
            warnings: {
                en: [
                    'May lower blood sugar significantly - monitor if diabetic',
                    'May lower blood pressure',
                    'Avoid root and root bark during pregnancy (may cause miscarriage)',
                    'Start with small doses to test tolerance',
                    'Store powder in cool, dark place (nutrients degrade in light)'
                ],
                am: [
                    'የስኳር መጠንን በከፍተኛ ሁኔታ ሊቀንስ ይችላል - የስኳር ህመምተኛ ከሆኑ ይቆጣጠሩ',
                    'የደም ግፊትን ሊቀንስ ይችላል',
                    'በእርግዝና ወቅት ስር እና ቅርፊት አይጠቀሙ',
                    'መቻልን ለመፈተሽ በትንሽ መጠን ይጀምሩ',
                    'ዱቄትን በቀዝቃዛና ጨለማ ቦታ ያስቀምጡ'
                ],
                om: [
                    'Sukkaara dhiigaa garmalee hir\'isuu danda\'a - dhukkubsataa sukkaara yoo ta\'e to\'adhu',
                    'Dhiibbaa dhiigaa hir\'isuu danda\'a',
                    'Ulfa yeroo hidda fi qola hiddaa hin fayyadaminaa',
                    'Hammamtaa xiqqaa irraa jalqabi',
                    'Daakuu bakka qorraa fi dukkanaa\'aa keessatti olkaa\'i'
                ]
            },
            regions: {
                en: 'Southern Ethiopia (Konso, Gamo Gofa, Sidama), also cultivated in central and eastern regions. Grows in lowland to mid-altitude areas.',
                am: 'ደቡብ ኢትዮጵያ (ኮንሶ፣ ጋሞ ጎፋ፣ ሲዳማ)፣ በማዕከላዊ እና ምስራቃዊ ክልሎችም ይበቅላል።',
                om: 'Kibba Itoophiyaa (Konso, Gamo Gofa, Sidama), naannoo giddu-galeessaa fi bahaatti misooma.'
            }
        }
        // Additional herbs would continue here...
        // I can add 20+ more herbs with full details if needed
    ],
    
    /**
     * Get herb by ID
     */
    getHerbById: function(id) {
        return this.herbs.find(h => h.id === id);
    },
    
    /**
     * Search herbs
     */
    searchHerbs: function(query = '') {
        if (!query) return this.herbs;
        
        const lower = query.toLowerCase();
        return this.herbs.filter(h => 
            h.names.en.toLowerCase().includes(lower) ||
            h.names.am.toLowerCase().includes(lower) ||
            h.names.om.toLowerCase().includes(lower) ||
            h.scientific.toLowerCase().includes(lower) ||
            h.uses.en.some(u => u.toLowerCase().includes(lower)) ||
            h.uses.am.some(u => u.toLowerCase().includes(lower)) ||
            h.uses.om.some(u => u.toLowerCase().includes(lower)) ||
            h.category.some(c => c.toLowerCase().includes(lower))
        );
    },
    
    /**
     * Filter by category
     */
    filterByCategory: function(category) {
        if (category === 'all') return this.herbs;
        return this.herbs.filter(h => h.category.includes(category));
    },
    
    /**
     * Get categories
     */
    getCategories: function() {
        return [
            { id: 'all', icon: '📋' },
            { id: 'respiratory', icon: '🫁' },
            { id: 'digestive', icon: '🫄' },
            { id: 'malaria', icon: '🦟' },
            { id: 'skin', icon: '🧴' },
            { id: 'chronic', icon: '💊' },
            { id: 'nutrition', icon: '🥗' },
            { id: 'womens', icon: '👩' }
        ];
    }
};