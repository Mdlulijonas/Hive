// marketplace.js - Marketplace specific JavaScript

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;
let currentView = 'grid';

// Initialize marketplace
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    updateStats();
});

// Load products from database or API
async function loadProducts() {
    const loadingEl = document.getElementById('loadingProducts');
    const productsGrid = document.getElementById('marketplaceProducts');
    
    try {
        // In a real app, this would be an API call
        // For demo purposes, we'll generate sample products
        allProducts = generateSampleProducts();
        filteredProducts = [...allProducts];
        
        // Update product count
        document.getElementById('totalProducts').textContent = allProducts.length;
        document.getElementById('productsCountText').textContent = `All Digital Products (${allProducts.length})`;
        
        // Initial render
        renderProducts();
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error loading products</h3>
                <p>Please try again later</p>
                <button class="btn" onclick="loadProducts()">Retry</button>
            </div>
        `;
    } finally {
        loadingEl.style.display = 'none';
    }
}

// Generate sample products for demo
function generateSampleProducts() {
    const categories = ['templates', 'graphics', 'courses', 'software', 'music', 'photography'];
    const fileTypes = ['pdf', 'zip', 'video', 'audio', 'image'];
    const creators = ['Creative Studio', 'Digital Masters', 'Code Pro', 'Design Hub', 'Photo Experts'];
    
    const products = [];
    
    for (let i = 1; i <= 48; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        const creator = creators[Math.floor(Math.random() * creators.length)];
        const rating = parseFloat((3 + Math.random() * 2).toFixed(1));
        const sales = Math.floor(Math.random() * 500) + 50;
        const price = Math.floor(Math.random() * 500) + 10;
        const isFeatured = i <= 8;
        const isOnSale = Math.random() > 0.7;
        const salePrice = isOnSale ? Math.floor(price * 0.7) : null;
        
        products.push({
            id: i,
            name: `Premium ${getCategoryName(category)} ${i}`,
            description: `Professional ${category} product with premium features and excellent support. Perfect for business and personal use.`,
            price: price,
            salePrice: salePrice,
            category: category,
            fileType: fileType,
            creator: creator,
            rating: rating,
            sales: sales,
            downloads: sales * 2,
            featured: isFeatured,
            onSale: isOnSale,
            tags: ['Professional', 'Premium', 'Easy to Use'],
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            imageUrl: `https://picsum.photos/400/300?random=${i}`
        });
    }
    
    return products;
}

function getCategoryName(category) {
    const names = {
        'templates': 'Website Template',
        'graphics': 'Design Pack',
        'courses': 'Online Course',
        'software': 'Software Tool',
        'music': 'Music Pack',
        'photography': 'Photo Collection'
    };
    return names[category] || 'Digital Product';
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    // Price range slider
    const priceSlider = document.getElementById('priceRange');
    priceSlider.addEventListener('input', updatePriceDisplay);
}

// Update price display
function updatePriceDisplay() {
    const priceSlider = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    const maxPrice = priceSlider.value;
    
    priceDisplay.textContent = maxPrice === '1000' ? 'Up to R1000' : `Up to R${maxPrice}`;
}

// Filter products based on selected filters
function filterProducts() {
    const categoryFilters = getSelectedCheckboxes('filter-option input[type="checkbox"]');
    const fileTypeFilters = getSelectedCheckboxes('.filter-section:nth-child(3) input[type="checkbox"]');
    const ratingFilters = getSelectedCheckboxes('.rating-option input[type="checkbox"]');
    const minPrice = document.getElementById('minPrice').value || 0;
    const maxPrice = document.getElementById('maxPrice').value || 1000;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (categoryFilters.length > 0 && !categoryFilters.includes(product.category)) {
            return false;
        }
        
        // File type filter
        if (fileTypeFilters.length > 0 && !fileTypeFilters.includes(product.fileType)) {
            return false;
        }
        
        // Price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        // Rating filter
        if (ratingFilters.length > 0) {
            const productRating = Math.floor(product.rating);
            if (!ratingFilters.some(rating => parseInt(rating) <= productRating)) {
                return false;
            }
        }
        
        // Search filter
        if (searchTerm) {
            const searchableText = `${product.name} ${product.description} ${product.category} ${product.creator}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Reset to first page
    currentPage = 1;
    
    // Update UI
    updateFilterStatus();
    renderProducts();
    updatePagination();
}

// Get selected checkbox values
function getSelectedCheckboxes(selector) {
    const checkboxes = document.querySelectorAll(selector);
    const selected = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            selected.push(cb.value);
        }
    });
    return selected;
}

// Update filter status text
function updateFilterStatus() {
    const statusEl = document.getElementById('filterStatus');
    const count = filteredProducts.length;
    const total = allProducts.length;
    
    if (count === total) {
        statusEl.textContent = `Showing all ${total} products`;
    } else {
        statusEl.textContent = `Showing ${count} of ${total} products`;
    }
    
    document.getElementById('productsCountText').textContent = `Digital Products (${count})`;
}

// Sort products
function sortProducts() {
    const sortValue = document.querySelector('input[name="sort"]:checked').value;
    
    filteredProducts.sort((a, b) => {
        switch (sortValue) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'popular':
                return b.sales - a.sales;
            case 'price-low':
                return (a.salePrice || a.price) - (b.salePrice || b.price);
            case 'price-high':
                return (b.salePrice || b.price) - (a.salePrice || a.price);
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
    
    currentPage = 1;
    renderProducts();
    updatePagination();
}

// Set grid view
function setGridView() {
    currentView = 'grid';
    document.querySelector('.products-grid').className = 'products-grid grid-view';
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.view-btn:first-child').classList.add('active');
}

// Set list view
function setListView() {
    currentView = 'list';
    document.querySelector('.products-grid').className = 'products-grid list-view';
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.view-btn:last-child').classList.add('active');
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('marketplaceProducts');
    const noProductsEl = document.getElementById('noProducts');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '';
        noProductsEl.style.display = 'block';
        return;
    }
    
    noProductsEl.style.display = 'none';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    let html = '';
    
    productsToShow.forEach(product => {
        if (currentView === 'grid') {
            html += createProductCard(product);
        } else {
            html += createProductListItem(product);
        }
    });
    
    productsGrid.innerHTML = html;
}

// Create product card for grid view
function createProductCard(product) {
    const isOnSale = product.onSale;
    const currentPrice = isOnSale ? product.salePrice : product.price;
    const originalPrice = isOnSale ? product.price : null;
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-badges">
                ${product.featured ? '<span class="badge featured">Featured</span>' : ''}
                ${isOnSale ? '<span class="badge sale">Sale</span>' : ''}
                <span class="badge category">${product.category}</span>
            </div>
            <div class="product-image">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
                <div class="product-overlay">
                    <button class="btn btn-icon" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                    <button class="btn btn-accent" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStars(product.rating)}
                        </div>
                        <span class="rating-value">${product.rating.toFixed(1)}</span>
                        <span class="sales-count">(${product.sales} sales)</span>
                    </div>
                </div>
                <p class="product-description">${product.description.substring(0, 80)}...</p>
                <div class="product-footer">
                    <div class="product-price">
                        ${isOnSale ? `
                            <span class="original-price">R${originalPrice}</span>
                            <span class="current-price">R${currentPrice}</span>
                        ` : `<span class="current-price">R${currentPrice}</span>`}
                    </div>
                    <div class="product-meta">
                        <span class="creator">
                            <i class="fas fa-user"></i> ${product.creator}
                        </span>
                        <span class="file-type">
                            <i class="fas fa-file"></i> ${product.fileType.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create product list item for list view
function createProductListItem(product) {
    const isOnSale = product.onSale;
    const currentPrice = isOnSale ? product.salePrice : product.price;
    
    return `
        <div class="product-list-item" data-id="${product.id}">
            <div class="list-item-image">
                <img src="${product.imageUrl}" alt="${product.name}">
                ${product.featured ? '<span class="badge featured">Featured</span>' : ''}
            </div>
            <div class="list-item-content">
                <div class="list-item-header">
                    <h3>${product.name}</h3>
                    <div class="list-item-rating">
                        ${generateStars(product.rating)}
                        <span>${product.rating.toFixed(1)} (${product.sales} sales)</span>
                    </div>
                </div>
                <p class="list-item-description">${product.description}</p>
                <div class="list-item-details">
                    <span class="detail">
                        <i class="fas fa-user"></i> ${product.creator}
                    </span>
                    <span class="detail">
                        <i class="fas fa-folder"></i> ${product.category}
                    </span>
                    <span class="detail">
                        <i class="fas fa-file"></i> ${product.fileType.toUpperCase()}
                    </span>
                    <span class="detail">
                        <i class="fas fa-download"></i> ${product.downloads} downloads
                    </span>
                </div>
            </div>
            <div class="list-item-actions">
                <div class="list-item-price">
                    ${isOnSale ? `
                        <span class="original-price">R${product.price}</span>
                        <span class="current-price">R${currentPrice}</span>
                    ` : `<span class="current-price">R${currentPrice}</span>`}
                </div>
                <div class="action-buttons">
                    <button class="btn btn-outline" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button class="btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Quick view product
function quickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modalContent = document.getElementById('quickViewContent');
    modalContent.innerHTML = createQuickViewContent(product);
    
    openModal('quickViewModal');
}

// Create quick view content
function createQuickViewContent(product) {
    const isOnSale = product.onSale;
    const currentPrice = isOnSale ? product.salePrice : product.price;
    
    return `
        <div class="quick-view-container">
            <div class="quick-view-image">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="quick-view-details">
                <div class="quick-view-header">
                    <div class="product-badges">
                        ${product.featured ? '<span class="badge featured">Featured</span>' : ''}
                        ${isOnSale ? '<span class="badge sale">Sale</span>' : ''}
                    </div>
                    <h2>${product.name}</h2>
                    <div class="quick-view-meta">
                        <span class="creator">
                            <i class="fas fa-user"></i> By ${product.creator}
                        </span>
                        <span class="category">
                            <i class="fas fa-folder"></i> ${product.category}
                        </span>
                        <span class="rating">
                            ${generateStars(product.rating)}
                            ${product.rating.toFixed(1)} (${product.sales} sales)
                        </span>
                    </div>
                </div>
                
                <div class="quick-view-description">
                    <h3>Description</h3>
                    <p>${product.description}</p>
                    <p>This premium product includes lifetime updates and professional support. Perfect for business use, personal projects, and professional applications.</p>
                </div>
                
                <div class="quick-view-features">
                    <h3>Features</h3>
                    <ul>
                        <li><i class="fas fa-check"></i> Professional quality</li>
                        <li><i class="fas fa-check"></i> Lifetime updates</li>
                        <li><i class="fas fa-check"></i> 24/7 support</li>
                        <li><i class="fas fa-check"></i> Commercial license</li>
                        <li><i class="fas fa-check"></i> Easy to customize</li>
                        <li><i class="fas fa-check"></i> Documentation included</li>
                    </ul>
                </div>
                
                <div class="quick-view-pricing">
                    <div class="price-section">
                        ${isOnSale ? `
                            <div class="price-comparison">
                                <span class="original-price">R${product.price}</span>
                                <span class="current-price">R${currentPrice}</span>
                                <span class="discount">Save ${Math.round((1 - currentPrice/product.price) * 100)}%</span>
                            </div>
                        ` : `
                            <div class="current-price">R${currentPrice}</div>
                        `}
                        
                        <div class="file-info">
                            <span><i class="fas fa-file"></i> File Type: ${product.fileType.toUpperCase()}</span>
                            <span><i class="fas fa-download"></i> ${product.downloads} downloads</span>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn btn-outline" onclick="addToWishlist(${product.id})">
                            <i class="far fa-heart"></i> Wishlist
                        </button>
                        <button class="btn btn-accent" onclick="addToCart(${product.id}); closeModal('quickViewModal')">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn" onclick="buyNow(${product.id}); closeModal('quickViewModal')">
                            <i class="fas fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add product to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.onSale ? product.salePrice : product.price,
            originalPrice: product.price,
            quantity: 1,
            image: product.imageUrl
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification
    showCartNotification(`${product.name} added to cart`);
    
    // Update cart count in header
    updateCartCount();
}

// Show cart notification
function showCartNotification(message) {
    const notification = document.getElementById('cartNotification');
    const messageEl = document.getElementById('cartMessage');
    
    messageEl.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart count in header if element exists
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = cartCount;
    }
}

// Buy now function
function buyNow(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Create a cart with just this product
    const cart = [{
        id: product.id,
        name: product.name,
        price: product.onSale ? product.salePrice : product.price,
        quantity: 1,
        image: product.imageUrl
    }];
    
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
}

// Add to wishlist
function addToWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (!wishlist.find(item => item.id === productId)) {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.onSale ? product.salePrice : product.price,
            image: product.imageUrl
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Show success message
        showNotification('Added to wishlist!', 'success');
    } else {
        showNotification('Already in wishlist', 'info');
    }
}

// Search products
function searchProducts() {
    filterProducts();
}

// Clear all filters
function clearFilters() {
    // Clear checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(rb => {
        if (rb.value === 'newest') rb.checked = true;
        else rb.checked = false;
    });
    
    // Clear price inputs
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('priceRange').value = 1000;
    
    // Clear search
    document.getElementById('searchInput').value = '';
    
    // Update display
    updatePriceDisplay();
    
    // Reset filters
    filteredProducts = [...allProducts];
    currentPage = 1;
    
    // Update UI
    updateFilterStatus();
    renderProducts();
    updatePagination();
}

// Update price filter
function updatePriceFilter() {
    const priceSlider = document.getElementById('priceRange');
    const maxPriceInput = document.getElementById('maxPrice');
    
    maxPriceInput.value = priceSlider.value;
    updatePriceDisplay();
    filterProducts();
}

// Update pagination
function updatePagination() {
    const paginationEl = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }
    
    let html = `
        <button class="pagination-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Show first page, last page, and pages around current
    const pagesToShow = [];
    
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pagesToShow.push(i);
    } else {
        pagesToShow.push(1);
        
        if (currentPage > 3) pagesToShow.push('...');
        
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pagesToShow.push(i);
        }
        
        if (currentPage < totalPages - 2) pagesToShow.push('...');
        pagesToShow.push(totalPages);
    }
    
    pagesToShow.forEach(page => {
        if (page === '...') {
            html += `<span class="pagination-dots">...</span>`;
        } else {
            html += `
                <button class="pagination-btn ${page === currentPage ? 'active' : ''}" 
                        onclick="goToPage(${page})">
                    ${page}
                </button>
            `;
        }
    });
    
    html += `
        <button class="pagination-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationEl.innerHTML = html;
}

// Go to specific page
function goToPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    renderProducts();
    updatePagination();
    
    // Scroll to top of products
    document.querySelector('.products-main').scrollIntoView({ behavior: 'smooth' });
}

// Update marketplace stats
function updateStats() {
    // In a real app, this would be an API call
    setTimeout(() => {
        document.getElementById('activeCreators').textContent = '2,543';
        document.getElementById('totalSales').textContent = '45,892';
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
