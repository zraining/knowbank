# KnowBank - AI Coding Agent Instructions

## Project Overview

KnowBank is an mdBook-based knowledge repository focused on modern software development, covering requirements analysis, frontend development, LLM knowledge, AI-driven programming (Vibe Coding), and Agent tools/MCP protocols. The project features a heavily customized theme with advanced styling, JavaScript enhancements, and accessibility features.

## Architecture & Key Components

### Core mdBook Structure
- **Configuration**: `book.toml` - enables MathJax, search, print support, and custom theme
- **Content**: `src/` directory with markdown files structured by domain areas
- **Navigation**: `src/SUMMARY.md` defines the book's table of contents and chapter hierarchy
- **Theme**: `theme/` directory contains extensive customizations overriding default mdBook styling

### Custom Theme System
The project uses a sophisticated theme system with multiple layers:

1. **CSS Variables** (`theme/css/variables.css`): Defines design tokens for colors, fonts, spacing, shadows
   - Multiple theme variants: light, dark, ayu, coal, navy
   - Custom properties like `--border-radius: 8px`, `--transition: all 0.2s ease-in-out`
   - Typography system with Inter font stack

2. **Enhanced Styling** (`theme/css/custom.css`): Advanced visual enhancements
   - Gradient headers with `background-clip: text`
   - Box shadows and rounded corners throughout
   - Custom scrollbars and hover effects
   - Responsive design with mobile optimizations

3. **Interactive Features** (`theme/js/custom.js`): JavaScript enhancements
   - Auto-generated table of contents for long pages
   - Chapter navigation in sidebar with smooth scrolling
   - Reading progress indicator
   - Keyboard shortcuts (← → for navigation)
   - Enhanced code copy functionality

## Development Workflows

### Content Creation
- Add new chapters by creating `.md` files in appropriate `src/` subdirectories
- Update `src/SUMMARY.md` to include new pages in navigation
- Use placeholder format: `*[Placeholder] Brief description*` for incomplete sections
- Follow Chinese/English mixed content pattern established in existing files

### Theme Customization
- **CSS Changes**: Modify `theme/css/custom.css` for styling, `theme/css/variables.css` for design tokens
- **JavaScript**: Enhance `theme/js/custom.js` for interactive features
- **Templates**: Edit `theme/index.hbs` and `theme/head.hbs` for HTML structure changes
- **Build**: Use `mdbook build` to compile; static files output to `book/` directory

### Deployment
- **CI/CD**: `.github/workflows/mdbook.yml` handles automatic deployment to GitHub Pages
- **Build verification**: Workflow includes extensive file existence and content checks
- **Static hosting**: Final site served from `book/` directory as static files

## Project-Specific Conventions

### File Organization
```
src/
├── agent/              # AI agents, tools, MCP protocols
├── frontend_dev/       # Frontend development practices
├── llm_knowledge/      # LLM fundamentals and applications
├── requirements_design/ # System design and analysis
└── vibe_coding/        # AI-driven programming methodologies
```

### Content Patterns
- **Bilingual Support**: Headers and navigation in Chinese, content mixed Chinese/English
- **Structured Sections**: Each chapter follows: Overview → Core concepts → Implementation → Best practices
- **Code Examples**: Use fenced code blocks with language specification
- **Resource Links**: Include `resources/` subdirectories for images and assets

### Theme Integration Points
- **Sidebar Navigation**: Automatically enhanced with chapter-level TOC using heading extraction
- **Search Integration**: Full-text search enabled with custom styling and keyboard shortcuts
- **Accessibility**: Focus indicators, reduced motion support, high contrast compatibility
- **Print Optimization**: Separate print stylesheet removes navigation elements

## Critical Technical Details

### CSS Custom Properties Usage
The theme relies heavily on CSS custom properties for theming. When adding new styles:
- Use existing design tokens: `var(--border-radius)`, `var(--transition)`, `var(--box-shadow)`
- Follow color system: `var(--links)`, `var(--sidebar-active)`, `var(--theme-hover)`
- Maintain dark/light theme compatibility

### JavaScript Enhancement Pattern
The `custom.js` follows a modular pattern:
```javascript
function enhanceFeature() {
    // Feature implementation
}

function init() {
    // Wait for DOM ready
    enhanceFeature();
    // Set up mutation observers for SPA-like behavior
}
```

### Build Integration
- **mdBook Version**: Pinned to 0.4.36 in CI workflow
- **Static Assets**: Fonts, icons, and custom resources copied during build
- **Theme Override**: Custom theme completely replaces default mdBook styling

## Key Files for Common Tasks

- **Add Content**: Edit `src/SUMMARY.md` + create new `.md` files
- **Style Changes**: `theme/css/custom.css` and `theme/css/variables.css`
- **Interactive Features**: `theme/js/custom.js`
- **HTML Structure**: `theme/index.hbs`, `theme/head.hbs`
- **Build Configuration**: `book.toml`
- **Deployment**: `.github/workflows/mdbook.yml`

## External Dependencies

- **Fonts**: Font Awesome 4.7.0 via CDN, Inter font family locally hosted
- **Build Tool**: mdBook (Rust-based static site generator)
- **Hosting**: GitHub Pages with custom domain support
- **JavaScript**: Vanilla JS, no external libraries (intentional design choice)

When working on this project, prioritize maintaining the established design system, accessibility features, and the balance between English and Chinese content.