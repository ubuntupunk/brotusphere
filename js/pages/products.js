export function products() {
    return `
<div class="page" id="page-products">
<div class="shop-hero">
    <h1>Our Products</h1>
    <p>Handcrafted with love using locally sourced sour figs</p>
</div>

<section class="shop-content">
    <div class="shop-grid">
        <div class="shop-product fade-in">
            <div class="shop-product-image">
                <span class="shop-product-badge">Bestseller</span>
                🫐
            </div>
            <div class="shop-product-info">
                <h3>Traditional Sour Fig Jam</h3>
                <p class="description">Made using a generations-old recipe. Perfect on toast, scones, or as a cheese pairing.</p>
                <div class="shop-product-price">R85</div>
                <button class="shop-product-btn" data-product="1">Add to Cart</button>
            </div>
        </div>

        <div class="shop-product fade-in">
            <div class="shop-product-image">🍯</div>
            <div class="shop-product-info">
                <h3>Sour Fig Honey</h3>
                <p class="description">Our unique honey infused with sour fig. Perfect for tea or as a natural sweetener.</p>
                <div class="shop-product-price">R120</div>
                <button class="shop-product-btn" data-product="2">Add to Cart</button>
            </div>
        </div>

        <div class="shop-product fade-in">
            <div class="shop-product-image">
                <span class="shop-product-badge">New</span>
                🍵
            </div>
            <div class="shop-product-info">
                <h3>Sour Fig Herbal Tea</h3>
                <p class="description">Dried sour fig slices for a soothing, healthy tea. Naturally caffeine-free.</p>
                <div class="shop-product-price">R65</div>
                <button class="shop-product-btn" data-product="3">Add to Cart</button>
            </div>
        </div>

        <div class="shop-product fade-in">
            <div class="shop-product-image">🧴</div>
            <div class="shop-product-info">
                <h3>Sour Fig Skin Salve</h3>
                <p class="description">Natural skincare product made with sour fig extracts. For dry skin and minor wounds.</p>
                <div class="shop-product-price">R95</div>
                <button class="shop-product-btn" data-product="4">Add to Cart</button>
            </div>
        </div>

        <div class="shop-product fade-in">
            <div class="shop-product-image">🥫</div>
            <div class="shop-product-info">
                <h3>Sour Fig Chutney</h3>
                <p class="description">A savory-sweet chutney perfect for pairing with meats and cheeses.</p>
                <div class="shop-product-price">R75</div>
                <button class="shop-product-btn" data-product="5">Add to Cart</button>
            </div>
        </div>

        <div class="shop-product fade-in">
            <div class="shop-product-image">
                <span class="shop-product-badge">Limited</span>
                🎁
            </div>
            <div class="shop-product-info">
                <h3>Sour Fig Gift Set</h3>
                <p class="description">The perfect introduction to sour fig. Includes jam, honey, and tea.</p>
                <div class="shop-product-price">R250</div>
                <button class="shop-product-btn" data-product="6">Add to Cart</button>
            </div>
        </div>
    </div>
</section>
</div>
`;
}
