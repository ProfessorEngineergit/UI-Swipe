/**
 * API-Based Swipe App
 * Modern card-based swipe application with infinite loading
 */

// ===========================
// Utility Functions
// ===========================

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===========================
// API Service Class
// ===========================
class APIService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.page = 1;
        this.cache = new Map();
    }

    /**
     * Fetch cards from API with pagination
     * @param {number} limit - Number of cards to fetch
     * @returns {Promise<Array>} Array of card data
     */
    async fetchCards(limit = 10) {
        const url = `${this.apiUrl}?page=${this.page}&limit=${limit}`;
        
        try {
            // Check cache first
            if (this.cache.has(url)) {
                console.log('📦 Returning cached data for page', this.page);
                this.page++;
                return this.cache.get(url);
            }

            console.log(`🌐 Fetching page ${this.page} from API...`);
            
            try {
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Transform Picsum API data to card format
                // Picsum returns: [{ id, author, width, height, url, download_url }, ...]
                const cards = data.map(item => ({
                    id: item.id,
                    title: item.author,
                    description: `Photo by ${item.author} - ${item.width}x${item.height}`,
                    imageUrl: item.download_url,
                    thumbnailUrl: item.download_url
                }));
                
                // Cache the result
                this.cache.set(url, cards);
                this.page++;
                
                return cards;
            } catch (fetchError) {
                console.warn('⚠️ API fetch failed, using mock data:', fetchError.message);
                // Fallback to mock data if API fails
                const start = (this.page - 1) * limit;
                return this.generateMockCards(start, limit);
            }
        } catch (error) {
            console.error('❌ Error fetching cards:', error);
            throw error;
        }
    }

    /**
     * Generate mock cards for fallback
     * @param {number} start - Starting ID
     * @param {number} limit - Number of cards to generate
     * @returns {Array} Array of mock card data
     */
    generateMockCards(start, limit) {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
        ];
        
        const titles = [
            'Beautiful Sunset',
            'Mountain Peak',
            'Ocean Waves',
            'City Lights',
            'Forest Path',
            'Desert Dunes',
            'Northern Lights',
            'Tropical Paradise',
            'Snowy Mountains',
            'Autumn Leaves'
        ];
        
        const cards = [];
        for (let i = 0; i < limit; i++) {
            const id = start + i + 1;
            const colorIndex = (id - 1) % colors.length;
            const titleIndex = (id - 1) % titles.length;
            
            cards.push({
                id: id,
                title: `${titles[titleIndex]} #${id}`,
                description: `Beautiful API-generated image from placeholder`,
                imageUrl: this.createMockImage(colors[colorIndex], id),
                thumbnailUrl: this.createMockImage(colors[colorIndex], id)
            });
        }
        
        this.page++;
        return cards;
    }

    /**
     * Create a mock image with gradient and text
     * @param {string} gradient - CSS gradient
     * @param {number} id - Card ID
     * @returns {string} Data URL
     */
    createMockImage(gradient, id) {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        // Gradient color map
        const gradientMap = {
            '#667eea': { start: '#667eea', end: '#764ba2' },
            '#f093fb': { start: '#f093fb', end: '#f5576c' },
            '#4facfe': { start: '#4facfe', end: '#00f2fe' },
            '#43e97b': { start: '#43e97b', end: '#38f9d7' },
            '#fa709a': { start: '#fa709a', end: '#fee140' },
            '#30cfd0': { start: '#30cfd0', end: '#330867' },
            '#a8edea': { start: '#a8edea', end: '#fed6e3' },
            '#ff9a9e': { start: '#ff9a9e', end: '#fecfef' },
            '#ffecd2': { start: '#ffecd2', end: '#fcb69f' },
            '#ff6e7f': { start: '#ff6e7f', end: '#bfe9ff' }
        };
        
        // Find matching gradient or use default
        let colors = { start: '#ff6e7f', end: '#bfe9ff' };
        for (const [key, value] of Object.entries(gradientMap)) {
            if (gradient.includes(key)) {
                colors = value;
                break;
            }
        }
        
        // Create gradient background
        const gradientObj = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradientObj.addColorStop(0, colors.start);
        gradientObj.addColorStop(1, colors.end);
        
        ctx.fillStyle = gradientObj;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Card #${id}`, canvas.width / 2, canvas.height / 2);
        
        // Add decorative icon
        ctx.font = '80px Arial';
        ctx.fillText('🎴', canvas.width / 2, canvas.height / 2 - 100);
        
        return canvas.toDataURL('image/png');
    }

    /**
     * Reset pagination to start
     */
    reset() {
        this.page = 1;
    }
}

// ===========================
// Swipe Controller Class
// ===========================
class SwipeController {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.options = {
            threshold: 100, // Swipe threshold in pixels
            rotation: 15,   // Max rotation in degrees (unused in vertical-only mode)
            onSwipe: () => {}, // Callback for swipe completion
            ...options
        };
        
        this.currentCard = null;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragging = false;
        
        this.init();
    }

    init() {
        // Touch events
        this.container.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
        this.container.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.handleEnd.bind(this));
        
        // Mouse events
        this.container.addEventListener('mousedown', this.handleStart.bind(this));
        this.container.addEventListener('mousemove', this.handleMove.bind(this));
        this.container.addEventListener('mouseup', this.handleEnd.bind(this));
        this.container.addEventListener('mouseleave', this.handleEnd.bind(this));
    }

    handleStart(e) {
        // Only handle first card
        const card = this.container.querySelector('.swipe-card:first-child');
        if (!card) return;
        
        this.currentCard = card;
        this.isDragging = true;
        
        const point = e.touches ? e.touches[0] : e;
        this.startX = point.clientX;
        this.startY = point.clientY;
        
        card.classList.add('grabbing', 'swiping');
        
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
    }

    handleMove(e) {
        if (!this.isDragging || !this.currentCard) return;
        
        const point = e.touches ? e.touches[0] : e;
        this.currentX = 0; // Force horizontal to 0 - only vertical swipe allowed
        this.currentY = point.clientY - this.startY;
        
        // Only allow downward movement (positive Y)
        if (this.currentY < 0) {
            this.currentY = 0;
        }
        
        // Apply transform - only vertical translation, no rotation
        this.currentCard.style.transform = `translate(0px, ${this.currentY}px)`;
        
        // Hide like/nope indicators since we only swipe down
        this.currentCard.classList.remove('show-like', 'show-nope');
        
        if (e.type === 'touchmove') {
            e.preventDefault();
        }
    }

    handleEnd(e) {
        if (!this.isDragging || !this.currentCard) return;
        
        this.isDragging = false;
        this.currentCard.classList.remove('grabbing');
        
        const threshold = this.options.threshold;
        
        // Check if downward swipe was strong enough
        if (this.currentY > threshold) {
            // Complete the swipe (swipe down to proceed)
            this.completeSwipe(true);
        } else {
            // Reset card position
            this.resetCard();
        }
    }

    completeSwipe(isLike) {
        if (!this.currentCard) return;
        
        const card = this.currentCard;
        // Vertical exit animation - slide down
        const endY = window.innerHeight * 1.5;
        
        card.classList.add('removing');
        card.classList.remove('swiping', 'show-like', 'show-nope');
        card.style.transform = `translate(0px, ${endY}px)`;
        card.style.opacity = '0';
        
        // Trigger callback
        setTimeout(() => {
            this.options.onSwipe(card);
        }, 100);
    }

    resetCard() {
        if (!this.currentCard) return;
        
        this.currentCard.classList.remove('swiping', 'show-like', 'show-nope');
        this.currentCard.style.transform = '';
        this.currentCard = null;
        this.currentX = 0;
        this.currentY = 0;
    }

    /**
     * Programmatically trigger swipe (down only)
     */
    swipe() {
        const card = this.container.querySelector('.swipe-card:first-child');
        if (!card) return;
        
        this.currentCard = card;
        this.currentX = 0;
        this.currentY = 200; // Swipe down
        this.completeSwipe(true);
    }
}

// ===========================
// Card Manager Class
// ===========================
class CardManager {
    constructor(container, apiService, swipeController) {
        this.container = container;
        this.apiService = apiService;
        this.swipeController = swipeController;
        this.cards = [];
        this.swipeCount = 0;
        this.isLoading = false;
        this.minStackSize = 3;
        this.initialLoadSize = 5;
        this.batchSize = 5;
    }

    /**
     * Initialize the card manager
     */
    async init() {
        await this.loadInitialCards();
        this.updateSwipeCount();
    }

    /**
     * Load initial set of cards
     */
    async loadInitialCards() {
        this.showLoading();
        try {
            const newCards = await this.apiService.fetchCards(this.initialLoadSize);
            this.cards.push(...newCards);
            this.renderCards();
        } catch (error) {
            console.error('Failed to load initial cards:', error);
            this.showError('Failed to load cards. Please refresh.');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Load more cards when stack is low
     */
    async loadMoreCards() {
        if (this.isLoading || this.cards.length >= this.minStackSize) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            console.log('📥 Loading more cards...');
            const newCards = await this.apiService.fetchCards(this.batchSize);
            this.cards.push(...newCards);
            this.renderCards();
            console.log(`✅ Loaded ${newCards.length} new cards. Total: ${this.cards.length}`);
        } catch (error) {
            console.error('Failed to load more cards:', error);
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    /**
     * Render all cards in the stack
     */
    renderCards() {
        // Keep existing cards, only add new ones
        const existingIds = new Set(
            Array.from(this.container.querySelectorAll('.swipe-card'))
                .map(card => card.dataset.id)
        );
        
        this.cards.forEach((cardData, index) => {
            if (existingIds.has(String(cardData.id))) return;
            
            const card = this.createCardElement(cardData);
            this.container.appendChild(card);
        });
    }

    /**
     * Create a card DOM element
     */
    createCardElement(data) {
        const card = document.createElement('div');
        card.className = 'swipe-card';
        card.dataset.id = data.id;
        
        // Sanitize user-provided data
        const safeTitle = escapeHtml(this.truncate(data.title, 50));
        const safeDescription = escapeHtml(data.description);
        const safeImageUrl = escapeHtml(data.imageUrl);
        
        card.innerHTML = `
            <img src="${safeImageUrl}" alt="${safeTitle}" class="card-image" loading="lazy">
            <div class="card-id">#${data.id}</div>
            <div class="swipe-indicator like">LIKE</div>
            <div class="swipe-indicator nope">NOPE</div>
            <div class="card-overlay">
                <h2 class="card-title">${safeTitle}</h2>
                <p class="card-description">${safeDescription}</p>
            </div>
        `;
        
        return card;
    }

    /**
     * Handle card removal after swipe
     */
    removeCard(card) {
        // Remove from DOM after animation
        setTimeout(() => {
            card.remove();
            
            // Remove from cards array
            const cardId = parseInt(card.dataset.id);
            this.cards = this.cards.filter(c => c.id !== cardId);
            
            // Update count
            this.swipeCount++;
            this.updateSwipeCount();
            
            // Check if we need to load more cards
            if (this.cards.length < this.minStackSize) {
                this.loadMoreCards();
            }
        }, 300);
    }

    /**
     * Update swipe counter display
     */
    updateSwipeCount() {
        const counter = document.getElementById('swipeCount');
        if (counter) {
            counter.textContent = this.swipeCount;
            
            // Animate counter
            counter.style.transform = 'scale(1.3)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 200);
        }
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        const loader = document.getElementById('loadingIndicator');
        if (loader) loader.classList.add('visible');
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loader = document.getElementById('loadingIndicator');
        if (loader) loader.classList.remove('visible');
    }

    /**
     * Show error message
     */
    showError(message) {
        console.error(message);
        // Could implement a toast notification here
    }

    /**
     * Truncate text to specified length
     */
    truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// ===========================
// App Initialization
// ===========================
class SwipeApp {
    constructor() {
        // DOM Elements
        this.container = document.getElementById('swipeContainer');
        this.likeBtn = document.getElementById('likeBtn');
        this.dislikeBtn = document.getElementById('dislikeBtn');
        this.swipeHint = document.getElementById('swipeHint');
        
        // Initialize services
        this.apiService = new APIService('https://picsum.photos/v2/list');
        
        // Initialize swipe controller
        this.swipeController = new SwipeController(this.container, {
            threshold: 100,
            rotation: 15,
            onSwipe: (card) => this.handleSwipe(card)
        });
        
        // Initialize card manager
        this.cardManager = new CardManager(
            this.container,
            this.apiService,
            this.swipeController
        );
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Swipe App...');
        
        // Load initial cards
        await this.cardManager.init();
        
        // Setup button handlers
        this.setupButtonHandlers();
        
        // Show hint for a few seconds
        this.showSwipeHint();
        
        console.log('✅ Swipe App initialized!');
    }

    setupButtonHandlers() {
        this.likeBtn.addEventListener('click', () => {
            this.swipeController.swipe();
            this.vibrateIfSupported(30);
        });
        
        this.dislikeBtn.addEventListener('click', () => {
            this.swipeController.swipe();
            this.vibrateIfSupported(30);
        });
    }

    handleSwipe(card) {
        console.log('👍 Swiped on card', card.dataset.id);
        this.cardManager.removeCard(card);
        this.vibrateIfSupported(20);
    }

    showSwipeHint() {
        if (this.swipeHint) {
            this.swipeHint.classList.add('visible');
            
            setTimeout(() => {
                this.swipeHint.classList.remove('visible');
                this.swipeHint.classList.add('hidden');
            }, 4000);
        }
    }

    vibrateIfSupported(duration) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
}

// ===========================
// Start the App
// ===========================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SwipeApp();
    });
} else {
    new SwipeApp();
}
