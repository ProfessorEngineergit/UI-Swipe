// SwipeVerse - Ultra Addictive Social Media Experience
// Disable double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent pinch zoom
document.addEventListener('gesturestart', (event) => {
    event.preventDefault();
});

document.addEventListener('gesturechange', (event) => {
    event.preventDefault();
});

document.addEventListener('gestureend', (event) => {
    event.preventDefault();
});

// State Management
const state = {
    posts: [],
    currentPage: 1,
    isLoading: false,
    hasMorePosts: true,
    likedPosts: new Set(),
    doubleTapTimeout: null
};

// DOM Elements
const feedContainer = document.getElementById('feedContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const likeAnimation = document.getElementById('likeAnimation');
const swipeIndicator = document.getElementById('swipeIndicator');
const bottomNavButtons = document.querySelectorAll('.nav-btn');

// API Configuration - Using JSONPlaceholder for posts and Picsum for images
const API_BASE = 'https://jsonplaceholder.typicode.com';
const IMAGE_BASE = 'https://picsum.photos';

// Initialize App
async function initApp() {
    console.log('🚀 Initializing SwipeVerse...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial posts
    await loadPosts();
    
    // Hide swipe indicator after 5 seconds
    setTimeout(() => {
        swipeIndicator.classList.add('hidden');
    }, 5000);
    
    // Setup infinite scroll
    setupInfiniteScroll();
}

// Setup Event Listeners
function setupEventListeners() {
    // Bottom navigation
    bottomNavButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            bottomNavButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.getAttribute('data-tab');
            handleNavigation(tab);
        });
    });
    
    // Notification button
    document.getElementById('notificationBtn').addEventListener('click', () => {
        showNotification('Du hast 3 neue Benachrichtigungen! 🔥');
    });
    
    // Menu button
    document.getElementById('menuBtn').addEventListener('click', () => {
        showNotification('Menü wird geladen... ⚡');
    });
}

// Handle Navigation
function handleNavigation(tab) {
    console.log(`Navigating to: ${tab}`);
    
    const messages = {
        home: 'Willkommen zurück! 🏠',
        explore: 'Entdecke neue Inhalte! 🔍',
        add: 'Erstelle deinen Post! ➕',
        messages: 'Deine Nachrichten 💬',
        profile: 'Dein Profil 👤'
    };
    
    if (messages[tab]) {
        showNotification(messages[tab]);
    }
    
    // Scroll to top on home
    if (tab === 'home') {
        feedContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Mock Data Fallback
const mockUsers = [
    { id: 1, name: 'Max Mustermann', company: { name: 'Tech Innovations GmbH' } },
    { id: 2, name: 'Anna Schmidt', company: { name: 'Digital Dynamics' } },
    { id: 3, name: 'Tom Weber', company: { name: 'Code Masters' } },
    { id: 4, name: 'Lisa Müller', company: { name: 'Creative Studios' } },
    { id: 5, name: 'Chris Berg', company: { name: 'Future Labs' } },
    { id: 6, name: 'Sarah Klein', company: { name: 'DevOps Pro' } },
    { id: 7, name: 'Paul Richter', company: { name: 'AI Research' } },
    { id: 8, name: 'Emma Koch', company: { name: 'Cloud Solutions' } },
    { id: 9, name: 'Leon Wolf', company: { name: 'Data Science Inc' } },
    { id: 10, name: 'Nina Bauer', company: { name: 'UX Design Co' } }
];

const mockPosts = [
    { title: 'Unglaubliche neue KI-Technologie revolutioniert die Entwicklung! 🚀', body: 'Machine Learning erreicht neue Höhen...' },
    { title: 'Die 10 besten Coding-Tipps für 2024 💻', body: 'Experten teilen ihre Geheimnisse...' },
    { title: 'Neues Framework übertrifft alle Erwartungen! ⚡', body: 'Performance-Steigerung um 300%...' },
    { title: 'Bahnbrechende Discovery in der Cybersecurity 🔒', body: 'Neue Verschlüsselungsmethode entwickelt...' },
    { title: 'Cloud Computing 2.0 ist hier! ☁️', body: 'Die Zukunft der Infrastruktur...' },
    { title: 'Quantencomputer macht große Fortschritte 🔬', body: 'Wissenschaftler erzielen Durchbruch...' },
    { title: 'Blockchain-Innovation verändert alles 🔗', body: 'Neue Anwendungsfälle entdeckt...' },
    { title: 'VR/AR erreicht neue Dimensionen 🥽', body: 'Immersive Erlebnisse wie nie zuvor...' },
    { title: 'Open Source Projekt goes viral! 🌟', body: '100K Stars in einer Woche...' },
    { title: 'IoT-Geräte werden noch smarter 📱', body: 'Die nächste Generation ist da...' },
    { title: 'Neuronale Netze lernen menschliche Kreativität 🎨', body: 'Erstaunliche Ergebnisse in Tests...' },
    { title: 'Developer Community wächst exponentiell 👥', body: 'Millionen neue Programmierer weltweit...' },
    { title: 'Green Tech Solutions für eine bessere Zukunft 🌱', body: 'Nachhaltigkeit trifft Technologie...' },
    { title: 'Robotik-Startup erhält Mega-Finanzierung 🤖', body: '500M Investment für autonome Systeme...' },
    { title: 'API-Design erreicht Perfektion ✨', body: 'RESTful war gestern, das hier ist morgen...' }
];

// Fetch Posts from API
async function fetchPosts(page = 1) {
    try {
        const response = await fetch(`${API_BASE}/posts?_page=${page}&_limit=10`);
        if (!response.ok) throw new Error('API not available');
        
        const posts = await response.json();
        
        // Fetch users for each post
        const usersResponse = await fetch(`${API_BASE}/users`);
        const users = await usersResponse.json();
        
        // Enrich posts with user data and random images
        return posts.map(post => ({
            id: post.id,
            userId: post.userId,
            title: post.title,
            body: post.body,
            user: users.find(u => u.id === post.userId) || {},
            image: `${IMAGE_BASE}/600/400?random=${post.id}`,
            likes: Math.floor(Math.random() * 5000) + 100,
            comments: Math.floor(Math.random() * 500) + 10,
            shares: Math.floor(Math.random() * 200) + 5,
            timestamp: getRandomTimestamp()
        }));
    } catch (error) {
        console.log('📦 Using mock data (API not available)');
        // Return mock data as fallback
        return generateMockPosts(page);
    }
}

// Generate placeholder image with gradient
function getPlaceholderImage(postId) {
    const colors = [
        ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
        ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#30cfd0', '#330867'],
        ['#a8edea', '#fed6e3'], ['#ff9a9e', '#fecfef'], ['#ffecd2', '#fcb69f'],
        ['#ff6e7f', '#bfe9ff'], ['#e0c3fc', '#8ec5fc'], ['#fbc2eb', '#a6c1ee']
    ];
    const colorPair = colors[postId % colors.length];
    
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, colorPair[0]);
    gradient.addColorStop(1, colorPair[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);
    
    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 600, Math.random() * 400, Math.random() * 100 + 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Add text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Post #${postId}`, 300, 200);
    
    return canvas.toDataURL('image/jpeg', 0.85);
}

// Generate Mock Posts
function generateMockPosts(page = 1) {
    const postsPerPage = 10;
    const startIdx = (page - 1) * postsPerPage;
    const posts = [];
    
    for (let i = 0; i < postsPerPage; i++) {
        const idx = (startIdx + i) % mockPosts.length;
        const userIdx = (startIdx + i) % mockUsers.length;
        const postId = startIdx + i + 1;
        
        posts.push({
            id: postId,
            userId: mockUsers[userIdx].id,
            title: mockPosts[idx].title,
            body: mockPosts[idx].body,
            user: mockUsers[userIdx],
            image: getPlaceholderImage(postId),
            likes: Math.floor(Math.random() * 5000) + 100,
            comments: Math.floor(Math.random() * 500) + 10,
            shares: Math.floor(Math.random() * 200) + 5,
            timestamp: getRandomTimestamp()
        });
    }
    
    return posts;
}

// Load Posts
async function loadPosts() {
    if (state.isLoading || !state.hasMorePosts) return;
    
    state.isLoading = true;
    loadingSpinner.classList.remove('hidden');
    
    const newPosts = await fetchPosts(state.currentPage);
    
    if (newPosts.length === 0) {
        state.hasMorePosts = false;
        loadingSpinner.innerHTML = '<p>Das war\'s! Keine weiteren Posts 🎉</p>';
        return;
    }
    
    state.posts.push(...newPosts);
    state.currentPage++;
    
    renderPosts(newPosts);
    
    state.isLoading = false;
    loadingSpinner.classList.add('hidden');
}

// Render Posts
function renderPosts(posts) {
    posts.forEach(post => {
        const postElement = createPostElement(post);
        feedContainer.insertBefore(postElement, loadingSpinner);
    });
}

// Create Post Element
function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.dataset.postId = post.id;
    
    const userInitial = post.user.name ? escapeHtml(post.user.name[0].toUpperCase()) : 'U';
    const username = escapeHtml(post.user.name || 'Anonymous User');
    const userCompany = escapeHtml(post.user.company?.name || 'Tech Enthusiast');
    const postTitle = escapeHtml(post.title);
    
    article.innerHTML = `
        <div class="post-header">
            <div class="avatar">${userInitial}</div>
            <div class="user-info">
                <div class="username">${username}</div>
                <div class="post-time">${escapeHtml(post.timestamp)} • ${userCompany}</div>
            </div>
            <button class="post-options">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
            </button>
        </div>
        <div class="post-content">
            <p class="post-text">${postTitle}</p>
            <img src="${escapeHtml(post.image)}" alt="${postTitle}" class="post-image" loading="lazy">
        </div>
        <div class="post-stats">
            <span class="stat-item">
                <strong>${formatNumber(post.likes)}</strong> Likes
            </span>
            <span class="stat-item">
                <strong>${formatNumber(post.comments)}</strong> Kommentare
            </span>
            <span class="stat-item">
                <strong>${formatNumber(post.shares)}</strong> Shares
            </span>
        </div>
        <div class="post-actions">
            <button class="action-btn like-btn" data-post-id="${post.id}">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>Like</span>
            </button>
            <button class="action-btn comment-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
                <span>Kommentar</span>
            </button>
            <button class="action-btn share-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                <span>Teilen</span>
            </button>
        </div>
    `;
    
    // Setup post interactions
    setupPostInteractions(article, post);
    
    return article;
}

// Setup Post Interactions
function setupPostInteractions(article, post) {
    const likeBtn = article.querySelector('.like-btn');
    const commentBtn = article.querySelector('.comment-btn');
    const shareBtn = article.querySelector('.share-btn');
    const postImage = article.querySelector('.post-image');
    
    // Like button
    likeBtn.addEventListener('click', () => {
        toggleLike(post.id, likeBtn);
    });
    
    // Double tap on image to like
    let lastImageTap = 0;
    postImage.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastImageTap < 300) {
            e.preventDefault();
            toggleLike(post.id, likeBtn);
            showLikeAnimation();
        }
        lastImageTap = now;
    });
    
    // Comment button
    commentBtn.addEventListener('click', () => {
        showNotification('Kommentarfunktion kommt bald! 💬');
    });
    
    // Share button
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.body,
                url: window.location.href
            }).catch(() => {
                showNotification('Geteilt! 🚀');
            });
        } else {
            showNotification('Geteilt! 🚀');
        }
    });
}

// Toggle Like
function toggleLike(postId, button) {
    if (state.likedPosts.has(postId)) {
        state.likedPosts.delete(postId);
        button.classList.remove('liked');
    } else {
        state.likedPosts.add(postId);
        button.classList.add('liked');
        showLikeAnimation();
    }
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Show Like Animation
function showLikeAnimation() {
    likeAnimation.classList.add('show');
    setTimeout(() => {
        likeAnimation.classList.remove('show');
    }, 800);
}

// Show Notification
function showNotification(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(99, 102, 241, 0.95);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        animation: slideDown 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Setup Infinite Scroll
function setupInfiniteScroll() {
    feedContainer.addEventListener('scroll', () => {
        const scrollPosition = feedContainer.scrollTop + feedContainer.clientHeight;
        const scrollHeight = feedContainer.scrollHeight;
        
        // Load more when 80% scrolled
        if (scrollPosition >= scrollHeight * 0.8 && !state.isLoading) {
            loadPosts();
        }
    });
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function getRandomTimestamp() {
    const timestamps = [
        'Gerade eben',
        '2 Min',
        '5 Min',
        '15 Min',
        '30 Min',
        '1 Std',
        '2 Std',
        '5 Std',
        '12 Std',
        '1 Tag',
        '2 Tage',
        '1 Woche'
    ];
    return timestamps[Math.floor(Math.random() * timestamps.length)];
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Service Worker for PWA (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

console.log('🎉 SwipeVerse loaded successfully!');
