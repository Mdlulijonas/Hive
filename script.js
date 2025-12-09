// ========== STATE MANAGEMENT ==========
let currentUser = null;
let cart = [];
let platformStats = {
    activeCreators: 0,
    productsSold: 0,
    creatorEarnings: 0,
    registeredUsers: 0
};

// ========== SUBSCRIPTION PLANS ==========
const subscriptionPlans = {
    free: {
        name: "Free Forever",
        price: 0,
        features: {
            transactionFee: 0.02,
            withdrawalFee: 0.01,
            liveChat: false,
            algorithmPromotion: false,
            prioritySupport: false
        }
    },
    basic: {
        name: "Basic",
        price: 249,
        features: {
            transactionFee: 0,
            withdrawalFee: 0.01,
            liveChat: true,
            algorithmPromotion: false,
            prioritySupport: false
        }
    },
    pro: {
        name: "Pro",
        price: 349,
        features: {
            transactionFee: 0,
            withdrawalFee: 0,
            liveChat: true,
            algorithmPromotion: true,
            prioritySupport: true
        }
    }
};

// ========== SAMPLE DATA ==========
const sampleProducts = [
    {
        id: 1,
        title: "Digital Marketing Mastery 2024",
        description: "Complete guide covering SEO, social media, email marketing, and analytics for modern businesses.",
        price: 149.00,
        category: "ebooks",
        rating: 4.8,
        sales: 142,
        type: "download",
        thumbnail: null
    },
    {
        id: 2,
        title: "Floral Pattern Collection Pro",
        description: "Premium collection of 50+ high-quality floral patterns for designers and creatives.",
        price: 89.00,
        category: "art",
        rating: 4.9,
        sales: 28,
        type: "download",
        thumbnail: null
    },
    {
        id: 3,
        title: "Business Presentation Kit",
        description: "Professional templates for corporate presentations with customizable layouts.",
        price: 199.00,
        category: "templates",
        rating: 4.7,
        sales: 15,
        type: "download",
        thumbnail: null
    }
];

const sampleVideos = [
    {
        id: 1,
        title: "Digital Marketing Masterclass",
        description: "Learn advanced digital marketing strategies for 2024.",
        price: 149.00,
        duration: "12:45",
        views: 1250,
        likes: 89,
        rating: 4.8,
        type: "premium",
        preview: true
    },
    {
        id: 2,
        title: "Web Development Bootcamp",
        description: "Full-stack web development from beginner to advanced.",
        price: 0,
        duration: "25:30",
        views: 2450,
        likes: 156,
        rating: 4.9,
        type: "free",
        preview: true
    }
];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initPlatform();
});

function initPlatform() {
    // Load saved data
    loadPlatformStats();
    loadUserData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize UI
    updateUI();
    
    // Load featured products
    loadFeaturedProducts();
    
    // Initialize animations
    initAnimations();
}

function loadPlatformStats() {
    const savedStats = localStorage.getItem('digihive_platform_stats');
    if (savedStats) {
        platformStats = JSON.parse(savedStats);
    }
}

function savePlatformStats() {
    localStorage.setItem('digihive_platform_stats', JSON.stringify(platformStats));
}

function loadUserData() {
    const savedUser = localStorage.getItem('digihive_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem('digihive_current_user', JSON.stringify(currentUser));
    }
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Login/Signup buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const signupTrigger = document.getElementById('signupTrigger');
    const buyerSignup = document.getElementById('buyerSignup');

    if (loginBtn) loginBtn.addEventListener('click', () => openModal('loginModal'));
    if (signupBtn) signupBtn.addEventListener('click', () => openModal('signupModal'));
    if (signupTrigger) signupTrigger.addEventListener('click', () => openModal('signupModal'));
    if (buyerSignup) buyerSignup.addEventListener('click', () => openModal('signupModal'));

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Footer links
    const creatorResources = document.getElementById('creatorResources');
    const helpCenter = document.getElementById('helpCenter');
    const contactUs = document.getElementById('contactUs');
    const privacyPolicy = document.getElementById('privacyPolicy');

    if (creatorResources) creatorResources.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Creator resources will be available soon!', 'info');
    });

    if (helpCenter) helpCenter.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Help center is under development!', 'info');
    });

    if (contactUs) contactUs.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Contact form will be available soon!', 'info');
    });

    if (privacyPolicy) privacyPolicy.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Privacy policy page is coming soon!', 'info');
    });

    // Scroll animations
    window.addEventListener('scroll', handleScroll);
}

// ========== MOBILE MENU ==========
let isMobileMenuOpen = false;

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.querySelector('#mobileMenuBtn i');
    
    isMobileMenuOpen = !isMobileMenuOpen;
    mobileNav.classList.toggle('active');
    
    if (isMobileMenuOpen) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtn = document.getElementById('mobileMenuBtn');
    
    if (isMobileMenuOpen && 
        !mobileNav.contains(e.target) && 
        !menuBtn.contains(e.target)) {
        toggleMobileMenu();
    }
});

// ========== MODAL MANAGEMENT ==========
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset forms
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// ========== AUTHENTICATION ==========
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Mock login
    currentUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        type: 'buyer',
        avatar: email.charAt(0).toUpperCase(),
        wallet: {
            balance: 1250.50,
            digiCoins: 2501
        },
        subscription: subscriptionPlans.free,
        verified: false,
        joined: new Date().toISOString()
    };
    
    updateUI();
    closeModal('loginModal');
    showNotification('Login successful! Welcome to DigiHive.', 'success');
    
    // Update stats
    platformStats.registeredUsers++;
    savePlatformStats();
    updateCounters();
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const accountType = document.getElementById('accountType').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    // Validation
    if (!name || !email || !password || !accountType) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showNotification('Please accept the Terms and Conditions', 'error');
        return;
    }
    
    // Mock signup
    currentUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        type: accountType,
        avatar: name.charAt(0).toUpperCase(),
        wallet: {
            balance: 0,
            digiCoins: 100 // Welcome bonus
        },
        subscription: subscriptionPlans.free,
        verified: false,
        joined: new Date().toISOString()
    };
    
    // Update stats
    platformStats.registeredUsers++;
    if (accountType.includes('seller')) {
        platformStats.activeCreators++;
    }
    
    updateUI();
    closeModal('signupModal');
    
    // Show email verification modal
    setTimeout(() => {
        openModal('verificationModal');
        sendVerificationCode();
    }, 500);
    
    showNotification(`Account created successfully! Welcome ${name}.`, 'success');
    savePlatformStats();
    updateCounters();
}

function loginWithGoogle() {
    // Mock Google auth
    showNotification('Google authentication would be implemented here', 'info');
    
    setTimeout(() => {
        currentUser = {
            id: Date.now().toString(),
            name: 'Google User',
            email: 'googleuser@example.com',
            type: 'both',
            avatar: 'G',
            wallet: {
                balance: 500,
                digiCoins: 1000
            },
            subscription: subscriptionPlans.free,
            verified: true,
            googleAuth: true,
            joined: new Date().toISOString()
        };
        
        updateUI();
        closeModal('loginModal');
        showNotification('Logged in with Google successfully!', 'success');
        
        platformStats.registeredUsers++;
        savePlatformStats();
        updateCounters();
    }, 1000);
}

function signupWithGoogle() {
    loginWithGoogle();
    closeModal('signupModal');
}

function logoutUser() {
    currentUser = null;
    updateUI();
    showNotification('Logged out successfully.', 'success');
}

// ========== EMAIL VERIFICATION ==========
function sendVerificationCode() {
    if (!currentUser) return;
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`verification_code_${currentUser.email}`, code);
    
    // In production, this would send an actual email
    console.log(`Verification code for ${currentUser.email}: ${code}`);
    
    showNotification('Verification code sent to your email!', 'success');
}

function verifyEmail() {
    if (!currentUser) return;
    
    const inputs = document.querySelectorAll('.verification-input');
    const code = Array.from(inputs).map(input => input.value).join('');
    
    const storedCode = localStorage.getItem(`verification_code_${currentUser.email}`);
    
    if (code === storedCode) {
        currentUser.verified = true;
        updateUI();
        closeModal('verificationModal');
        showNotification('Email verified successfully!', 'success');
        saveUserData();
    } else {
        showNotification('Invalid verification code', 'error');
    }
}

function resendVerification() {
    sendVerificationCode();
    showNotification('New verification code sent!', 'info');
}

function moveToNext(input, nextIndex) {
    if (input.value.length === 1) {
        const nextInput = input.parentElement.querySelector(`.verification-input:nth-child(${nextIndex + 1})`);
        if (nextInput) nextInput.focus();
    }
}

// ========== PRODUCT MANAGEMENT ==========
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = sampleProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-${getProductIcon(product.category)}"></i>
                ${product.sales > 10 ? '<div class="product-badge">Bestseller</div>' : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">R${product.price.toFixed(2)}</div>
                    <div class="product-rating">
                        <i class="fas fa-star"></i> ${product.rating}
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-outline w-100" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn w-100" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getProductIcon(category) {
    const icons = {
        'ebooks': 'book',
        'templates': 'file-powerpoint',
        'courses': 'graduation-cap',
        'art': 'palette',
        'photography': 'camera',
        'software': 'code'
    };
    return icons[category] || 'box';
}

function viewProduct(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;
    
    showNotification(`Viewing: ${product.title}`, 'info');
}

function addToCart(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;
    
    cart.push({
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString()
    });
    
    showCartNotification(`${product.title} added to cart!`);
}

// ========== CART MANAGEMENT ==========
function showCartNotification(message) {
    const notification = document.getElementById('cartNotification');
    const messageElement = document.getElementById('cartMessage');
    
    if (notification && messageElement) {
        messageElement.textContent = message;
        notification.style.display = 'flex';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

function viewCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty.', 'info');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`You have ${cart.length} item(s) in your cart. Total: R${total.toFixed(2)}`, 'info');
}

// ========== UI UPDATES ==========
function updateUI() {
    updateUserUI();
    updateCounters();
    saveUserData();
}

function updateUserUI() {
    const userWallet = document.getElementById('userWallet');
    const walletBalance = document.getElementById('walletBalance');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (currentUser) {
        // Update wallet display
        if (userWallet && walletBalance) {
            userWallet.style.display = 'flex';
            walletBalance.textContent = `${currentUser.wallet.digiCoins} Coins | R${currentUser.wallet.balance.toFixed(2)}`;
        }
        
        // Update login button to logout
        if (loginBtn) {
            loginBtn.textContent = 'Logout';
            loginBtn.onclick = logoutUser;
        }
        
        // Hide signup button
        if (signupBtn) {
            signupBtn.style.display = 'none';
        }
    } else {
        // Reset to guest state
        if (userWallet) userWallet.style.display = 'none';
        if (loginBtn) {
            loginBtn.textContent = 'Log In';
            loginBtn.onclick = () => openModal('loginModal');
        }
        if (signupBtn) {
            signupBtn.style.display = 'block';
        }
    }
}

function updateCounters() {
    // Update hero stats
    const creatorsCount = document.getElementById('creatorsCount');
    const productsCount = document.getElementById('productsCount');
    const earningsCount = document.getElementById('earningsCount');
    
    if (creatorsCount) creatorsCount.textContent = platformStats.activeCreators;
    if (productsCount) productsCount.textContent = platformStats.productsSold;
    if (earningsCount) earningsCount.textContent = 'R' + platformStats.creatorEarnings;
    
    // Update counter section
    const creatorsCountBig = document.getElementById('creatorsCountBig');
    const productsCountBig = document.getElementById('productsCountBig');
    const earningsCountBig = document.getElementById('earningsCountBig');
    const usersCount = document.getElementById('usersCount');
    
    if (creatorsCountBig) creatorsCountBig.textContent = platformStats.activeCreators;
    if (productsCountBig) productsCountBig.textContent = platformStats.productsSold;
    if (earningsCountBig) earningsCountBig.textContent = 'R' + platformStats.creatorEarnings;
    if (usersCount) usersCount.textContent = platformStats.registeredUsers;
}

// ========== ANIMATIONS ==========
function initAnimations() {
    handleScroll();
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function handleScroll() {
    const elements = document.querySelectorAll('.section-header, .feature-card, .stat-item-large, .product-card, .counter-item, .cta-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// ========== UTILITY FUNCTIONS ==========
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}" 
               style="color: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'white',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: '2000',
        animation: 'slideInRight 0.3s ease',
        borderLeft: `4px solid ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'}`,
        maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function forgotPassword() {
    showNotification('Password reset feature will be available soon!', 'info');
}
