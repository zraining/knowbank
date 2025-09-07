# Performance Guide

Optimize your mdBook theme for speed and efficiency.

## Performance Metrics

### Key Indicators

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Time to Interactive (TTI)**: < 3.5s

### Monitoring Tools

```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Performance budget
lighthouse http://localhost:3000 --budget-path=budget.json
```

Example `budget.json`:
```json
[
  {
    \"path\": \"/*\",
    \"timings\": [
      {
        \"metric\": \"first-contentful-paint\",
        \"budget\": 1500
      },
      {
        \"metric\": \"largest-contentful-paint\",
        \"budget\": 2500
      }
    ],
    \"resourceSizes\": [
      {
        \"resourceType\": \"total\",
        \"budget\": 300
      },
      {
        \"resourceType\": \"script\",
        \"budget\": 50
      }
    ]
  }
]
```

## CSS Optimization

### Critical CSS

```css
/* Inline critical styles in head.hbs */
<style>
/* Above-the-fold styles */
html{font-family:Inter,sans-serif;color:#e2e8f0;background:#0a0e27}
body{margin:0;font-size:16px;line-height:1.6}
#menu-bar{height:55px;background:#1a1f3a;display:flex}
.sidebar{width:320px;background:#1a1f3a}
.content{max-width:900px;margin:0 auto;padding:20px}
</style>
```

### CSS Loading Strategy

```html
<!-- Critical CSS inline -->
<style>/* critical styles */</style>

<!-- Non-critical CSS with preload -->
<link rel=\"preload\" href=\"theme.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">
<noscript><link rel=\"stylesheet\" href=\"theme.css\"></noscript>

<!-- Async CSS loading polyfill -->
<script>
!function(e){\"use strict\";var t=function(t,n,r){function o(e){return i.body?e():void setTimeout(function(){o(e)})}function a(){d.addEventListener&&d.removeEventListener(\"load\",a),d.media=r||\"all\"}var i=e.document,d=i.createElement(\"link\");if(n)d.id=n;d.rel=\"stylesheet\",d.href=t,d.media=\"only x\",o(function(){i.head.appendChild(d)}),setTimeout(a),d.addEventListener&&d.addEventListener(\"load\",a)};t.loadCSS=t.loadCSS||t,\"undefined\"!=typeof module&&(module.exports=t.loadCSS)}(this);
</script>
```

### CSS Minification

```bash
# Using cssnano
npm install cssnano postcss-cli
postcss theme/css/*.css --use cssnano --dir theme/css/min/

# Using clean-css
npm install clean-css-cli
cleancss -o theme/css/styles.min.css theme/css/*.css
```

## Font Optimization

### Font Loading Strategy

```css
/* Preload critical fonts */
@font-face {
  font-family: 'Inter';
  src: url('./fonts/inter-var.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}

/* Subset fonts for different languages */
@font-face {
  font-family: 'Inter';
  src: url('./fonts/inter-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF;
  font-display: swap;
}
```

### Font Preloading

```html
<!-- Preload variable font -->
<link rel=\"preload\" href=\"fonts/inter-var.woff2\" as=\"font\" type=\"font/woff2\" crossorigin>

<!-- Preload monospace font -->
<link rel=\"preload\" href=\"fonts/jetbrains-mono.woff2\" as=\"font\" type=\"font/woff2\" crossorigin>
```

### Font Subsetting

```bash
# Using pyftsubset (fonttools)
pip install fonttools[woff]

# Subset for Latin characters
pyftsubset inter.ttf \\n  --output-file=inter-latin.woff2 \\n  --flavor=woff2 \\n  --layout-features='kern,liga' \\n  --unicodes=U+0000-00FF,U+0131,U+0152-0153

# Subset for code characters
pyftsubset jetbrains-mono.ttf \\n  --output-file=jetbrains-mono-code.woff2 \\n  --flavor=woff2 \\n  --unicodes=U+0020-007F,U+00A0-00FF
```

## JavaScript Optimization

### Code Splitting

```javascript
// Lazy load non-critical features
const loadSearchModule = () => {
  return import('./modules/search.js')
    .then(module => {
      module.initializeSearch();
    })
    .catch(err => {
      console.warn('Search module failed to load:', err);
    });
};

// Load search only when needed
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    loadSearchModule();
  }
});

// Intersection Observer for lazy features
const observeElement = (selector, callback) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll(selector).forEach(el => {
    observer.observe(el);
  });
};

// Lazy load table of contents
observeElement('.content h2', () => {
  import('./modules/toc.js').then(module => {
    module.generateTOC();
  });
});
```

### Bundle Optimization

```javascript
// Tree shaking friendly imports
import { debounce } from './utils/debounce.js';
import { throttle } from './utils/throttle.js';

// Avoid importing entire libraries
// ❌ import _ from 'lodash';
// ✅ import debounce from 'lodash/debounce';

// Use native APIs when possible
// ❌ $(element).addClass('active');
// ✅ element.classList.add('active');

// Efficient event delegation
const handleClick = (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  
  const action = target.dataset.action;
  switch (action) {
    case 'toggle-theme':
      toggleTheme();
      break;
    case 'copy-code':
      copyCodeBlock(target);
      break;
  }
};

document.addEventListener('click', handleClick);
```

## Image Optimization

### Responsive Images

```html
<!-- Modern image formats with fallbacks -->
<picture>
  <source srcset=\"image.avif\" type=\"image/avif\">
  <source srcset=\"image.webp\" type=\"image/webp\">
  <img src=\"image.jpg\" alt=\"Description\" loading=\"lazy\">
</picture>

<!-- Responsive images -->
<img 
  src=\"image-400.jpg\" 
  srcset=\"image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w\"
  sizes=\"(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px\"
  alt=\"Description\"
  loading=\"lazy\"
>
```

### Image Processing

```bash
# Convert to WebP
cwebp -q 80 input.jpg -o output.webp

# Convert to AVIF
avifenc --min 0 --max 63 -a end-usage=q -a cq-level=18 input.jpg output.avif

# Generate responsive images
for size in 400 800 1200; do
  convert input.jpg -resize ${size}x output-${size}.jpg
done
```

### Lazy Loading

```javascript
// Native lazy loading with fallback
const images = document.querySelectorAll('img[loading=\"lazy\"]');

// Fallback for browsers without native lazy loading
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported
  console.log('Native lazy loading supported');
} else {
  // Use Intersection Observer polyfill
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}
```

## Build Optimization

### Asset Pipeline

```bash
#!/bin/bash
# build-optimized.sh

echo \"Building optimized mdBook...\"

# Clean previous build
mdbook clean

# Optimize CSS
echo \"Optimizing CSS...\"
postcss theme/css/*.css --use autoprefixer cssnano --dir theme/css/min/

# Optimize JavaScript
echo \"Optimizing JavaScript...\"
terser theme/js/custom.js --compress --mangle --output theme/js/custom.min.js

# Optimize images
echo \"Optimizing images...\"
find src -name \"*.jpg\" -o -name \"*.png\" | xargs -I {} sh -c '
  name=$(basename \"{}\" | sed \"s/\\.[^.]*$//\")
  dir=$(dirname \"{}\")
  cwebp -q 80 \"{}\" -o \"$dir/$name.webp\"
'

# Build with mdBook
mdbook build

# Post-process HTML
echo \"Post-processing HTML...\"
find book -name \"*.html\" | xargs -I {} sh -c '
  html-minifier \\n    --collapse-whitespace \\n    --remove-comments \\n    --remove-redundant-attributes \\n    --use-short-doctype \\n    --minify-css \\n    --minify-js \\n    \"{}\" -o \"{}\"
'

echo \"Build complete!\"
```

### Compression

```bash
# Gzip compression
find book -type f \\( -name '*.html' -o -name '*.css' -o -name '*.js' \\) \\n  -exec gzip -k9 {} \\;

# Brotli compression (better than gzip)
find book -type f \\( -name '*.html' -o -name '*.css' -o -name '*.js' \\) \\n  -exec brotli -k9 {} \\;
```

## Caching Strategy

### Service Worker

```javascript
// sw.js - Service Worker for caching
const CACHE_NAME = 'mdbook-v1';
const urlsToCache = [
  '/',
  '/theme/css/styles.min.css',
  '/theme/js/custom.min.js',
  '/theme/fonts/inter-var.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

### Cache Headers

```nginx
# nginx.conf
location ~* \\.(css|js|woff2|png|jpg|webp)$ {
    expires 1y;
    add_header Cache-Control \"public, immutable\";
    add_header Vary \"Accept-Encoding\";
}

location ~* \\.(html)$ {
    expires 1h;
    add_header Cache-Control \"public, must-revalidate\";
}
```

## Monitoring and Analysis

### Performance Budget

```json
{
  \"budgets\": [
    {
      \"path\": \"/*\",
      \"resourceSizes\": [
        { \"resourceType\": \"total\", \"budget\": 300 },
        { \"resourceType\": \"script\", \"budget\": 50 },
        { \"resourceType\": \"stylesheet\", \"budget\": 30 },
        { \"resourceType\": \"font\", \"budget\": 100 },
        { \"resourceType\": \"image\", \"budget\": 100 }
      ],
      \"timings\": [
        { \"metric\": \"first-contentful-paint\", \"budget\": 1500 },
        { \"metric\": \"largest-contentful-paint\", \"budget\": 2500 },
        { \"metric\": \"speed-index\", \"budget\": 2000 }
      ]
    }
  ]
}
```

### Real User Monitoring

```javascript
// Collect Core Web Vitals
function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

// CLS
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      sendToAnalytics({
        name: 'CLS',
        value: entry.value,
        rating: entry.value < 0.1 ? 'good' : entry.value < 0.25 ? 'needs-improvement' : 'poor'
      });
    }
  }
}).observe({type: 'layout-shift', buffered: true});

// FID
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    sendToAnalytics({
      name: 'FID',
      value: entry.processingStart - entry.startTime,
      rating: entry.processingStart - entry.startTime < 100 ? 'good' : 'needs-improvement'
    });
  }
}).observe({type: 'first-input', buffered: true});

// LCP
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];
  sendToAnalytics({
    name: 'LCP',
    value: lastEntry.startTime,
    rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor'
  });
}).observe({type: 'largest-contentful-paint', buffered: true});
```

---

*With these optimizations, your mdBook will load fast and provide an excellent user experience!*