# Configuration Guide

Learn how to configure and customize your advanced mdBook theme.

## Basic Configuration

### book.toml Settings

Your `book.toml` file contains the main configuration:

```toml
[book]
title = \"KnowBank\"
authors = [\"Your Name\"]
language = \"en\"
description = \"Advanced Knowledge Bank with Custom Theme\"

[output.html]
# Theme configuration
default-theme = \"navy\"
preferred-dark-theme = \"navy\"
theme = \"theme\"

# Advanced features
smart-punctuation = true
mathjax-support = true
enable-search = true
print-enable = true

# Custom assets
additional-css = [\"theme/css/custom.css\"]
additional-js = [\"theme/js/custom.js\"]
```

### Theme Selection

Available themes:

- `navy` (default) - Professional dark blue
- `modern` - Clean light theme
- `dark-modern` - Dark theme with purple accents
- `light` - Classic light theme
- `coal` - Deep dark theme
- `rust` - Warm earth tones

## Advanced Customization

### Custom CSS Variables

Modify colors in `theme/css/variables.css`:

```css
:root {
    /* Layout */
    --sidebar-width: 320px;
    --content-max-width: 900px;
    --page-padding: 20px;
    
    /* Typography */
    --body-font-size: 16px;
    --line-height: 1.6;
    --heading-line-height: 1.3;
    
    /* Effects */
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    --transition: all 0.2s ease;
}
```

### Custom Theme Creation

Create a new theme in `variables.css`:

```css
.my-custom-theme {
    --bg: #your-background;
    --fg: #your-text;
    --sidebar-bg: #your-sidebar;
    --sidebar-fg: #your-sidebar-text;
    --links: #your-links;
    --icons: #your-icons;
    /* ... more variables */
}
```

### Font Customization

Add custom fonts in `theme/fonts/fonts.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600&display=swap');

:root {
    --body-font: 'YourFont', sans-serif;
    --mono-font: 'YourMonoFont', monospace;
}
```

## Feature Configuration

### Search Settings

```toml
[output.html.search]
enable = true
limit-results = 30
use-boolean-and = true
boost-title = 2
boost-hierarchy = 1
expand = true
```

### Math Support

```toml
[output.html]
mathjax-support = true
```

Then use math in your content:

```markdown
$$
f(x) = \\sum_{i=0}^{n} a_i x^i
$$
```

### Code Highlighting

Supported languages include:
- JavaScript/TypeScript
- Python
- Rust
- Go
- Java
- C/C++
- CSS/SCSS
- HTML
- JSON/YAML
- And many more!

## Mobile Configuration

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
    :root {
        --sidebar-width: 280px;
        --page-padding: 15px;
        --content-max-width: 100%;
    }
}

/* Tablet */
@media (max-width: 1024px) {
    :root {
        --sidebar-width: 300px;
        --page-padding: 18px;
    }
}
```

### Touch Gestures

The theme includes:
- Swipe navigation on mobile
- Touch-friendly button sizes
- Optimized scroll behavior
- Pinch-to-zoom support

## Build Configuration

### Development

```bash
# Start development server
mdbook serve

# Build for production
mdbook build

# Clean build directory
mdbook clean
```

### GitHub Pages

For GitHub Pages deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy mdBook
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup mdBook
      uses: peaceiris/actions-mdbook@v1
      with:
        mdbook-version: 'latest'
    - run: mdbook build
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./book
```

## Performance Tuning

### Image Optimization

```markdown
<!-- Use optimized images -->
![Alt text](./images/optimized-image.webp)

<!-- Lazy loading -->
<img src=\"./images/large-image.jpg\" loading=\"lazy\" alt=\"Description\">
```

### Font Loading

```css
/* Preload critical fonts */
@font-face {
    font-family: 'Inter';
    src: url('./fonts/inter.woff2') format('woff2');
    font-display: swap;
}
```

### Bundle Size

- Minimize custom CSS/JS
- Use CSS variables instead of repeated styles
- Optimize images before adding
- Remove unused theme files

## Troubleshooting

### Common Issues

**Theme not loading:**
- Check `book.toml` theme path
- Verify file permissions
- Clear browser cache

**Fonts not working:**
- Check internet connection for Google Fonts
- Verify font URLs in `fonts.css`
- Check console for loading errors

**Search not working:**
- Ensure search is enabled in config
- Check JavaScript console for errors
- Verify search index generation

### Debug Mode

Enable debug mode for troubleshooting:

```bash
# Verbose output
mdbook build --log-level debug

# Open dev tools in browser
# Check Console, Network, and Elements tabs
```

---

*With these configuration options, you can customize the theme to perfectly match your needs!*