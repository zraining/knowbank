# Customization Guide

Deep dive into customizing your advanced mdBook theme.

## CSS Architecture

### File Structure

```
theme/
├── css/
│   ├── variables.css    # Color schemes & CSS variables
│   ├── chrome.css       # UI elements & navigation
│   ├── general.css      # Base styles & content
│   ├── print.css        # Print-specific styles
│   └── custom.css       # Your custom additions
├── fonts/
│   └── fonts.css        # Font definitions
├── js/
│   └── custom.js        # Enhanced functionality
├── head.hbs             # Custom head content
├── index.hbs            # Main template
└── *.svg, *.png         # Icons & favicons
```

### CSS Methodology

The theme uses CSS custom properties (variables) for easy customization:

```css
/* Global variables */
:root {
    /* Colors */
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    
    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 2rem;
    
    /* Typography */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
}
```

## Creating Custom Themes

### Step 1: Define Color Palette

```css
.my-brand-theme {
    /* Background colors */
    --bg: #0a0e27;
    --sidebar-bg: #1a1f3a;
    
    /* Text colors */
    --fg: #e2e8f0;
    --sidebar-fg: #cbd5e1;
    
    /* Accent colors */
    --primary: #7c3aed;
    --secondary: #06b6d4;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    
    /* Interactive elements */
    --links: var(--primary);
    --sidebar-active: var(--primary);
    --icons: #94a3b8;
    --icons-hover: var(--fg);
}
```

### Step 2: Create Theme Variants

```css
/* Dark variant */
.my-brand-theme.dark {
    --bg: #0a0e27;
    --sidebar-bg: #1a1f3a;
}

/* Light variant */
.my-brand-theme.light {
    --bg: #ffffff;
    --sidebar-bg: #f8fafc;
    --fg: #1e293b;
    --sidebar-fg: #475569;
}
```

### Step 3: Add Interactive States

```css
.my-brand-theme {
    /* Hover states */
    --theme-hover: rgba(124, 58, 237, 0.1);
    --sidebar-hover: rgba(124, 58, 237, 0.15);
    
    /* Focus states */
    --focus-ring: 0 0 0 3px rgba(124, 58, 237, 0.3);
    
    /* Active states */
    --active-bg: rgba(124, 58, 237, 0.2);
}
```

## Component Customization

### Navigation Bar

```css
/* Custom navigation styling */
#menu-bar {
    background: linear-gradient(
        135deg, 
        var(--sidebar-bg) 0%, 
        rgba(var(--sidebar-bg), 0.95) 100%
    );
    border-bottom: 2px solid var(--primary);
}

.menu-title {
    background: linear-gradient(45deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    letter-spacing: -0.02em;
}
```

### Sidebar Styling

```css
/* Custom sidebar */
.sidebar {
    background: linear-gradient(
        180deg,
        var(--sidebar-bg) 0%,
        rgba(var(--sidebar-bg), 0.98) 100%
    );
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(var(--primary), 0.2);
}

.chapter-item a {
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.chapter-item a::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(var(--primary), 0.1), transparent);
    transition: left 0.5s;
}

.chapter-item a:hover::before {
    left: 100%;
}
```

### Content Area

```css
/* Enhanced content styling */
.content {
    background: 
        radial-gradient(circle at 20% 20%, rgba(var(--primary), 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(var(--secondary), 0.05) 0%, transparent 50%),
        var(--bg);
}

/* Custom headings */
h1 {
    position: relative;
    padding-bottom: 1rem;
}

h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 3rem;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    border-radius: 2px;
}
```

## Advanced Features

### Custom Animations

```css
/* Page transition */
.content {
    animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(2rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Hover animations */
.nav-chapters:hover {
    animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
```

### Custom Code Blocks

```css
/* Enhanced code blocks */
pre {
    background: 
        linear-gradient(135deg, var(--code-bg) 0%, rgba(var(--code-bg), 0.95) 100%);
    border: 1px solid rgba(var(--primary), 0.2);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
}

pre::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
}

/* Language badge */
pre[data-lang]::after {
    content: attr(data-lang);
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(var(--primary), 0.8);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
}
```

### Interactive Elements

```css
/* Custom buttons */
.custom-button {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border: none;
    border-radius: 8px;
    color: white;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.custom-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--secondary), var(--primary));
    opacity: 0;
    transition: opacity 0.2s ease;
}

.custom-button:hover::before {
    opacity: 1;
}

.custom-button span {
    position: relative;
    z-index: 1;
}
```

## JavaScript Customization

### Enhanced Features

```javascript
// Custom theme switching
function switchToCustomTheme(themeName) {
    document.documentElement.className = '';
    document.documentElement.classList.add(themeName);
    localStorage.setItem('mdbook-theme', themeName);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: themeName }
    }));
}

// Custom keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + T for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleCustomTheme();
    }
    
    // Ctrl/Cmd + / for command palette
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        openCommandPalette();
    }
});

// Dynamic content enhancement
function enhanceContent() {
    // Add reading time estimation
    const wordCount = document.querySelector('.content').textContent.split(' ').length;
    const readingTime = Math.ceil(wordCount / 200); // 200 WPM average
    
    const badge = document.createElement('div');
    badge.className = 'reading-time';
    badge.innerHTML = `📚 ${readingTime} min read`;
    
    const firstHeading = document.querySelector('.content h1');
    if (firstHeading) {
        firstHeading.appendChild(badge);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', enhanceContent);
```

### Custom Components

```javascript
// Create custom callout boxes
function createCallout(type, title, content) {
    const callout = document.createElement('div');
    callout.className = `callout callout-${type}`;
    callout.innerHTML = `
        <div class=\"callout-header\">
            <div class=\"callout-icon\">${getCalloutIcon(type)}</div>
            <div class=\"callout-title\">${title}</div>
        </div>
        <div class=\"callout-content\">${content}</div>
    `;
    return callout;
}

// Icons for different callout types
function getCalloutIcon(type) {
    const icons = {
        info: '💡',
        warning: '⚠️',
        error: '❌',
        success: '✅',
        tip: '💭'
    };
    return icons[type] || '📝';
}
```

## Deployment Optimization

### Production Build

```css
/* Minification-friendly CSS */
:root{--primary:#3b82f6;--bg:#0a0e27;--fg:#e2e8f0}
.my-theme{background:var(--bg);color:var(--fg)}
.btn{background:var(--primary);border:0;border-radius:8px;padding:.75rem 1.5rem}
```

### Performance Tips

1. **Use CSS containment:**
```css
.sidebar { contain: layout style paint; }
.content { contain: layout style; }
```

2. **Optimize fonts:**
```css
@font-face {
    font-family: 'Inter';
    src: url('./fonts/inter-subset.woff2') format('woff2');
    font-display: swap;
    unicode-range: U+0020-007F; /* Basic Latin */
}
```

3. **Use will-change for animations:**
```css
.animated-element {
    will-change: transform, opacity;
}
```

---

*With these customization techniques, you can create a truly unique and branded documentation experience!*