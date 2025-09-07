# Theme Features

Your advanced mdBook theme comes packed with modern features designed for the best reading and writing experience.

## Visual Enhancements

### Multiple Theme Options

The theme includes several carefully crafted color schemes:

- **Navy** (Default) - Professional dark blue theme
- **Modern** - Clean light theme with modern aesthetics
- **Dark Modern** - Sophisticated dark theme with purple accents
- **Light** - Classic light theme
- **Coal** - Deep dark theme
- **Rust** - Warm earth-toned theme

### Enhanced Typography

- **Inter** font family for body text - optimized for readability
- **JetBrains Mono** for code - featuring programming ligatures
- Improved line spacing and text hierarchy
- Better font rendering with font smoothing

### Modern UI Elements

```css
/* Example of modern styling */
.button {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}
```

## Interactive Features

### Enhanced Code Blocks

- **Copy buttons** appear on hover
- **Syntax highlighting** for 20+ languages
- **Line numbers** and **word wrap** support
- **Responsive design** for mobile devices

### Improved Navigation

- **Smooth scrolling** between sections
- **Reading progress** indicator
- **Keyboard shortcuts** for power users
- **Table of contents** auto-generation

### Search Enhancements

- **Modern search UI** with better styling
- **Instant results** with highlighting
- **Keyboard navigation** support
- **Mobile-optimized** search experience

## Accessibility Features

### Screen Reader Support

- Semantic HTML structure
- ARIA labels and roles
- Logical tab order
- Alternative text for images

### Visual Accessibility

- High contrast mode support
- Customizable font sizes
- Reduced motion support
- Focus indicators

### Keyboard Navigation

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus search |
| `Escape` | Close search/modals |
| `Tab` | Navigate elements |
| `Space` | Scroll down |
| `Home/End` | Jump to top/bottom |

## Performance Optimizations

### Loading Speed

- **Font preloading** for faster text rendering
- **CSS optimization** with modern properties
- **Image optimization** with lazy loading
- **JavaScript bundling** for smaller payloads

### Runtime Performance

- **Smooth animations** with CSS transforms
- **Efficient event handling** with delegation
- **Memory optimization** with proper cleanup
- **Battery efficiency** with reduced reflows

## Mobile Experience

### Responsive Design

- **Touch-friendly** interface elements
- **Optimized font sizes** for mobile reading
- **Collapsible navigation** for small screens
- **Swipe gestures** for page navigation

### Progressive Web App

- **Offline reading** capability
- **Install as app** on mobile devices
- **Push notifications** for updates
- **App-like experience** with proper manifest

## Customization Options

### Theme Variables

```css
:root {
    --sidebar-width: 320px;
    --content-max-width: 900px;
    --border-radius: 8px;
    --transition: all 0.2s ease;
}
```

### Color Schemes

Easily customize colors by modifying CSS variables:

```css
.custom-theme {
    --bg: #your-background;
    --fg: #your-text-color;
    --links: #your-link-color;
    --sidebar-bg: #your-sidebar-color;
}
```

### Typography

Customize fonts through CSS variables:

```css
:root {
    --body-font: 'Your Font', sans-serif;
    --mono-font: 'Your Mono Font', monospace;
    --heading-font: 'Your Heading Font', sans-serif;
}
```

---

*These features combine to create a modern, accessible, and beautiful documentation experience.*