# UI Swipe

**UI Swipe** - API-based Card Swiper App 💫

A modern, interactive swipe application with card-based UI components. Swipe left to reject, right to accept! Features infinite loading from any JSON API.

## ✨ Features

- 🎴 **Card Swipe Interface** - Intuitive Tinder-like swipe mechanics
- 🌐 **API Integration** - Fully API-based with JSONPlaceholder demo
- 🔄 **Infinite Loading** - Automatically loads new cards when stack runs low
- 📱 **Touch & Mouse** - Full support for mobile touch and desktop drag
- 💫 **Smooth Animations** - 60 FPS hardware-accelerated animations
- 🎯 **Visual Feedback** - LIKE/NOPE indicators during swipe
- 📊 **Swipe Counter** - Track how many cards you've reviewed
- 🎨 **Beautiful Design** - Modern gradient cards with stack effect
- 📱 **Mobile-First** - Optimized for all screen sizes

## 🎮 How to Use

1. **Swipe** - Drag cards left (Nope) or right (Like)
2. **Buttons** - Click ❌ to reject or ❤️ to accept
3. **Infinite** - Keep swiping, new cards load automatically!

## 🚀 Quick Start

### Run Locally

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .

# Then open: http://localhost:8080
```

### Change API Source

Edit `script.js` and modify the API URL:

```javascript
// Change this line to use your own API
this.apiService = new APIService('https://your-api.com/endpoint');
```

Your API should return JSON with these fields:
- `id` - Unique identifier
- `title` - Card title
- `url` - Image URL
- (optional) Any additional data you want to display

## 📂 File Structure

```
UI-Swipe/
├── index.html    # HTML structure
├── styles.css    # Modern CSS with animations
├── script.js     # API service, swipe controller, card manager
├── LICENSE       # MIT License
└── README.md     # This file
```

## 🏗️ Architecture

### Class Structure

- **APIService** - Handles data fetching, caching, and mock data
- **SwipeController** - Manages touch/mouse interactions and animations
- **CardManager** - Controls card stack, rendering, and infinite loading
- **SwipeApp** - Main application orchestrator

### Key Features

- **Smart Caching** - Reduces API calls
- **Mock Fallback** - Generates beautiful gradient cards if API fails
- **XSS Protection** - Sanitizes all user-provided data
- **Error Handling** - Graceful degradation on failures

## 💻 Technologies

- **HTML5** - Semantic markup
- **CSS3** - Gradients, transforms, animations
- **JavaScript** - ES6+ classes, async/await, Fetch API
- **Canvas API** - For generating mock card images

## 🎨 Customization

### Change Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --accent-like: #10b981;     /* Like button color */
    --accent-dislike: #ef4444;  /* Dislike button color */
    --accent-primary: #6366f1;  /* Primary accent */
    --bg-primary: #0f0f23;      /* Background */
}
```

### Adjust Loading Behavior

Modify parameters in `script.js`:

```javascript
this.minStackSize = 3;      // Load more when below this
this.initialLoadSize = 5;   // First batch size
this.batchSize = 5;         // Subsequent batch size
```

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (iOS & macOS)
- ✅ Mobile browsers (iOS & Android)

## 🔒 Security

- HTML sanitization to prevent XSS attacks
- Safe image loading with lazy loading
- No inline scripts or eval()
- Content Security Policy ready

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Credits

Built with modern web technologies. Inspired by popular swipe-based interfaces.

---

**Tip**: Try opening the app on your phone for the best experience! 📱✨