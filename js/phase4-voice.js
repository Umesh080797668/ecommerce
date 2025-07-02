/**
 * ShopVerse Phase 4: Voice Technology Integration Module
 * Advanced voice features including TTS, voice cloning, and voice control
 * @version 1.0.0
 */

class VoiceFeatures {
    constructor() {
        this.isInitialized = false;
        this.speechSynthesis = null;
        this.speechRecognition = null;
        this.voiceProfiles = new Map();
        this.currentUtterance = null;
        this.isListening = false;
        this.voiceCommands = new Map();
        
        this.init();
    }
    
    async init() {
        try {
            await this.checkVoiceCapabilities();
            this.initializeSpeechSynthesis();
            this.initializeSpeechRecognition();
            this.setupVoiceCommands();
            this.isInitialized = true;
            console.log('Voice Features initialized successfully');
        } catch (error) {
            console.error('Voice Features initialization failed:', error);
        }
    }
    
    async checkVoiceCapabilities() {
        this.capabilities = {
            speechSynthesis: 'speechSynthesis' in window,
            speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
            audioContext: 'AudioContext' in window || 'webkitAudioContext' in window,
            mediaRecorder: 'MediaRecorder' in window,
            getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        };
        
        console.log('Voice Capabilities:', this.capabilities);
        return this.capabilities;
    }
    
    initializeSpeechSynthesis() {
        if (this.capabilities.speechSynthesis) {
            this.speechSynthesis = window.speechSynthesis;
            
            // Load available voices
            this.loadVoices();
            
            // Handle voice changes
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }
        }
    }
    
    loadVoices() {
        this.availableVoices = this.speechSynthesis.getVoices();
        
        // Categorize voices by language and gender
        this.categorizedVoices = this.categorizeVoices(this.availableVoices);
        
        console.log('Available voices loaded:', this.availableVoices.length);
    }
    
    categorizeVoices(voices) {
        const categorized = {
            languages: {},
            genders: { male: [], female: [], neutral: [] },
            premium: [],
            neural: []
        };
        
        voices.forEach(voice => {
            // Group by language
            const lang = voice.lang.split('-')[0];
            if (!categorized.languages[lang]) {
                categorized.languages[lang] = [];
            }
            categorized.languages[lang].push(voice);
            
            // Group by gender (basic detection)
            const name = voice.name.toLowerCase();
            if (name.includes('male') && !name.includes('female')) {
                categorized.genders.male.push(voice);
            } else if (name.includes('female')) {
                categorized.genders.female.push(voice);
            } else {
                categorized.genders.neutral.push(voice);
            }
            
            // Identify premium/neural voices
            if (name.includes('neural') || name.includes('premium')) {
                categorized.premium.push(voice);
            }
            
            if (name.includes('neural')) {
                categorized.neural.push(voice);
            }
        });
        
        return categorized;
    }
    
    initializeSpeechRecognition() {
        if (this.capabilities.speechRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'en-US';
            
            this.setupRecognitionEventHandlers();
        }
    }
    
    setupRecognitionEventHandlers() {
        this.speechRecognition.onstart = () => {
            this.isListening = true;
            this.onListeningStart?.();
        };
        
        this.speechRecognition.onresult = (event) => {
            const results = Array.from(event.results);
            const transcript = results.map(result => result[0].transcript).join('');
            const isFinal = results.some(result => result.isFinal);
            
            this.onTranscriptUpdate?.(transcript, isFinal);
            
            if (isFinal) {
                this.processVoiceCommand(transcript);
            }
        };
        
        this.speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.onListeningError?.(event.error);
        };
        
        this.speechRecognition.onend = () => {
            this.isListening = false;
            this.onListeningEnd?.();
        };
    }
    
    // Text-to-Speech Features
    async speakText(text, options = {}) {
        if (!this.capabilities.speechSynthesis) {
            throw new Error('Speech synthesis not supported');
        }
        
        // Cancel any current speech
        this.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Apply options
        utterance.voice = this.selectVoice(options.voice);
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;
        utterance.lang = options.language || 'en-US';
        
        // Setup event handlers
        utterance.onstart = () => {
            this.onSpeechStart?.(utterance);
        };
        
        utterance.onend = () => {
            this.onSpeechEnd?.(utterance);
        };
        
        utterance.onerror = (event) => {
            this.onSpeechError?.(event);
        };
        
        this.currentUtterance = utterance;
        this.speechSynthesis.speak(utterance);
        
        return utterance;
    }
    
    selectVoice(voicePreference) {
        if (!voicePreference) {
            return this.availableVoices[0];
        }
        
        if (typeof voicePreference === 'string') {
            // Find voice by name or characteristics
            return this.availableVoices.find(voice => 
                voice.name.toLowerCase().includes(voicePreference.toLowerCase()) ||
                voice.lang.includes(voicePreference)
            ) || this.availableVoices[0];
        }
        
        if (voicePreference.gender) {
            const genderVoices = this.categorizedVoices.genders[voicePreference.gender];
            if (genderVoices.length > 0) {
                return genderVoices[0];
            }
        }
        
        if (voicePreference.language) {
            const langVoices = this.categorizedVoices.languages[voicePreference.language];
            if (langVoices && langVoices.length > 0) {
                return langVoices[0];
            }
        }
        
        return this.availableVoices[0];
    }
    
    pauseSpeech() {
        if (this.speechSynthesis.speaking && !this.speechSynthesis.paused) {
            this.speechSynthesis.pause();
            return true;
        }
        return false;
    }
    
    resumeSpeech() {
        if (this.speechSynthesis.paused) {
            this.speechSynthesis.resume();
            return true;
        }
        return false;
    }
    
    stopSpeech() {
        this.speechSynthesis.cancel();
        this.currentUtterance = null;
    }
    
    // Voice Cloning Features (Ethical Implementation)
    async createVoiceProfile(userId, consentData) {
        if (!consentData.hasConsent) {
            throw new Error('Voice cloning requires explicit user consent');
        }
        
        const profile = {
            userId,
            createdAt: new Date(),
            consent: consentData,
            status: 'pending',
            samples: [],
            characteristics: null
        };
        
        this.voiceProfiles.set(userId, profile);
        
        return {
            profileId: userId,
            status: 'created',
            nextStep: 'record_samples'
        };
    }
    
    async recordVoiceSample(userId, sampleText) {
        if (!this.capabilities.getUserMedia) {
            throw new Error('Microphone access required for voice recording');
        }
        
        const profile = this.voiceProfiles.get(userId);
        if (!profile) {
            throw new Error('Voice profile not found');
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            
            const audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const sample = {
                    id: profile.samples.length + 1,
                    text: sampleText,
                    audio: audioBlob,
                    recordedAt: new Date(),
                    duration: this.calculateAudioDuration(audioBlob),
                    characteristics: await this.analyzeVoiceSample(audioBlob)
                };
                
                profile.samples.push(sample);
                this.updateVoiceProfile(userId, profile);
                
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            
            return {
                recorder: mediaRecorder,
                stop: () => mediaRecorder.stop()
            };
        } catch (error) {
            throw new Error(`Failed to record voice sample: ${error.message}`);
        }
    }
    
    async analyzeVoiceSample(audioBlob) {
        // Mock voice analysis - in real implementation, this would use ML models
        return {
            pitch: Math.random() * 100 + 100, // Hz
            tempo: Math.random() * 200 + 100, // words per minute
            tone: ['warm', 'neutral', 'energetic'][Math.floor(Math.random() * 3)],
            accent: 'neutral',
            confidence: 0.85
        };
    }
    
    calculateAudioDuration(audioBlob) {
        // Mock duration calculation
        return Math.random() * 10 + 5; // 5-15 seconds
    }
    
    updateVoiceProfile(userId, profile) {
        // Check if enough samples are collected
        if (profile.samples.length >= 5) {
            profile.status = 'training';
            this.trainVoiceModel(userId);
        }
        
        this.voiceProfiles.set(userId, profile);
    }
    
    async trainVoiceModel(userId) {
        const profile = this.voiceProfiles.get(userId);
        if (!profile) return;
        
        // Mock voice model training
        setTimeout(() => {
            profile.status = 'ready';
            profile.characteristics = this.calculateVoiceCharacteristics(profile.samples);
            this.voiceProfiles.set(userId, profile);
            
            this.onVoiceModelReady?.(userId, profile);
        }, 5000); // Simulate training time
    }
    
    calculateVoiceCharacteristics(samples) {
        // Aggregate characteristics from all samples
        const avgPitch = samples.reduce((sum, s) => sum + s.characteristics.pitch, 0) / samples.length;
        const avgTempo = samples.reduce((sum, s) => sum + s.characteristics.tempo, 0) / samples.length;
        
        return {
            pitch: avgPitch,
            tempo: avgTempo,
            tone: samples[0].characteristics.tone, // Use first sample's tone
            quality: 'high',
            similarity: 0.92 // Confidence in voice matching
        };
    }
    
    async generateClonedSpeech(userId, text, options = {}) {
        const profile = this.voiceProfiles.get(userId);
        if (!profile || profile.status !== 'ready') {
            throw new Error('Voice profile not ready for cloning');
        }
        
        // In a real implementation, this would use the trained voice model
        // For now, we'll modify standard TTS parameters to approximate the voice
        const voiceOptions = {
            rate: profile.characteristics.tempo / 150, // Normalize to TTS rate
            pitch: Math.max(0.1, Math.min(2, profile.characteristics.pitch / 200)),
            voice: this.selectSimilarVoice(profile.characteristics),
            ...options
        };
        
        return await this.speakText(text, voiceOptions);
    }
    
    selectSimilarVoice(characteristics) {
        // Find the most similar available voice
        const targetGender = characteristics.tone === 'warm' ? 'female' : 'male';
        const genderVoices = this.categorizedVoices.genders[targetGender];
        
        if (genderVoices.length > 0) {
            return genderVoices[0];
        }
        
        return this.availableVoices[0];
    }
    
    // Voice-Controlled Navigation
    setupVoiceCommands() {
        // Define voice commands for navigation
        const commands = [
            {
                phrases: ['go home', 'home page', 'main page'],
                action: () => window.location.href = '../index.html',
                description: 'Navigate to home page'
            },
            {
                phrases: ['show cart', 'view cart', 'shopping cart'],
                action: () => window.location.href = 'cart.html',
                description: 'Open shopping cart'
            },
            {
                phrases: ['search for', 'find', 'look for'],
                action: (query) => this.performVoiceSearch(query),
                description: 'Search for products',
                hasParameter: true
            },
            {
                phrases: ['read this', 'read page', 'speak page'],
                action: () => this.readCurrentPage(),
                description: 'Read current page content'
            },
            {
                phrases: ['stop reading', 'stop speaking', 'quiet'],
                action: () => this.stopSpeech(),
                description: 'Stop text-to-speech'
            },
            {
                phrases: ['help', 'voice help', 'what can you do'],
                action: () => this.speakAvailableCommands(),
                description: 'List available voice commands'
            },
            {
                phrases: ['add to cart', 'buy this', 'purchase'],
                action: () => this.addCurrentItemToCart(),
                description: 'Add current item to cart'
            },
            {
                phrases: ['next page', 'go forward'],
                action: () => window.history.forward(),
                description: 'Go to next page'
            },
            {
                phrases: ['previous page', 'go back'],
                action: () => window.history.back(),
                description: 'Go to previous page'
            },
            {
                phrases: ['scroll up', 'go up'],
                action: () => window.scrollBy(0, -300),
                description: 'Scroll up'
            },
            {
                phrases: ['scroll down', 'go down'],
                action: () => window.scrollBy(0, 300),
                description: 'Scroll down'
            }
        ];
        
        commands.forEach(command => {
            command.phrases.forEach(phrase => {
                this.voiceCommands.set(phrase.toLowerCase(), command);
            });
        });
    }
    
    processVoiceCommand(transcript) {
        const command = transcript.toLowerCase().trim();
        
        // Try exact match first
        if (this.voiceCommands.has(command)) {
            const commandObj = this.voiceCommands.get(command);
            commandObj.action();
            return;
        }
        
        // Try partial matches for commands with parameters
        for (const [phrase, commandObj] of this.voiceCommands) {
            if (commandObj.hasParameter && command.includes(phrase)) {
                const parameter = command.replace(phrase, '').trim();
                if (parameter) {
                    commandObj.action(parameter);
                    return;
                }
            }
        }
        
        // No command found
        this.handleUnknownCommand(command);
    }
    
    handleUnknownCommand(command) {
        this.speakText(`Sorry, I didn't understand "${command}". Say "help" to hear available commands.`);
    }
    
    performVoiceSearch(query) {
        const searchInput = document.getElementById('voice-search') || document.querySelector('input[name="search"]');
        if (searchInput) {
            searchInput.value = query;
            searchInput.form?.submit();
        } else {
            this.speakText(`Searching for ${query}`);
            // Implement search logic
        }
    }
    
    readCurrentPage() {
        const content = this.extractPageContent();
        this.speakText(content, { rate: 0.9 });
    }
    
    extractPageContent() {
        // Extract main content from the page
        const selectors = [
            'main',
            '.content',
            '.page-content',
            'article',
            '.hero-content p',
            'h1',
            'h2'
        ];
        
        let content = '';
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(el => {
                    if (el.textContent.trim()) {
                        content += el.textContent.trim() + '. ';
                    }
                });
                break; // Use first matching selector
            }
        }
        
        return content || 'No content found to read.';
    }
    
    speakAvailableCommands() {
        const commandList = Array.from(this.voiceCommands.values())
            .filter((command, index, self) => 
                index === self.findIndex(c => c.description === command.description)
            )
            .map(command => command.description)
            .join(', ');
        
        this.speakText(`Available voice commands: ${commandList}`);
    }
    
    addCurrentItemToCart() {
        // Look for add to cart button
        const addToCartBtn = document.querySelector('.btn-add-to-cart, [data-action="add-to-cart"], .add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.click();
            this.speakText('Item added to cart');
        } else {
            this.speakText('No item found to add to cart');
        }
    }
    
    // Real-time Voice Translation
    async translateSpeech(audioBlob, targetLanguage) {
        try {
            // Mock translation service
            const transcription = await this.transcribeAudio(audioBlob);
            const translation = await this.translateText(transcription, targetLanguage);
            
            return {
                original: transcription,
                translated: translation,
                targetLanguage,
                confidence: 0.89
            };
        } catch (error) {
            throw new Error(`Translation failed: ${error.message}`);
        }
    }
    
    async transcribeAudio(audioBlob) {
        // Mock audio transcription
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('Hello, welcome to ShopVerse. How can I help you today?');
            }, 1000);
        });
    }
    
    async translateText(text, targetLanguage) {
        // Mock text translation
        const translations = {
            'es': 'Hola, bienvenido a ShopVerse. ¿Cómo puedo ayudarte hoy?',
            'fr': 'Bonjour, bienvenue chez ShopVerse. Comment puis-je vous aider aujourd\'hui?',
            'de': 'Hallo, willkommen bei ShopVerse. Wie kann ich Ihnen heute helfen?',
            'ja': 'こんにちは、ShopVerseへようこそ。今日はどのようにお手伝いできますか？'
        };
        
        return translations[targetLanguage] || text;
    }
    
    // Podcast-style Audio Generation
    async generatePodcastAudio(content, options = {}) {
        const podcastScript = this.formatForPodcast(content, options);
        
        return await this.speakText(podcastScript, {
            rate: 0.85,
            pitch: 0.9,
            voice: options.voice || 'podcast-narrator',
            addIntro: options.addIntro !== false,
            addOutro: options.addOutro !== false
        });
    }
    
    formatForPodcast(content, options) {
        let script = '';
        
        if (options.addIntro !== false) {
            script += 'Welcome to ShopVerse Audio. ';
        }
        
        // Add pauses and emphasis for better podcast flow
        script += content
            .replace(/\./g, '. <break time="0.5s"/>')
            .replace(/,/g, ', <break time="0.2s"/>')
            .replace(/:/g, ': <break time="0.3s"/>');
        
        if (options.addOutro !== false) {
            script += ' <break time="1s"/> Thank you for listening to ShopVerse Audio.';
        }
        
        return script;
    }
    
    // Voice Analytics
    getVoiceAnalytics() {
        return {
            totalSpeechTime: this.totalSpeechTime || 0,
            commandsProcessed: this.commandsProcessed || 0,
            voiceProfilesCreated: this.voiceProfiles.size,
            mostUsedCommands: this.getMostUsedCommands(),
            averageSessionLength: this.averageSessionLength || 0,
            successRate: this.commandSuccessRate || 0
        };
    }
    
    getMostUsedCommands() {
        // Mock command usage data
        return [
            { command: 'search for', usage: 45 },
            { command: 'read this', usage: 32 },
            { command: 'go home', usage: 28 },
            { command: 'add to cart', usage: 21 },
            { command: 'help', usage: 15 }
        ];
    }
    
    // Cleanup
    destroy() {
        this.stopSpeech();
        
        if (this.speechRecognition && this.isListening) {
            this.speechRecognition.stop();
        }
        
        this.voiceProfiles.clear();
        this.voiceCommands.clear();
    }
}

// Initialize Voice Features
const voiceFeatures = new VoiceFeatures();

// Export for global access
window.VoiceFeatures = voiceFeatures;