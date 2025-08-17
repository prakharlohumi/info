// Matrix Background Animation
class MatrixBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.matrix = document.getElementById('matrix');
        this.matrix.appendChild(this.canvas);
        
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        this.init();
        this.animate();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / this.fontSize;
        
        for(let x = 0; x < this.columns; x++) {
            this.drops[x] = 1;
        }
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = this.fontSize + 'px Fira Code';
        
        for(let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if(this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.init();
    }
}

// Typing Effect Class
class TypingEffect {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentText = '';
        this.currentIndex = 0;
        this.isTyping = false;
    }
    
    type() {
        if (this.currentIndex < this.text.length) {
            this.currentText += this.text[this.currentIndex];
            this.element.textContent = this.currentText;
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
            this.isTyping = false;
        }
    }
    
    start() {
        this.isTyping = true;
        this.currentText = '';
        this.currentIndex = 0;
        this.type();
    }
}

// Blog Manager Class
class BlogManager {
    constructor() {
        this.blogPosts = [];
        this.currentBlog = null;
        this.blogListElement = document.getElementById('blog-list');
        this.blogContentElement = document.getElementById('blog-content');
        this.blogPostsContainer = document.getElementById('blog-posts');
        this.noBlogsElement = document.getElementById('no-blogs');
        this.blogLoadingElement = document.querySelector('.blog-loading');
        
        this.sampleBlogData = [
            { 
            title: "Welcome to My Blog",
            date: "2025-08-17",
            preview: "This is the preamble to my blogging journey",
            content: `# I WILL WRITE BLOGS!
            Am I telling you or reminding myself? Lets see!
            `
            }
        ];
        
        
        this.init();
    }
    
    async init() {
        await this.loadBlogIndex();
        this.setupEventListeners();
        this.renderBlogList();
    }
    
    async loadBlogIndex() {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Simulate loading delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Try to load external blog index
            const response = await fetch('./blogs/blogIndex.json');
            if (response.ok) {
                const data = await response.json();
                this.blogPosts = Array.isArray(data) ? data : [];
                console.log('✅ External blog index loaded:', this.blogPosts.length, 'posts found');
            } else {
                console.log('📁 External blog index not found, using sample data');
                this.useSampleData();
            }
        } catch (error) {
            console.log('📁 Blog index file not available, using sample data');
            console.log('💡 To add your own blogs: Create blogs/blogIndex.json with your post metadata');
            this.useSampleData();
        }
    }
    
    useSampleData() {
        // Use the full sample blog data array
        this.blogPosts = this.sampleBlogData.map(post => ({
          file: post.file,
          title: post.title,
          date: post.date,
          preview: post.preview,
          content: post.content
        }));
      }
      
    
    showLoadingState() {
        if (this.blogLoadingElement) {
            this.blogLoadingElement.style.display = 'block';
        }
        if (this.noBlogsElement) {
            this.noBlogsElement.classList.add('hidden');
        }
        if (this.blogPostsContainer) {
            this.blogPostsContainer.style.display = 'none';
        }
    }
    
    setupEventListeners() {
        const backButton = document.getElementById('back-to-list');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.showBlogList();
            });
        }
    }
    
    renderBlogList() {
        // Hide loading
        if (this.blogLoadingElement) {
            this.blogLoadingElement.style.display = 'none';
        }
        
        if (this.blogPosts.length === 0) {
            this.showNoBlogsMessage();
        } else {
            this.renderBlogCards();
        }
    }
    
    showNoBlogsMessage() {
        if (this.noBlogsElement) {
            this.noBlogsElement.classList.remove('hidden');
        }
        if (this.blogPostsContainer) {
            this.blogPostsContainer.style.display = 'none';
        }
        
        console.log('📝 No blog posts found. Create blogs/blogIndex.json to add posts.');
    }
    
    renderBlogCards() {
        if (this.noBlogsElement) {
            this.noBlogsElement.classList.add('hidden');
        }
        if (this.blogPostsContainer) {
            this.blogPostsContainer.style.display = 'grid';
            this.blogPostsContainer.innerHTML = '';
            
            this.blogPosts.forEach((post, index) => {
                const card = this.createBlogCard(post, index);
                this.blogPostsContainer.appendChild(card);
            });
        }
        
        console.log('📚 Blog cards rendered:', this.blogPosts.length, 'posts');
    }
    
    createBlogCard(post, index) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('data-blog-index', index);
        
        const title = document.createElement('div');
        title.className = 'blog-card-title';
        title.textContent = post.title || 'Untitled Post';
        
        const date = document.createElement('div');
        date.className = 'blog-card-date';
        date.textContent = this.formatDate(post.date);
        
        const preview = document.createElement('div');
        preview.className = 'blog-card-preview';
        preview.textContent = post.preview || 'Click to read this blog post...';
        
        card.appendChild(title);
        card.appendChild(date);
        if (post.preview) {
            card.appendChild(preview);
        }
        
        card.addEventListener('click', () => {
            this.loadBlogPost(post, index);
        });
        
        return card;
    }
    
    formatDate(dateString) {
        if (!dateString) return 'No date';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }
    
    async loadBlogPost(post, index) {
        try {
          this.showBlogContent();
          const blogBody = document.getElementById('blog-body');
      
          if (blogBody) {
            // Remove existing back button if present
            const existingBackButton = blogBody.querySelector('.back-btn');
            if (existingBackButton) {
              existingBackButton.remove();
            }
      
            blogBody.innerHTML = marked.parse(post.content);
      
            // Attach click listener to back button
            document.getElementById('back-to-list').addEventListener('click', () => {
              this.showBlogList();
            });
          }
        } catch (error) {
          console.error('Error loading blog post:', error);
        }
      }
      
      
    
    displayBlogContent(post, htmlContent) {
        const blogTitle = document.getElementById('blog-title');
        const blogDate = document.getElementById('blog-date');
        const blogBody = document.getElementById('blog-body');
        
        if (blogTitle) {
            blogTitle.textContent = post.title || 'Untitled Post';
        }
        
        if (blogDate) {
            blogDate.textContent = this.formatDate(post.date);
        }
        
        if (blogBody) {
            blogBody.innerHTML = htmlContent;
        }
        
        // Scroll to top of blog content
        if (this.blogContentElement) {
            this.blogContentElement.scrollIntoView({ behavior: 'smooth' });
        }
        
        console.log('✅ Blog content displayed:', post.title);
    }
    
    displayBlogError(post, error) {
        const blogTitle = document.getElementById('blog-title');
        const blogDate = document.getElementById('blog-date');
        const blogBody = document.getElementById('blog-body');
        
        if (blogTitle) {
            blogTitle.textContent = post.title || 'Untitled Post';
        }
        
        if (blogDate) {
            blogDate.textContent = this.formatDate(post.date);
        }
        
        if (blogBody) {
            blogBody.innerHTML = `
                <div class="error-message" style="color: var(--terminal-accent); border: 1px solid var(--terminal-accent); padding: 20px; border-radius: 8px; background: rgba(255, 0, 128, 0.1);">
                    <h4>$ file not found: ${post.file}</h4>
                    <p><strong>Error:</strong> Could not load "${post.file}" from the blogs directory.</p>
                    <p><strong>Debug info:</strong> ${error.message}</p>
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--terminal-border); color: var(--terminal-gray);">
                        <p><strong>To fix this:</strong></p>
                        <ol style="margin-left: 20px;">
                            <li>Create the file <code>blogs/${post.file}</code></li>
                            <li>Add your markdown content to the file</li>
                            <li>Refresh the page to try loading again</li>
                        </ol>
                    </div>
                </div>
            `;
        }
        
        console.error('❌ Failed to load blog:', post.file, error);
    }
    
    showBlogList() {
        if (this.blogListElement) {
            this.blogListElement.classList.remove('hidden');
        }
        if (this.blogContentElement) {
            this.blogContentElement.classList.add('hidden');
        }
        
        // Scroll to blogs section
        const blogsSection = document.getElementById('blogs');
        if (blogsSection) {
            blogsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    showBlogContent() {
        if (this.blogListElement) {
            this.blogListElement.classList.add('hidden');
        }
        if (this.blogContentElement) {
            this.blogContentElement.classList.remove('hidden');
        }
    }
}

// Smooth Scrolling Navigation
class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }
    
    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                // Debug logging
                console.log('Navigation clicked:', targetId);
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    console.log('Target section found:', targetSection);
                    
                    // Calculate offset position
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    this.updateActiveLink(link);
                } else {
                    console.error('Target section not found:', targetId);
                }
            });
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', () => this.updateActiveOnScroll());
        
        // Initial active link setup
        setTimeout(() => {
            this.updateActiveOnScroll();
        }, 1000);
    }
    
    updateActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    updateActiveOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150; // Adjusted offset for better detection
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Check if current scroll position is within this section
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        // Update active link based on current section
        if (currentSection) {
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                this.updateActiveLink(activeLink);
            }
        }
    }
}

// Skills Interactive Features
class SkillsInteraction {
    constructor() {
        this.categories = document.querySelectorAll('.skill-category');
        this.init();
    }
    
    init() {
        this.categories.forEach(category => {
            const header = category.querySelector('.category-header');
            const expandIcon = category.querySelector('.expand-icon');
            
            header.addEventListener('click', () => {
                category.classList.toggle('collapsed');
                
                if (category.classList.contains('collapsed')) {
                    expandIcon.style.transform = 'rotate(-90deg)';
                } else {
                    expandIcon.style.transform = 'rotate(0deg)';
                }
            });
        });
        
        // Add hover effects to skill items
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
            });
        });
    }
}

// Project Cards Interaction
class ProjectsInteraction {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        this.projectCards.forEach(card => {
            card.addEventListener('click', () => {
                this.expandProject(card);
            });
            
            // Add glitch effect on hover
            card.addEventListener('mouseenter', () => {
                card.classList.add('glitch');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('glitch');
            });
        });
    }
    
    expandProject(card) {
        const highlights = card.querySelector('.project-highlights');
        const isExpanded = highlights.style.display === 'block';
        
        // Close all other expanded projects
        this.projectCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.querySelector('.project-highlights').style.display = 'none';
                otherCard.classList.remove('expanded');
            }
        });
        
        // Toggle current project
        if (isExpanded) {
            highlights.style.display = 'none';
            card.classList.remove('expanded');
        } else {
            highlights.style.display = 'block';
            card.classList.add('expanded');
        }
    }
}

// Timeline Animations
class TimelineAnimations {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.init();
    }
    
    init() {
        // Add intersection observer for timeline items
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        this.timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
        
        // Add hover effects
        this.timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            
            item.addEventListener('mouseenter', () => {
                content.style.transform = 'translateX(10px)';
            });
            
            item.addEventListener('mouseleave', () => {
                content.style.transform = 'translateX(0)';
            });
        });
    }
}

// Hero Section Animations
class HeroAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Typing animations for terminal commands
        setTimeout(() => {
            const whoamiCommand = document.querySelector('[data-text="whoami"]');
            if (whoamiCommand) {
                const typingEffect = new TypingEffect(whoamiCommand, 'whoami', 150);
                typingEffect.start();
                
                // Show output after command is typed
                setTimeout(() => {
                    const output = document.querySelector('.terminal-output');
                    if (output) {
                        output.style.opacity = '1';
                        output.style.transform = 'translateY(0)';
                    }
                }, 2000);
            }
        }, 1000);
        
        setTimeout(() => {
            const catCommand = document.querySelector('[data-text="cat bio.txt"]');
            if (catCommand) {
                const typingEffect = new TypingEffect(catCommand, 'cat bio.txt', 120);
                typingEffect.start();
                
                // Show bio output
                setTimeout(() => {
                    const bioOutput = document.querySelector('.bio-output');
                    if (bioOutput) {
                        bioOutput.style.opacity = '1';
                        bioOutput.style.transform = 'translateY(0)';
                    }
                }, 1500);
            }
        }, 4000);
        
        // Initialize terminal outputs as hidden
        const terminalOutputs = document.querySelectorAll('.terminal-output, .bio-output');
        terminalOutputs.forEach(output => {
            output.style.opacity = '0';
            output.style.transform = 'translateY(20px)';
            output.style.transition = 'all 0.6s ease';
        });
    }
}

// Contact Form Interactions
class ContactInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        const contactMethods = document.querySelectorAll('.contact-method');
        
        contactMethods.forEach(method => {
            method.addEventListener('click', () => {
                const link = method.querySelector('a');
                if (link) {
                    // Add a terminal-like feedback
                    this.showTerminalFeedback(method);
                }
            });
        });
    }
    
    showTerminalFeedback(method) {
        const originalBg = method.style.background;
        method.style.background = 'rgba(0, 255, 65, 0.1)';
        method.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            method.style.background = originalBg;
            method.style.transform = 'scale(1)';
        }, 200);
    }
}

// Easter Eggs and Fun Interactions
class EasterEggs {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.userInput = [];
        this.init();
    }
    
    init() {
        // Konami code listener
        document.addEventListener('keydown', (e) => {
            this.userInput.push(e.code);
            if (this.userInput.length > this.konamiCode.length) {
                this.userInput.shift();
            }
            
            if (this.arraysEqual(this.userInput, this.konamiCode)) {
                this.activateMatrixMode();
            }
        });
        
        // Console commands
        console.log('%c$ welcome to prakhar\'s terminal!', 'color: #00ff41; font-family: monospace; font-size: 16px;');
        console.log('%cTry typing: showSecrets()', 'color: #00ffff; font-family: monospace;');
        
        // Add global functions for console interaction
        window.showSecrets = () => {
            console.log('%c🎮 Konami Code: ↑↑↓↓←→←→BA', 'color: #ff0080; font-family: monospace;');
            console.log('%c🚀 Matrix Mode Available!', 'color: #9d4edd; font-family: monospace;');
            console.log('%c💻 Built with love and caffeine', 'color: #00ff41; font-family: monospace;');
            console.log('%c📝 Blog system ready for your posts!', 'color: #00ffff; font-family: monospace;');
        };
        
        window.matrixMode = () => this.activateMatrixMode();
        
        // Add click counter for fun
        let clickCount = 0;
        document.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 42) {
                console.log('%c🎉 The Answer to Life, Universe and Everything!', 'color: #ff8c00; font-family: monospace; font-size: 20px;');
            }
        });
    }
    
    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }
    
    activateMatrixMode() {
        document.body.style.filter = 'hue-rotate(120deg) saturate(1.5)';
        document.body.style.transition = 'filter 1s ease';
        
        // Create floating particles
        this.createParticles();
        
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 10000);
        
        console.log('%c🎊 MATRIX MODE ACTIVATED! 🎊', 'color: #00ff41; font-family: monospace; font-size: 24px; font-weight: bold;');
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = '-10px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#00ff41';
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = '0 0 10px #00ff41';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            document.body.appendChild(particle);
            
            const fallDuration = Math.random() * 3 + 2;
            particle.animate([
                { transform: 'translateY(-10px)' },
                { transform: `translateY(${window.innerHeight + 10}px)` }
            ], {
                duration: fallDuration * 1000,
                easing: 'linear'
            }).onfinish = () => particle.remove();
        }
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe sections for fade-in animations
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });
        
        // Add animate-in styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Mobile Navigation
class MobileNav {
    constructor() {
        this.init();
    }
    
    init() {
        // Create mobile menu button if screen is small
        if (window.innerWidth <= 768) {
            this.createMobileMenu();
        }
        
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
                this.createMobileMenu();
            } else if (window.innerWidth > 768) {
                const mobileBtn = document.querySelector('.mobile-menu-btn');
                const mobileMenu = document.querySelector('.mobile-nav-menu');
                if (mobileBtn) mobileBtn.remove();
                if (mobileMenu) mobileMenu.remove();
            }
        });
    }
    
    createMobileMenu() {
        const nav = document.querySelector('.terminal-nav .nav-content');
        const navLinks = document.querySelector('.nav-links');
        
        // Create mobile menu button
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '☰';
        menuBtn.style.cssText = `
            display: block;
            background: none;
            border: none;
            color: var(--terminal-secondary);
            font-size: 24px;
            cursor: pointer;
        `;
        
        // Create mobile menu
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-nav-menu';
        mobileMenu.style.cssText = `
            display: none;
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-bottom: 1px solid var(--terminal-border);
            z-index: 999;
        `;
        
        // Clone nav links for mobile
        const mobileLinks = navLinks.cloneNode(true);
        mobileLinks.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
        `;
        mobileMenu.appendChild(mobileLinks);
        
        // Add event listeners
        menuBtn.addEventListener('click', () => {
            const isVisible = mobileMenu.style.display === 'block';
            mobileMenu.style.display = isVisible ? 'none' : 'block';
            menuBtn.innerHTML = isVisible ? '☰' : '✕';
        });
        
        // Close menu when link is clicked
        mobileLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
                menuBtn.innerHTML = '☰';
            });
        });
        
        // Hide original nav links on mobile
        navLinks.style.display = 'none';
        
        // Append elements
        nav.appendChild(menuBtn);
        document.body.appendChild(mobileMenu);
    }
}

// Performance Optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Debounced resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Trigger resize events for components that need it
                if (window.matrixBg) {
                    window.matrixBg.resize();
                }
            }, 250);
        });
        
        // Lazy loading for heavy animations
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            document.documentElement.style.setProperty('--typing-speed', '0.1s');
            document.documentElement.style.setProperty('--cursor-blink', '0s');
        }
    }
}

// Initialize Application
class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        console.log('%c🚀 Initializing Prakhar\'s Terminal...', 'color: #00ff41; font-family: monospace; font-size: 16px;');
        
        // Debug: Check if all sections exist
        const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'achievements', 'blogs', 'contact'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                console.log(`✅ Section found: ${sectionId}`);
            } else {
                console.error(`❌ Section missing: ${sectionId}`);
            }
        });
        
        // Initialize all components
        window.matrixBg = new MatrixBackground();
        new SmoothScroll();
        new SkillsInteraction();
        new ProjectsInteraction();
        new TimelineAnimations();
        new HeroAnimations();
        new ContactInteractions();
        new EasterEggs();
        new ScrollAnimations();
        new MobileNav();
        new PerformanceOptimizer();
        
        // Initialize blog system
        window.blogManager = new BlogManager();
        
        // Add loading complete class
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 1000);
        
        console.log('%c✅ Terminal Ready!', 'color: #00ff41; font-family: monospace; font-size: 16px;');
        console.log('%c💡 Try: showSecrets() or use Konami code!', 'color: #00ffff; font-family: monospace;');
        console.log('%c📝 Blog system initialized with sample content!', 'color: #00ffff; font-family: monospace;');
        console.log('%c📁 To add your own blogs: Create blogs/blogIndex.json and .md files', 'color: #ff8c00; font-family: monospace;');
    }
}

// Start the application
new App();