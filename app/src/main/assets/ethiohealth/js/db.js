// ============================================
// ETHIOHEALTH AI PRO - DATABASE SETUP
// ============================================

const DB = (function() {
    'use strict';
    
    // Initialize Dexie database
    const db = new Dexie('EthioHealthAIPro');
    
    // Define database schema
    db.version(4).stores({
        // Store all health analyses
        analyses: '++id, timestamp, systolic, diastolic, glucose, bmi, temperature, age, riskScore',
        
        // Store symptom check results
        symptomChecks: '++id, timestamp, symptoms, duration, severity, results',
        
        // Store voice command history
        voiceHistory: '++id, timestamp, command, response, language',
        
        // Store user settings
        settings: 'key',
        
        // Cache for API responses
        apiCache: 'url, timestamp, data, expiry',
        
        // Store herb/traditional medicine data
        herbCache: '++id, name, scientificName, uses, warnings',
        
        // Store emergency contacts
        emergencyContacts: '++id, name, phone, relationship',
        
        // Store health trends for charts
        healthTrends: '++id, timestamp, type, value',
        
        // Store user profile
        userProfile: 'id',
        
        // Store notifications
        notifications: '++id, timestamp, type, title, message, read',
        
        // Store medicine search results
        medicineCache: '++id, name, category, data, timestamp'
    });
    
    // Database helper functions
    const database = {
        /**
         * Save health analysis
         */
        saveAnalysis: async function(data) {
            try {
                const id = await db.analyses.add({
                    timestamp: Date.now(),
                    systolic: data.systolic || 0,
                    diastolic: data.diastolic || 0,
                    glucose: data.glucose || 0,
                    bmi: data.bmi || 0,
                    temperature: data.temperature || 0,
                    age: data.age || 0,
                    riskScore: data.riskScore || 0,
                    hypertensionRisk: data.hypertensionRisk || 0,
                    diabetesRisk: data.diabetesRisk || 0,
                    malariaRisk: data.malariaRisk || 0,
                    fullResults: JSON.stringify(data.results || {})
                });
                console.log('Analysis saved with ID:', id);
                return id;
            } catch (error) {
                console.error('Error saving analysis:', error);
                return null;
            }
        },
        
        /**
         * Get recent analyses
         */
        getRecentAnalyses: async function(limit = 10) {
            try {
                return await db.analyses
                    .orderBy('timestamp')
                    .reverse()
                    .limit(limit)
                    .toArray();
            } catch (error) {
                console.error('Error getting analyses:', error);
                return [];
            }
        },
        
        /**
         * Save symptom check
         */
        saveSymptomCheck: async function(data) {
            try {
                const id = await db.symptomChecks.add({
                    timestamp: Date.now(),
                    symptoms: JSON.stringify(data.symptoms || []),
                    duration: data.duration || '',
                    severity: data.severity || 0,
                    notes: data.notes || '',
                    results: JSON.stringify(data.results || {})
                });
                console.log('Symptom check saved with ID:', id);
                return id;
            } catch (error) {
                console.error('Error saving symptom check:', error);
                return null;
            }
        },
        
        /**
         * Get symptom check history
         */
        getSymptomHistory: async function(limit = 5) {
            try {
                return await db.symptomChecks
                    .orderBy('timestamp')
                    .reverse()
                    .limit(limit)
                    .toArray();
            } catch (error) {
                console.error('Error getting symptom history:', error);
                return [];
            }
        },
        
        /**
         * Save voice command
         */
        saveVoiceCommand: async function(command, response, language) {
            try {
                const id = await db.voiceHistory.add({
                    timestamp: Date.now(),
                    command: command,
                    response: response,
                    language: language || 'en'
                });
                return id;
            } catch (error) {
                console.error('Error saving voice command:', error);
                return null;
            }
        },
        
        /**
         * Get voice history
         */
        getVoiceHistory: async function(limit = 10) {
            try {
                return await db.voiceHistory
                    .orderBy('timestamp')
                    .reverse()
                    .limit(limit)
                    .toArray();
            } catch (error) {
                console.error('Error getting voice history:', error);
                return [];
            }
        },
        
        /**
         * Save setting
         */
        saveSetting: async function(key, value) {
            try {
                await db.settings.put({
                    key: key,
                    value: value,
                    updatedAt: Date.now()
                });
                return true;
            } catch (error) {
                console.error('Error saving setting:', error);
                return false;
            }
        },
        
        /**
         * Get setting
         */
        getSetting: async function(key, defaultValue = null) {
            try {
                const setting = await db.settings.get(key);
                return setting ? setting.value : defaultValue;
            } catch (error) {
                console.error('Error getting setting:', error);
                return defaultValue;
            }
        },
        
        /**
         * Get all settings
         */
        getAllSettings: async function() {
            try {
                return await db.settings.toArray();
            } catch (error) {
                console.error('Error getting all settings:', error);
                return [];
            }
        },
        
        /**
         * Cache API response
         */
        cacheAPIResponse: async function(url, data, expiryMinutes = 60) {
            try {
                const expiry = Date.now() + (expiryMinutes * 60 * 1000);
                await db.apiCache.put({
                    url: url,
                    timestamp: Date.now(),
                    data: JSON.stringify(data),
                    expiry: expiry
                });
                return true;
            } catch (error) {
                console.error('Error caching API response:', error);
                return false;
            }
        },
        
        /**
         * Get cached API response
         */
        getCachedAPIResponse: async function(url) {
            try {
                const cached = await db.apiCache.get(url);
                if (cached && cached.expiry > Date.now()) {
                    return JSON.parse(cached.data);
                }
                // Remove expired cache
                if (cached) {
                    await db.apiCache.delete(url);
                }
                return null;
            } catch (error) {
                console.error('Error getting cached API:', error);
                return null;
            }
        },
        
        /**
         * Save herb data
         */
        saveHerbData: async function(herbs) {
            try {
                await db.herbCache.clear();
                await db.herbCache.bulkAdd(herbs);
                return true;
            } catch (error) {
                console.error('Error saving herb data:', error);
                return false;
            }
        },
        
        /**
         * Search herbs
         */
        searchHerbs: async function(query) {
            try {
                const allHerbs = await db.herbCache.toArray();
                if (allHerbs.length === 0) return [];
                
                const lowerQuery = query.toLowerCase();
                return allHerbs.filter(herb => 
                    herb.name.toLowerCase().includes(lowerQuery) ||
                    herb.scientificName.toLowerCase().includes(lowerQuery) ||
                    herb.uses.toLowerCase().includes(lowerQuery)
                );
            } catch (error) {
                console.error('Error searching herbs:', error);
                return [];
            }
        },
        
        /**
         * Save emergency contact
         */
        saveEmergencyContact: async function(contact) {
            try {
                if (contact.id) {
                    await db.emergencyContacts.update(contact.id, contact);
                } else {
                    await db.emergencyContacts.add(contact);
                }
                return true;
            } catch (error) {
                console.error('Error saving emergency contact:', error);
                return false;
            }
        },
        
        /**
         * Get emergency contacts
         */
        getEmergencyContacts: async function() {
            try {
                return await db.emergencyContacts.toArray();
            } catch (error) {
                console.error('Error getting emergency contacts:', error);
                return [];
            }
        },
        
        /**
         * Save health trend
         */
        saveHealthTrend: async function(type, value) {
            try {
                await db.healthTrends.add({
                    timestamp: Date.now(),
                    type: type,
                    value: value
                });
                return true;
            } catch (error) {
                console.error('Error saving health trend:', error);
                return false;
            }
        },
        
        /**
         * Get health trends
         */
        getHealthTrends: async function(type, hours = 24) {
            try {
                const since = Date.now() - (hours * 60 * 60 * 1000);
                return await db.healthTrends
                    .where('type')
                    .equals(type)
                    .and(item => item.timestamp > since)
                    .sortBy('timestamp');
            } catch (error) {
                console.error('Error getting health trends:', error);
                return [];
            }
        },
        
        /**
         * Save user profile
         */
        saveUserProfile: async function(profile) {
            try {
                profile.id = 1;
                profile.updatedAt = Date.now();
                await db.userProfile.put(profile);
                return true;
            } catch (error) {
                console.error('Error saving profile:', error);
                return false;
            }
        },
        
        /**
         * Get user profile
         */
        getUserProfile: async function() {
            try {
                const profile = await db.userProfile.get(1);
                return profile || {
                    name: '',
                    age: 30,
                    location: 'Addis Ababa',
                    gender: '',
                    phone: '',
                    bloodType: ''
                };
            } catch (error) {
                console.error('Error getting profile:', error);
                return null;
            }
        },
        
        /**
         * Save notification
         */
        saveNotification: async function(type, title, message) {
            try {
                await db.notifications.add({
                    timestamp: Date.now(),
                    type: type,
                    title: title,
                    message: message,
                    read: false
                });
                return true;
            } catch (error) {
                console.error('Error saving notification:', error);
                return false;
            }
        },
        
        /**
         * Get unread notifications count
         */
        getUnreadCount: async function() {
            try {
                return await db.notifications
                    .where('read')
                    .equals(false)
                    .count();
            } catch (error) {
                console.error('Error getting notification count:', error);
                return 0;
            }
        },
        
        /**
         * Get all notifications
         */
        getNotifications: async function(limit = 20) {
            try {
                return await db.notifications
                    .orderBy('timestamp')
                    .reverse()
                    .limit(limit)
                    .toArray();
            } catch (error) {
                console.error('Error getting notifications:', error);
                return [];
            }
        },
        
        /**
         * Mark notification as read
         */
        markNotificationRead: async function(id) {
            try {
                await db.notifications.update(id, { read: true });
                return true;
            } catch (error) {
                console.error('Error marking notification:', error);
                return false;
            }
        },
        
        /**
         * Mark all notifications as read
         */
        markAllNotificationsRead: async function() {
            try {
                await db.notifications
                    .where('read')
                    .equals(false)
                    .modify({ read: true });
                return true;
            } catch (error) {
                console.error('Error marking all notifications:', error);
                return false;
            }
        },
        
        /**
         * Clear old data (older than specified days)
         */
        clearOldData: async function(daysOld = 30) {
            try {
                const cutoff = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
                
                await db.analyses
                    .where('timestamp')
                    .below(cutoff)
                    .delete();
                
                await db.symptomChecks
                    .where('timestamp')
                    .below(cutoff)
                    .delete();
                
                await db.voiceHistory
                    .where('timestamp')
                    .below(cutoff)
                    .delete();
                
                await db.notifications
                    .where('timestamp')
                    .below(cutoff)
                    .delete();
                
                console.log('Old data cleared successfully');
                return true;
            } catch (error) {
                console.error('Error clearing old data:', error);
                return false;
            }
        },
        
        /**
         * Export all data as JSON
         */
        exportAllData: async function() {
            try {
                const data = {
                    analyses: await db.analyses.toArray(),
                    symptomChecks: await db.symptomChecks.toArray(),
                    voiceHistory: await db.voiceHistory.toArray(),
                    settings: await db.settings.toArray(),
                    healthTrends: await db.healthTrends.toArray(),
                    userProfile: await db.userProfile.toArray(),
                    emergencyContacts: await db.emergencyContacts.toArray(),
                    exportDate: new Date().toISOString()
                };
                return JSON.stringify(data, null, 2);
            } catch (error) {
                console.error('Error exporting data:', error);
                return null;
            }
        },
        
        /**
         * Import data from JSON
         */
        importData: async function(jsonData) {
            try {
                const data = JSON.parse(jsonData);
                
                if (data.analyses) {
                    await db.analyses.clear();
                    await db.analyses.bulkAdd(data.analyses);
                }
                
                if (data.settings) {
                    await db.settings.clear();
                    await db.settings.bulkAdd(data.settings);
                }
                
                if (data.emergencyContacts) {
                    await db.emergencyContacts.clear();
                    await db.emergencyContacts.bulkAdd(data.emergencyContacts);
                }
                
                if (data.userProfile) {
                    await db.userProfile.clear();
                    await db.userProfile.bulkAdd(data.userProfile);
                }
                
                console.log('Data imported successfully');
                return true;
            } catch (error) {
                console.error('Error importing data:', error);
                return false;
            }
        },
        
        /**
         * Get database size estimate
         */
        getDatabaseSize: async function() {
            try {
                const tables = ['analyses', 'symptomChecks', 'voiceHistory', 'settings', 
                               'apiCache', 'herbCache', 'healthTrends', 'notifications'];
                let totalCount = 0;
                
                for (const table of tables) {
                    if (db[table]) {
                        totalCount += await db[table].count();
                    }
                }
                
                return totalCount;
            } catch (error) {
                console.error('Error getting DB size:', error);
                return 0;
            }
        }
    };
    
    // Initialize default herbs if empty
    database.initializeHerbs = async function() {
        const count = await db.herbCache.count();
        if (count === 0) {
            const defaultHerbs = [
                {
                    name: 'Tena Adam',
                    scientificName: 'Ruta chalepensis',
                    uses: 'Stomach pain, headache, fever, cough, cold, ear infection, intestinal parasites',
                    warnings: 'Avoid with blood thinners (Warfarin). May cause photosensitivity. Not for pregnant women.',
                    preparation: 'Boil leaves in water, drink as tea. Or crush fresh leaves and inhale for headache.',
                    dosage: '1-2 cups of tea daily, not exceeding 7 days',
                    regions: 'Grown throughout Ethiopian highlands',
                    category: 'Respiratory & Digestive'
                },
                {
                    name: 'Gesho',
                    scientificName: 'Rhamnus prinoides',
                    uses: 'Digestion, stomach ache, fever, malaria, intestinal worms, tonsillitis',
                    warnings: 'May interact with diabetes medication. Avoid excessive use with alcohol.',
                    preparation: 'Boil dried leaves/stems in water. Used in Tella and Tej preparation.',
                    dosage: '1 cup of tea 2-3 times daily',
                    regions: 'Widely available in Ethiopian highlands',
                    category: 'Digestive & Anti-parasitic'
                },
                {
                    name: 'Damakese',
                    scientificName: 'Ocimum lamiifolium',
                    uses: 'Fever, headache, common cold, cough, eye infection, skin problems',
                    warnings: 'Generally safe. Avoid excessive use during pregnancy.',
                    preparation: 'Crush fresh leaves, inhale vapor. Or boil and drink as tea.',
                    dosage: 'As needed for symptoms, not exceeding 5 days',
                    regions: 'Common in Ethiopian gardens and highlands',
                    category: 'Respiratory & Fever'
                },
                {
                    name: 'Koseret',
                    scientificName: 'Lippia adoensis',
                    uses: 'Digestive problems, stomach ache, intestinal parasites, fever, cough',
                    warnings: 'Generally safe in culinary amounts. Medicinal doses should be monitored.',
                    preparation: 'Add to cooking as spice, or boil leaves for tea.',
                    dosage: '1-2 cups of tea daily for medicinal use',
                    regions: 'Ethiopian highlands, commonly used in butter preparation',
                    category: 'Digestive'
                },
                {
                    name: 'Bisana',
                    scientificName: 'Croton macrostachyus',
                    uses: 'Skin conditions, wounds, ringworm, scabies, constipation',
                    warnings: 'External use only. Seeds are toxic if ingested. Avoid contact with eyes.',
                    preparation: 'Crush leaves/seeds and apply as paste on affected skin.',
                    dosage: 'External application only, 1-2 times daily',
                    regions: 'Common in Ethiopian forests and highlands',
                    category: 'Skin & Wound Care'
                },
                {
                    name: 'Moringa',
                    scientificName: 'Moringa stenopetala',
                    uses: 'Malnutrition, vitamin deficiency, high blood pressure, diabetes, inflammation',
                    warnings: 'May lower blood sugar. Monitor if on diabetes medication. Avoid root during pregnancy.',
                    preparation: 'Eat fresh leaves as vegetable, or dry and powder for tea.',
                    dosage: '1-2 teaspoons of leaf powder daily or fresh leaves with meals',
                    regions: 'Southern Ethiopia, Konso region',
                    category: 'Nutrition & Chronic Disease'
                },
                {
                    name: 'Feto',
                    scientificName: 'Lepidium sativum',
                    uses: 'Stomach ache, constipation, cough, bone healing, lactation support',
                    warnings: 'Generally safe. Avoid excessive amounts during early pregnancy.',
                    preparation: 'Grind seeds, mix with water or honey. Can be added to food.',
                    dosage: '1 teaspoon of ground seeds daily',
                    regions: 'Grown throughout Ethiopia',
                    category: 'Digestive & Bone Health'
                },
                {
                    name: 'Neem',
                    scientificName: 'Azadirachta indica',
                    uses: 'Malaria, fever, skin diseases, dental problems, intestinal worms',
                    warnings: 'Not for pregnant or breastfeeding women. May affect fertility. Avoid long-term use.',
                    preparation: 'Boil leaves for tea, or use oil for skin application.',
                    dosage: '1 cup of leaf tea daily, not exceeding 2 weeks',
                    regions: 'Lower altitude areas, Eastern Ethiopia',
                    category: 'Anti-malarial & Skin'
                },
                {
                    name: 'Tosign',
                    scientificName: 'Thymus schimperi',
                    uses: 'Cough, cold, respiratory infections, digestive problems, high blood pressure',
                    warnings: 'Generally safe. May slightly lower blood pressure.',
                    preparation: 'Add to tea or food as spice. Boil leaves for medicinal tea.',
                    dosage: '1-2 cups of tea or culinary amounts daily',
                    regions: 'Ethiopian highlands',
                    category: 'Respiratory & Cardiovascular'
                },
                {
                    name: 'Grawa',
                    scientificName: 'Vernonia amygdalina',
                    uses: 'Malaria, fever, diabetes, digestive problems, intestinal parasites',
                    warnings: 'Very bitter. May lower blood sugar significantly. Monitor diabetes medication.',
                    preparation: 'Boil leaves in water, drink small amounts. Can chew fresh leaves.',
                    dosage: '½ cup of tea daily, not exceeding 7 days',
                    regions: 'Various regions of Ethiopia',
                    category: 'Anti-malarial & Diabetes'
                }
            ];
            
            await database.saveHerbData(defaultHerbs);
            console.log('Default herbs initialized');
        }
    };
    
    // Clean up old data periodically
    database.maintenance = async function() {
        const lastCleanup = await database.getSetting('lastCleanup', 0);
        const now = Date.now();
        
        // Run cleanup every 7 days
        if (now - lastCleanup > 7 * 24 * 60 * 60 * 1000) {
            await database.clearOldData(60); // Clear data older than 60 days
            await database.saveSetting('lastCleanup', now);
        }
    };
    
    return database;
})();

console.log('✅ Database initialized successfully');