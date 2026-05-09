// ============================================
// ETHIOHEALTH AI PRO - EMERGENCY SOS SYSTEM
// ============================================

const Emergency = (function() {
    'use strict';
    
    const emergency = {
        // Emergency contacts
        contacts: [],
        
        // Emergency numbers
        emergencyNumbers: {
            ambulance: '907',
            police: '991',
            fire: '939',
            redCross: '011-552-72-22',
            blackLion: '011-551-1211' // Black Lion Hospital - largest in Ethiopia
        },
        
        // Configuration
        config: {
            autoShareLocation: true,
            includeHealthSummary: true,
            smsAlertContacts: true
        },
        
        /**
         * Initialize emergency system
         */
        init: function() {
            emergency.loadContacts();
            emergency.setupEventListeners();
        },
        
        /**
         * Setup event listeners
         */
        setupEventListeners: function() {
            // SOS button
            const sosBtn = document.getElementById('sosBtn');
            if (sosBtn) {
                sosBtn.addEventListener('click', function() {
                    emergency.showEmergencyModal();
                });
                
                // Long press for immediate emergency
                let longPressTimer;
                sosBtn.addEventListener('mousedown', function() {
                    longPressTimer = setTimeout(function() {
                        emergency.triggerImmediate();
                    }, 2000);
                });
                sosBtn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    longPressTimer = setTimeout(function() {
                        emergency.triggerImmediate();
                    }, 2000);
                });
                sosBtn.addEventListener('mouseup', function() {
                    clearTimeout(longPressTimer);
                });
                sosBtn.addEventListener('touchend', function() {
                    clearTimeout(longPressTimer);
                });
            }
        },
        
        /**
         * Show emergency modal with options
         */
        showEmergencyModal: function() {
            const content = `
                <div style="text-align:center;margin-bottom:20px;">
                    <span style="font-size:60px;">🆘</span>
                    <h3 style="color:#ef4444;margin-top:8px;">${I18n.t('emergency_sos')}</h3>
                    <p style="font-size:14px;color:#6b7280;">${I18n.t('select_emergency_option') || 'Select emergency option'}</p>
                </div>
                
                <button class="btn btn-danger btn-full" onclick="Emergency.callEmergency()" style="margin-bottom:8px;">
                    📞 ${I18n.t('call_emergency') || 'Call 907 (Ambulance)'}
                </button>
                
                <button class="btn btn-warning btn-full" onclick="Emergency.shareLocation()" style="margin-bottom:8px;">
                    📍 ${I18n.t('share_location') || 'Share Location with Contacts'}
                </button>
                
                <button class="btn btn-outline btn-full" onclick="Emergency.showHospitalFinder()" style="margin-bottom:8px;">
                    🏥 ${I18n.t('find_hospital') || 'Find Nearest Hospital'}
                </button>
                
                <button class="btn btn-outline btn-full" onclick="Emergency.showFirstAid()" style="margin-bottom:8px;">
                    🩹 ${I18n.t('first_aid') || 'First Aid Guide'}
                </button>
                
                <div style="margin-top:12px;">
                    <h4 style="font-weight:600;margin-bottom:8px;">${I18n.t('emergency_contacts') || 'Emergency Contacts'}</h4>
                    ${emergency.contacts.length > 0 ? 
                        emergency.contacts.map((c, i) => `
                            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#f9fafb;border-radius:8px;margin-bottom:4px;">
                                <div>
                                    <strong>${c.name}</strong>
                                    <div style="font-size:12px;color:#6b7280;">${c.phone} (${c.relationship})</div>
                                </div>
                                <button class="btn btn-sm" onclick="Emergency.callContact('${c.phone}')">📞</button>
                            </div>
                        `).join('') :
                        `<p class="placeholder-text">${I18n.t('no_emergency_contacts') || 'No emergency contacts set'}</p>`
                    }
                    <button class="btn btn-sm btn-outline" onclick="Emergency.showAddContactForm()" style="margin-top:8px;">
                        ➕ ${I18n.t('add_contact') || 'Add Contact'}
                    </button>
                </div>
                
                <button class="btn btn-secondary btn-full" onclick="Utils.closeModal()" style="margin-top:16px;">
                    ${I18n.t('close') || 'Close'}
                </button>
            `;
            
            Utils.showModal(I18n.t('emergency_sos'), content, { showClose: false });
        },
        
        /**
         * Trigger immediate emergency (long press on SOS)
         */
        triggerImmediate: function() {
            Utils.vibrate([200, 100, 200, 100, 500]);
            
            // Show confirmation
            const content = `
                <div style="text-align:center;margin-bottom:20px;">
                    <span style="font-size:60px;">🚨</span>
                    <h3 style="color:#ef4444;">${I18n.t('emergency_activated') || 'Emergency Activated!'}</h3>
                    <p>${I18n.t('calling_emergency_in') || 'Calling emergency services...'}</p>
                </div>
                <button class="btn btn-danger btn-full" onclick="Emergency.callEmergency(); Utils.closeModal();">
                    📞 ${I18n.t('call_now') || 'Call Now (907)'}
                </button>
                <button class="btn btn-secondary btn-full" onclick="Utils.closeModal(); Emergency.shareLocation();">
                    📍 ${I18n.t('share_location_too') || 'Also Share Location'}
                </button>
            `;
            
            Utils.showModal('🚨 EMERGENCY', content, { showClose: true });
            
            // Auto-call after 3 seconds
            setTimeout(function() {
                emergency.callEmergency();
            }, 3000);
        },
        
        /**
         * Call Ethiopian emergency services
         */
        callEmergency: function() {
            const number = '907';
            
            // Try native bridge
            if (window.Bridge && Bridge.emergencyCall) {
                Bridge.emergencyCall();
            } else {
                window.location.href = `tel:${number}`;
            }
            
            // Log emergency
            emergency.logEmergency('call', number);
            
            // Show notification
            Utils.showToast(I18n.t('calling') || 'Calling 907...', 'warning', 5000);
        },
        
        /**
         * Share current location with emergency contacts
         */
        shareLocation: async function() {
            Utils.showLoading(I18n.t('getting_location') || 'Getting location...');
            
            try {
                let location;
                
                if (window.Bridge && Bridge.getCurrentLocation) {
                    location = await Bridge.getCurrentLocation();
                } else if (navigator.geolocation) {
                    location = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            pos => resolve({
                                latitude: pos.coords.latitude,
                                longitude: pos.coords.longitude,
                                accuracy: pos.coords.accuracy
                            }),
                            err => reject(err),
                            { enableHighAccuracy: true, timeout: 10000 }
                        );
                    });
                }
                
                Utils.hideLoading();
                
                if (location) {
                    const mapsUrl = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
                    const message = `🚨 ${I18n.t('emergency_message')} ${mapsUrl}`;
                    
                    // Share via intent
                    if (window.Bridge && Bridge.shareEmergencyLocation) {
                        Bridge.shareEmergencyLocation(location);
                    }
                    
                    // Open SMS with message
                    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
                    
                    // Log
                    emergency.logEmergency('location_shared', mapsUrl);
                    
                    Utils.showToast(I18n.t('location_shared') || 'Location shared!', 'success');
                }
            } catch (error) {
                Utils.hideLoading();
                Utils.showToast(I18n.t('location_error') || 'Could not get location', 'error');
            }
        },
        
        /**
         * Show hospital finder
         */
        showHospitalFinder: function() {
            const hospitals = [
                { name: 'Black Lion Hospital', location: 'Addis Ababa', phone: '011-551-1211', type: 'Referral' },
                { name: 'St. Paul\'s Hospital', location: 'Addis Ababa', phone: '011-275-1111', type: 'Referral' },
                { name: 'Yekatit 12 Hospital', location: 'Addis Ababa', phone: '011-111-2424', type: 'General' },
                { name: 'Gondar University Hospital', location: 'Gondar', phone: '058-111-0000', type: 'Teaching' },
                { name: 'Jimma University Hospital', location: 'Jimma', phone: '047-111-0000', type: 'Teaching' },
                { name: 'Mekelle Hospital', location: 'Mekelle', phone: '034-440-0000', type: 'General' }
            ];
            
            const content = `
                <div style="margin-bottom:16px;">
                    <input type="text" class="form-input" placeholder="${I18n.t('search_city') || 'Search by city...'}" 
                           onkeyup="Emergency.filterHospitals(this.value)">
                </div>
                <div id="hospitalList">
                    ${hospitals.map(h => `
                        <div class="risk-item" style="margin-bottom:8px;">
                            <div style="display:flex;justify-content:space-between;">
                                <strong>🏥 ${h.name}</strong>
                                <span style="font-size:11px;color:#6b7280;">${h.type}</span>
                            </div>
                            <div style="font-size:12px;color:#6b7280;">📍 ${h.location}</div>
                            <a href="tel:${h.phone}" style="color:#10b981;font-weight:600;font-size:13px;">📞 ${h.phone}</a>
                        </div>
                    `).join('')}
                </div>
            `;
            
            Utils.showModal('🏥 ' + (I18n.t('nearby_hospitals') || 'Hospitals'), content);
        },
        
        /**
         * Show first aid guide
         */
        showFirstAid: function() {
            const firstAidGuides = [
                {
                    title: 'Bleeding',
                    icon: '🩸',
                    steps: [
                        'Apply direct pressure with clean cloth',
                        'Elevate the injured area',
                        'Keep pressure for 15 minutes',
                        'Seek medical help if bleeding doesn\'t stop'
                    ]
                },
                {
                    title: 'Burns',
                    icon: '🔥',
                    steps: [
                        'Cool under running water for 10+ minutes',
                        'Remove jewelry near burn area',
                        'Cover with clean, dry cloth',
                        'Do NOT apply butter or oil'
                    ]
                },
                {
                    title: 'Fractures',
                    icon: '🦴',
                    steps: [
                        'Do NOT move the injured area',
                        'Immobilize with splint if possible',
                        'Apply ice wrapped in cloth',
                        'Seek immediate medical help'
                    ]
                },
                {
                    title: 'Choking',
                    icon: '😮',
                    steps: [
                        'Encourage coughing',
                        'Give 5 back blows between shoulder blades',
                        'Give 5 abdominal thrusts (Heimlich)',
                        'Call emergency if person collapses'
                    ]
                }
            ];
            
            const content = firstAidGuides.map(guide => `
                <div style="margin-bottom:16px;padding:12px;background:#f9fafb;border-radius:12px;">
                    <h4>${guide.icon} ${guide.title}</h4>
                    <ol style="margin-top:8px;padding-left:20px;">
                        ${guide.steps.map(s => `<li style="margin-bottom:4px;font-size:13px;">${s}</li>`).join('')}
                    </ol>
                </div>
            `).join('');
            
            Utils.showModal('🩹 ' + (I18n.t('first_aid') || 'First Aid'), content);
        },
        
        /**
         * Call emergency contact
         */
        callContact: function(phone) {
            window.location.href = `tel:${phone}`;
        },
        
        /**
         * Show add contact form
         */
        showAddContactForm: function() {
            const content = `
                <div class="input-group">
                    <label>${I18n.t('name')}</label>
                    <input type="text" id="contactName" class="form-input" placeholder="${I18n.t('contact_name') || 'Contact name'}">
                </div>
                <div class="input-group">
                    <label>${I18n.t('phone') || 'Phone'}</label>
                    <input type="tel" id="contactPhone" class="form-input" placeholder="+251...">
                </div>
                <div class="input-group">
                    <label>${I18n.t('relationship') || 'Relationship'}</label>
                    <select id="contactRelation" class="form-input">
                        <option value="family">${I18n.t('family') || 'Family'}</option>
                        <option value="spouse">${I18n.t('spouse') || 'Spouse'}</option>
                        <option value="parent">${I18n.t('parent') || 'Parent'}</option>
                        <option value="child">${I18n.t('child') || 'Child'}</option>
                        <option value="sibling">${I18n.t('sibling') || 'Sibling'}</option>
                        <option value="friend">${I18n.t('friend') || 'Friend'}</option>
                        <option value="doctor">${I18n.t('doctor') || 'Doctor'}</option>
                        <option value="other">${I18n.t('other') || 'Other'}</option>
                    </select>
                </div>
                <button class="btn btn-primary btn-full" onclick="Emergency.saveContact()">
                    💾 ${I18n.t('save')}
                </button>
            `;
            
            Utils.showModal('➕ ' + (I18n.t('add_contact') || 'Add Contact'), content);
        },
        
        /**
         * Save emergency contact
         */
        saveContact: function() {
            const name = document.getElementById('contactName')?.value;
            const phone = document.getElementById('contactPhone')?.value;
            const relationship = document.getElementById('contactRelation')?.value;
            
            if (!name || !phone) {
                Utils.showToast(I18n.t('fill_all_fields') || 'Please fill all fields', 'error');
                return;
            }
            
            const contact = {
                id: Utils.generateId(),
                name: name,
                phone: phone,
                relationship: relationship
            };
            
            emergency.contacts.push(contact);
            
            // Save to DB
            if (typeof DB !== 'undefined' && DB.saveEmergencyContact) {
                DB.saveEmergencyContact(contact);
            }
            
            Utils.closeModal();
            Utils.showToast(I18n.t('contact_saved') || 'Contact saved!', 'success');
            
            // Refresh emergency modal
            setTimeout(function() {
                emergency.showEmergencyModal();
            }, 300);
        },
        
        /**
         * Load contacts from DB
         */
        loadContacts: async function() {
            if (typeof DB !== 'undefined' && DB.getEmergencyContacts) {
                emergency.contacts = await DB.getEmergencyContacts();
            }
        },
        
        /**
         * Log emergency event
         */
        logEmergency: function(type, data) {
            console.warn('🚨 EMERGENCY LOG:', type, data);
            
            if (typeof DB !== 'undefined' && DB.saveSetting) {
                DB.saveSetting('lastEmergency', {
                    type: type,
                    data: data,
                    timestamp: Date.now()
                });
            }
        },
        
        /**
         * Filter hospitals by city
         */
        filterHospitals: function(query) {
            const list = document.getElementById('hospitalList');
            if (!list) return;
            
            const items = list.querySelectorAll('.risk-item');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query.toLowerCase()) ? 'block' : 'none';
            });
        }
    };
    
    console.log('✅ Emergency system initialized');
    return emergency;
})();