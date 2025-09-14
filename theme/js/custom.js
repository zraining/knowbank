// Custom JavaScript for enhanced mdBook functionality

(function() {
    'use strict';

    // Add fade-in animation to content
    function addFadeInAnimation() {
        const content = document.querySelector('.content');
        if (content) {
            content.classList.add('fade-in');
        }
    }

    // Enhanced code copy functionality
    function enhanceCodeCopy() {
        const codeBlocks = document.querySelectorAll('pre');
        codeBlocks.forEach(block => {
            if (!block.querySelector('.copy-button')) {
                const button = document.createElement('button');
                button.className = 'copy-button';
                button.innerHTML = '📋';
                button.title = 'Copy to clipboard';
                button.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: var(--theme-popup-bg);
                    border: 1px solid var(--theme-popup-border);
                    color: var(--fg);
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                `;
                
                button.addEventListener('click', function() {
                    const code = block.querySelector('code');
                    if (code) {
                        navigator.clipboard.writeText(code.textContent).then(() => {
                            button.innerHTML = '✅';
                            button.title = 'Copied!';
                            setTimeout(() => {
                                button.innerHTML = '📋';
                                button.title = 'Copy to clipboard';
                            }, 2000);
                        }).catch(() => {
                            // Fallback for older browsers
                            const textArea = document.createElement('textarea');
                            textArea.value = code.textContent;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            
                            button.innerHTML = '✅';
                            button.title = 'Copied!';
                            setTimeout(() => {
                                button.innerHTML = '📋';
                                button.title = 'Copy to clipboard';
                            }, 2000);
                        });
                    }
                });
                
                block.style.position = 'relative';
                block.appendChild(button);
            }
        });
    }

    // Add table of contents for long pages
    function generateTableOfContents() {
        const headings = document.querySelectorAll('.content h1, .content h2, .content h3');
        if (headings.length > 3) {
            const toc = document.createElement('div');
            toc.className = 'table-of-contents';
            toc.style.cssText = `
                background: var(--quote-bg);
                border: 1px solid var(--quote-border);
                border-radius: var(--border-radius, 8px);
                padding: 1rem 1.5rem;
                margin: 1.5rem 0;
                box-shadow: var(--box-shadow, 0 4px 6px rgba(0,0,0,0.1));
            `;
            
            const title = document.createElement('h4');
            title.textContent = 'Table of Contents';
            title.style.cssText = `
                margin: 0 0 1rem 0;
                color: var(--links);
                font-weight: 600;
            `;
            toc.appendChild(title);
            
            const list = document.createElement('ul');
            list.style.cssText = `
                list-style: none;
                padding: 0;
                margin: 0;
            `;
            
            headings.forEach((heading, index) => {
                const id = heading.id || `heading-${index}`;
                if (!heading.id) {
                    heading.id = id;
                }
                
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${id}`;
                link.textContent = heading.textContent;
                link.style.cssText = `
                    display: block;
                    padding: 0.25rem 0;
                    color: var(--fg);
                    text-decoration: none;
                    border-radius: 4px;
                    padding-left: ${(parseInt(heading.tagName.slice(1)) - 1) * 1}rem;
                    transition: var(--transition, all 0.2s ease);
                `;
                
                link.addEventListener('mouseenter', function() {
                    this.style.color = 'var(--links)';
                    this.style.backgroundColor = 'var(--theme-hover)';
                    this.style.paddingLeft = `${(parseInt(heading.tagName.slice(1)) - 1) * 1 + 0.5}rem`;
                });
                
                link.addEventListener('mouseleave', function() {
                    this.style.color = 'var(--fg)';
                    this.style.backgroundColor = 'transparent';
                    this.style.paddingLeft = `${(parseInt(heading.tagName.slice(1)) - 1) * 1}rem`;
                });
                
                listItem.appendChild(link);
                list.appendChild(listItem);
            });
            
            toc.appendChild(list);
            
            // Insert TOC after first paragraph or heading
            const firstContent = document.querySelector('.content p, .content h1');
            if (firstContent) {
                firstContent.parentNode.insertBefore(toc, firstContent.nextSibling);
            }
        }
    }

    // Add reading progress indicator
    function addReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--links), var(--sidebar-active));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        function updateProgress() {
            const content = document.querySelector('.content');
            if (content) {
                const scrollTop = window.pageYOffset;
                const docHeight = content.offsetHeight;
                const winHeight = window.innerHeight;
                const scrollPercent = scrollTop / (docHeight - winHeight);
                const scrollPercentRounded = Math.round(scrollPercent * 100);
                
                progressBar.style.width = Math.min(scrollPercentRounded, 100) + '%';
            }
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
    }

    // Add smooth scrolling for anchor links
    function enhanceAnchorLinks() {
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    // Add keyboard shortcuts
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchBar = document.getElementById('searchbar');
                if (searchBar) {
                    searchBar.focus();
                }
            }
            
            // Escape to close search
            if (e.key === 'Escape') {
                const searchBar = document.getElementById('searchbar');
                if (searchBar && document.activeElement === searchBar) {
                    searchBar.blur();
                }
            }
        });
    }

    // Add theme persistence
    function enhanceThemePersistence() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                // Save theme preference
                setTimeout(() => {
                    const currentTheme = document.documentElement.className.match(/\b(light|dark|coal|navy|rust|ayu)\b/);
                    if (currentTheme) {
                        localStorage.setItem('mdbook-theme', currentTheme[0]);
                    }
                }, 100);
            });
        }
    }

    // Add chapter navigation to sidebar
    function addChapterNavigation() {
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content');
        
        if (!sidebar || !content) return;
        
        // Find current page link in sidebar
        const currentPageLink = sidebar.querySelector('a.active');
        if (!currentPageLink) return;
        
        const currentPageItem = currentPageLink.closest('li');
        if (!currentPageItem) return;
        
        // Get headings from current page content
        const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) return;
        
        // Remove existing chapter navigation
        const existingChapterNav = currentPageItem.querySelector('.chapter-navigation');
        if (existingChapterNav) {
            existingChapterNav.remove();
        }
        
        // Create chapter navigation container
        const chapterNav = document.createElement('ul');
        chapterNav.className = 'chapter-navigation';
        chapterNav.style.cssText = `
            list-style: none;
            padding: 0;
            margin: 0.5rem 0 0 1rem;
            border-left: 2px solid var(--sidebar-spacer);
            padding-left: 0.5rem;
        `;
        
        // Generate navigation items for each heading
        headings.forEach((heading, index) => {
            const id = heading.id || `heading-${index}`;
            if (!heading.id) {
                heading.id = id;
            }
            
            const level = parseInt(heading.tagName.slice(1));
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.className = 'chapter-link';
            link.style.cssText = `
                display: block;
                padding: 0.25rem 0;
                color: var(--sidebar-non-existant);
                text-decoration: none;
                font-size: 0.85rem;
                line-height: 1.3;
                padding-left: ${(level - 1) * 0.75}rem;
                border-radius: 4px;
                transition: all 0.2s ease;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
            
            // Add hover effects
            link.addEventListener('mouseenter', function() {
                this.style.color = 'var(--sidebar-active)';
                this.style.backgroundColor = 'var(--theme-hover)';
                this.style.paddingLeft = `${(level - 1) * 0.75 + 0.25}rem`;
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.color = 'var(--sidebar-non-existant)';
                this.style.backgroundColor = 'transparent';
                this.style.paddingLeft = `${(level - 1) * 0.75}rem`;
            });
            
            // Add click handler for smooth scrolling
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetElement = document.getElementById(id);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL hash
                    history.pushState(null, null, `#${id}`);
                    
                    // Highlight active chapter link
                    chapterNav.querySelectorAll('.chapter-link').forEach(l => {
                        l.style.color = 'var(--sidebar-non-existant)';
                        l.style.fontWeight = 'normal';
                    });
                    this.style.color = 'var(--sidebar-active)';
                    this.style.fontWeight = '600';
                }
            });
            
            listItem.appendChild(link);
            chapterNav.appendChild(listItem);
        });
        
        // Add chapter navigation to current page item
        currentPageItem.appendChild(chapterNav);
        
        // Highlight current section based on scroll position
        function updateActiveChapterLink() {
            const scrollTop = window.pageYOffset;
            const chapterLinks = chapterNav.querySelectorAll('.chapter-link');
            
            let activeLink = null;
            headings.forEach((heading, index) => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= 100) {
                    activeLink = chapterLinks[index];
                }
            });
            
            chapterLinks.forEach(link => {
                link.style.color = 'var(--sidebar-non-existant)';
                link.style.fontWeight = 'normal';
            });
            
            if (activeLink) {
                activeLink.style.color = 'var(--sidebar-active)';
                activeLink.style.fontWeight = '600';
            }
        }
        
        // Add scroll listener for active section highlighting
        window.addEventListener('scroll', updateActiveChapterLink);
        updateActiveChapterLink(); // Initial call
    }

    // Initialize all enhancements
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        addFadeInAnimation();
        enhanceCodeCopy();
        generateTableOfContents();
        addReadingProgress();
        enhanceAnchorLinks();
        addKeyboardShortcuts();
        enhanceThemePersistence();
        addChapterNavigation();
        
        // Re-run some functions when content changes (for SPA-like behavior)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    setTimeout(() => {
                        enhanceCodeCopy();
                        addFadeInAnimation();
                        addChapterNavigation();
                    }, 100);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start initialization
    init();

})();