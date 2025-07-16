// Default blog posts for initial load
        const defaultBlogPosts = [
            {
                id: 1,
                title: "Benefits of A2 Cow Milk for Your Family",
                category: "Health & Nutrition",
                excerpt: "Discover the amazing health benefits of A2 cow milk and why it's becoming the preferred choice for health-conscious families. Learn about the difference between A1 and A2 proteins...",
                content: "A2 cow milk has gained significant attention in recent years for its potential health benefits. Unlike regular milk that contains both A1 and A2 proteins, A2 milk contains only the A2 beta-casein protein, which is believed to be easier to digest and may cause fewer digestive issues. This comprehensive guide explores the science behind A2 milk and its benefits for your family's health.",
                author: "Admin",
                readTime: 5,
                date: new Date('2025-07-15'),
                views: 0
            },
            {
                id: 2,
                title: "The Ancient Art of Ghee Making",
                category: "Traditional Methods",
                excerpt: "Explore the traditional methods we use to create pure, golden ghee from fresh cow milk. Learn about the time-honored techniques passed down through generations...",
                content: "Ghee, often called liquid gold, has been a cornerstone of Indian cuisine and Ayurvedic medicine for thousands of years. Our traditional ghee-making process follows ancient techniques that have been passed down through generations, ensuring the highest quality and nutritional value. This article takes you through our step-by-step process and explains why traditional methods produce superior ghee.",
                author: "Admin",
                readTime: 7,
                date: new Date('2025-07-12'),
                views: 0
            },
            {
                id: 3,
                title: "How We Care for Our Sacred Cows",
                category: "Cow Care",
                excerpt: "Take a behind-the-scenes look at our gau shala and discover how we ensure the health and happiness of our beloved cows through proper nutrition, healthcare, and love...",
                content: "At Shreenathji Gir Gau Shala, our cows are treated with the utmost care and reverence. We believe that happy and healthy cows produce the best quality milk. This article provides an intimate look at our daily cow care routines, from feeding schedules to veterinary care, and explains how our approach to cow welfare directly impacts the quality of our dairy products.",
                author: "Admin",
                readTime: 6,
                date: new Date('2025-07-08'),
                views: 0
            },
            {
                id: 4,
                title: "Seasonal Nutrition: Summer Dairy Tips",
                category: "Health & Nutrition",
                excerpt: "Learn how to incorporate our fresh dairy products into your summer diet for optimal health and cooling benefits during hot weather...",
                content: "Summer brings unique nutritional challenges, and our fresh dairy products offer excellent solutions for staying healthy and cool. This guide explores how traditional dairy products can help balance your body's needs during the hot season.",
                author: "Admin",
                readTime: 4,
                date: new Date('2025-07-05'),
                views: 0
            },
            {
                id: 5,
                title: "The Power of Fresh Paneer in Your Diet",
                category: "Health & Nutrition",
                excerpt: "Discover the nutritional benefits of fresh paneer and creative ways to include this protein-rich dairy product in your daily meals...",
                content: "Fresh paneer is one of the most versatile and nutritious dairy products. Rich in protein, calcium, and essential nutrients, it forms an excellent foundation for healthy meals. Learn about its benefits and cooking methods.",
                author: "Admin",
                readTime: 5,
                date: new Date('2025-07-02'),
                views: 0
            },
            {
                id: 6,
                title: "Traditional Butter Making Process",
                category: "Traditional Methods",
                excerpt: "Explore our time-honored butter churning process and understand why traditional methods produce superior taste and quality...",
                content: "The art of butter making has been perfected over centuries. Our traditional churning process ensures that every batch of butter maintains the authentic taste and nutritional value that our customers expect.",
                author: "Admin",
                readTime: 6,
                date: new Date('2025-06-28'),
                views: 0
            }
        ];

        // Blog management variables
        let currentSlide = 0;
        let totalSlides = 0;
        let allPosts = [];
        let lastKnownUpdate = 0;

        // Blog data management
        class BlogDataManager {
            constructor() {
                this.STORAGE_KEY = 'shreenathji_blog_posts';
                this.UPDATE_KEY = 'shreenathji_blog_last_update';
                this.lastCheck = Date.now();
                this.setupEventListeners();
            }

            // Setup event listeners for real-time updates
            setupEventListeners() {
                // Listen for localStorage changes (cross-tab communication)
                window.addEventListener('storage', (e) => {
                    if (e.key === this.STORAGE_KEY || e.key === this.UPDATE_KEY) {
                        console.log('Storage event detected, updating blog display');
                        this.loadAndDisplayPosts();
                    }
                });

                // Listen for postMessage (same-tab communication)
                window.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'BLOG_UPDATED') {
                        console.log('Blog update message received');
                        this.loadAndDisplayPosts();
                    }
                });

                // Set up periodic checks
                setInterval(() => {
                    this.checkForUpdates();
                }, 1000); // Check every second
            }

            // Check for updates periodically
            checkForUpdates() {
                try {
                    const currentUpdate = parseInt(localStorage.getItem(this.UPDATE_KEY) || '0');
                    if (currentUpdate > lastKnownUpdate) {
                        console.log('Update detected in periodic check');
                        lastKnownUpdate = currentUpdate;
                        this.loadAndDisplayPosts();
                    }
                } catch (error) {
                    console.error('Error checking for updates:', error);
                }
            }

            // Load posts from localStorage or use defaults
            loadPosts() {
                try {
                    const savedPosts = localStorage.getItem(this.STORAGE_KEY);
                    if (savedPosts && savedPosts !== 'undefined') {
                        const posts = JSON.parse(savedPosts);
                        // Convert date strings back to Date objects
                        return posts.map(post => ({
                            ...post,
                            date: new Date(post.date)
                        }));
                    }
                } catch (error) {
                    console.error('Error loading blog posts:', error);
                }
                
                // Return default posts if no saved posts or error
                return [...defaultBlogPosts];
            }

            // Save posts to localStorage
            savePosts(posts) {
                try {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
                    localStorage.setItem(this.UPDATE_KEY, Date.now().toString());
                    lastKnownUpdate = Date.now();
                } catch (error) {
                    console.error('Error saving blog posts:', error);
                }
            }

            // Initialize with default posts if none exist
            initializeDefaultPosts() {
                const existingPosts = localStorage.getItem(this.STORAGE_KEY);
                if (!existingPosts || existingPosts === 'undefined') {
                    this.savePosts(defaultBlogPosts);
                }
            }

            // Load and display posts
            loadAndDisplayPosts() {
                allPosts = this.loadPosts();
                // Sort posts by date (newest first)
                allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                updateBlogDisplay();
            }
        }

        // Initialize blog data manager
        const blogManager = new BlogDataManager();

        // Initialize blog posts
        function initializeBlogPosts() {
            blogManager.initializeDefaultPosts();
            blogManager.loadAndDisplayPosts();
        }

        // Update blog display
        function updateBlogDisplay() {
    const blogGrid = document.getElementById('blogGrid');
    const postsPerSlide = window.innerWidth <= 768 ? 1 : 3;

    blogGrid.innerHTML = '';

    // Limit to 6 most recent posts
    const maxPosts = 6;
    const limitedPosts = allPosts.slice(0, maxPosts);

    if (limitedPosts.length === 0) {
        blogGrid.innerHTML = '<div class="empty-blog-message">No blog posts available. <a href="blog.html">Create your first post</a>!</div>';
        document.getElementById('currentSlide').textContent = '0';
        document.getElementById('totalSlides').textContent = '0';
        document.getElementById('prevBtn').disabled = true;
        document.getElementById('nextBtn').disabled = true;
        return;
    }

    totalSlides = Math.ceil(limitedPosts.length / postsPerSlide);
    if (currentSlide >= totalSlides) {
        currentSlide = Math.max(0, totalSlides - 1);
    }

    const startIndex = currentSlide * postsPerSlide;
    const endIndex = Math.min(startIndex + postsPerSlide, limitedPosts.length);
    const currentPosts = limitedPosts.slice(startIndex, endIndex);

    currentPosts.forEach(post => {
        const blogCard = createBlogCard(post);
        blogGrid.appendChild(blogCard);
    });

    updateNavigation();
}

        // Create blog card element
        function createBlogCard(post) {
            const card = document.createElement('div');
            card.className = 'blog-card';
            
                        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const categoryEmoji = getCategoryEmoji(post.category);

            card.innerHTML = `
                <div class="blog-image">${categoryEmoji}</div>
                <div class="blog-content">
                    <div class="blog-category">${post.category}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-meta">
                        <span>${formattedDate}</span>
                        <span>${post.readTime} min read</span>
                    </div>
                </div>
            `;
            return card;
        }

        // Emoji based on blog category
        function getCategoryEmoji(category) {
            const emojis = {
                "Health & Nutrition": "🌱",
                "Traditional Methods": "🏺",
                "Cow Care": "🐄",
                "Organic Farming": "🌿",
                "Ayurveda": "🧪",
                "Recipes": "👨‍🍳",
            };
            return emojis[category] || "📝";
        }

        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateBlogDisplay();
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateBlogDisplay();
            }
        });

        // Update slide counter and button states
        function updateNavigation() {
            document.getElementById('currentSlide').textContent = currentSlide + 1;
            document.getElementById('totalSlides').textContent = totalSlides;
            document.getElementById('prevBtn').disabled = currentSlide === 0;
            document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
        }

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Initialize on load
        document.addEventListener('DOMContentLoaded', () => {
            initializeBlogPosts();
        });

        // Mobile Navigation Toggle
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const mobileOverlay = document.getElementById('mobileOverlay');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
        });

        // Close mobile menu when clicking on overlay
        mobileOverlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });

        // Close mobile menu when clicking on nav links
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                mobileOverlay.classList.remove('active');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // WhatsApp form submission handler
        document.addEventListener("DOMContentLoaded", function () {
            document.getElementById("whatsappForm").addEventListener("submit", function (e) {
                e.preventDefault(); // prevent form submission

                const name = document.getElementById("contactName").value.trim();
                const phone = document.getElementById("contactPhone").value.trim();
                const email = document.getElementById("contactEmail").value.trim();
                const message = document.getElementById("contactMessage").value.trim();

                // Debug: Log the values to console
                console.log('Form values:', { name, phone, email, message });

                if (!name || !phone || !message) {
                    alert("Please fill in all required fields (Name, Phone, and Message).");
                    return;
                }

                // Final formatted message with emojis and proper newlines
                const text =
                "👋 Hello!\n" +
                "🙋‍♂️ My name is: " + name + "\n" +
                "📞 Phone: " + phone + "\n" +
                "📧 Email: " + email + "\n" +
                "💬 Message: " + message;

                const whatsappNumber = "918200321064"; // Replace with your number
                const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

                window.open(url, "_blank");
                
                // Reset the form after successful submission
                this.reset();
            });
        });
