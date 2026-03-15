export function home() {
    return `
<div class="page active" id="page-home">
<section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
        <span class="hero-badge">🌿 The Forgotten Superfood</span>
        <h1>Discover the <span class="highlight">Sour Fig</span></h1>
        <p class="hero-description">Carpobrotus edulis has been misunderstood for too long. Discover the remarkable medical and nutritional benefits of South Africa's most underrated native plant.</p>
        <div class="hero-buttons">
            <a href="/health" class="btn btn-primary" data-link>Explore Benefits</a>
            <a href="/products" class="btn btn-secondary" data-link>Shop Products</a>
        </div>
    </div>
    <div class="scroll-indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
    </div>
</section>

<section class="about">
    <div class="container">
        <div class="section-header">
            <p class="section-label">Our Mission</p>
            <h2 class="section-title">Celebrating Nature's Hidden Treasure</h2>
            <p class="section-subtitle">We're on a mission to revive the reputation of the sour fig - a plant wrongly demonized as an invasive species while its incredible benefits remain largely unknown.</p>
        </div>
        <div class="about-grid">
            <div class="about-image">
                <div class="about-image-placeholder">🌸</div>
            </div>
            <div class="about-content">
                <h3>The Sour Fig Story</h3>
                <p>Carpobrotus edulis, commonly known as the sour fig or "suurvytjie", has been growing along South African coastlines for millennia. Despite its abundance, this native plant has been overlooked and even vilified.</p>
                <p>At Brotusphere, we believe it's time to celebrate this remarkable plant for what it truly is: a nutritional powerhouse with significant medicinal properties.</p>
                <p>The name "Brotusphere" draws from the term <strong>"brotus"</strong> — informally used to mean "something added at no extra charge," a bonus or freebie. This reflects our mission: to provide free, accessible knowledge about a plant that deserves wider recognition. The information here is a gift, not a commodity.</p>
                <div class="highlight-box">
                    <p class="handwritten" style="font-size: 1.3rem; color: var(--primary);">"The sour fig is not a weed to be eradicated, but a treasure to be celebrated."</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="features">
    <div class="container">
        <div class="section-header">
            <p class="section-label">Why Sour Fig?</p>
            <h2 class="section-title">Nature's Gift to Health</h2>
            <p class="section-subtitle">Discover what makes this humble plant so extraordinary</p>
        </div>
        <div class="features-grid">
            <div class="feature-card fade-in">
                <div class="feature-icon">💊</div>
                <h3>Medicinal Properties</h3>
                <p>Used traditionally for treating wounds, digestive issues, and inflammation. Leaves contain powerful antiseptic and anti-bacterial compounds.</p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">🥗</div>
                <h3>Nutritional Powerhouse</h3>
                <p>Packed with vitamins, minerals, and essential nutrients. The fruit is en excellent source of vitamin C and dietary fiber.</p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">🌱</div>
                <h3>Sustainable & Local</h3>
                i
<p>Grown natively in South Africa, requiring no irrigation or pesticides. A truly sustainable food and medicinal source .</p>
            </div>
            <div class="feature-card fade-in">
                <div class="feature-icon">🍯</div>
                <h3>Delicious & Versatile</h3>
                <p>Perfect for jams, preserves, and culinary creations. A unique sweet-tart flavor that delights.</p>
            </div>
        </div>
    </div>
</section>

<section class="products-preview">
    <div class="container">
        <div class="section-header">
            <p class="section-label">Our Products</p>
            <h2 class="section-title">Taste the Difference</h2>
            <p class="section-subtitle">Handcrafted with love using locally sourced sour figs</p>
        </div>
        <div class="products-grid">
            <div class="product-card fade-in">
                <div class="product-image">
                    <span class="product-badge">Bestseller</span>
                    🫐
                </div>
                <div class="product-info">
                    <h4>Sour Fig Jam</h4>
                    <p>Traditional recipe passed down generations</p>
                    <div class="product-price">R85</div>
                    <button class="product-btn" data-product="1">Add to Cart</button>
                </div>
            </div>
            <div class="product-card fade-in">
                <div class="product-image">🍯</div>
                <div class="product-info">
                    <h4>Sour Fig Honey</h4>
                    <p>Natural sweetness with a tangy twist</p>
                    <div class="product-price">R120</div>
                    <button class="product-btn" data-product="2">Add to Cart</button>
                </div>
            </div>
            <div class="product-card fade-in">
                <div class="product-image">
                    <span class="product-badge">New</span>
                    🍵
                </div>
                <div class="product-info">
                    <h4>Sour Fig Tea</h4>
                    <p>Soothing herbal infusion</p>
                    <div class="product-price">R65</div>
                    <button class="product-btn" data-product="3">Add to Cart</button>
                </div>
            </div>
        </div>
        <div class="products-cta">
            <a href="/products" class="btn" data-link>View All Products</a>
        </div>
    </div>
</section>
</div>
`;
}
