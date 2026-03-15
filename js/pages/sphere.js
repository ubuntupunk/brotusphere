export function sphere() {
    return `
<div class="page" id="page-sphere">
    <section class="sphere-hero">
        <div class="container">
            <span class="hero-badge">📚 Brotusphere Library</span>
            <h1>In-Depth <span class="highlight">Articles</span></h1>
            <p class="hero-description">Explore our collection of detailed articles about Carpobrotus edulis — the remarkable sour fig.</p>
            <p class="carousel-hint">Use ← → arrow keys or swipe to navigate</p>
        </div>
    </section>

    <section class="sphere-carousel">
        <button class="carousel-btn carousel-prev" aria-label="Previous article">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
        
        <div class="carousel-track-container">
            <div class="carousel-track">
                <article class="carousel-slide" data-slide="0">
                    <div class="slide-inner">
                        <span class="article-category category-medicinal">Medicinal Uses</span>
                        <h2>The Sour Fig: A South African Medicinal Treasure</h2>
                        <div class="slide-content">
                            <h3>A Rich Heritage</h3>
                            <p>The sour fig (<em>Carpobrotus edulis</em>) has deep roots in South African traditional medicine and cuisine. Indigenous Khoikhoi people have used this plant for generations.</p>
                            <p>This remarkable succulent plant offers two distinct types of benefits: the <strong>fruit</strong> provides nutritional value, while the <strong>leaves and their gel-like sap</strong> contain powerful medicinal compounds.</p>

                            <h3>Traditional Medicinal Uses</h3>
                            
                            <h4>Wound Healing & Burns</h4>
                            <p class="status-validated"><strong>Status: Scientifically Validated</strong></p>
                            <p>Studies show the aqueous leaf extract promotes wound closure and increases collagen production.</p>

                            <h4>Digestive Aid</h4>
                            <p class="status-supported"><strong>Status: Strongly Supported</strong></p>
                            <p>Traditionally used for diarrhea, stomach cramps, and ulcers.</p>

                            <h4>Diabetes Treatment</h4>
                            <p class="status-validated"><strong>Status: Scientifically Validated</strong></p>
                            <p>Phenolic compounds inhibit alpha-amylase and alpha-glucosidase enzymes.</p>

                            <h4>Other Uses</h4>
                            <ul>
                                <li><strong>Eczema Treatment</strong> - Well-documented</li>
                                <li><strong>Hypertension</strong> - Traditional use</li>
                                <li><strong>Insect Bites</strong> - Soothing relief</li>
                            </ul>

                            <h3>Nutritional Value</h3>
                            <ul>
                                <li>High in carbohydrates (60-70%)</li>
                                <li>Good source of dietary fiber</li>
                                <li>Rich in minerals: calcium, magnesium, iron, manganese, zinc</li>
                                <li>Contains carotenoids (vitamin A precursors)</li>
                            </ul>
                        </div>
                    </div>
                </article>

                <article class="carousel-slide" data-slide="1">
                    <div class="slide-inner">
                        <span class="article-category category-science">Science</span>
                        <h2>The Bioactive Compounds of Sour Fig</h2>
                        <div class="slide-content">
                            <h3>Introduction</h3>
                            <p>Sour fig is a pharmacy of bioactive compounds. Phenolic family compounds account for up to 50-60% of its chemical composition.</p>

                            <h3>Key Compounds</h3>
                            
                            <h4>Flavonoids</h4>
                            <ul>
                                <li><strong>Catechin</strong> - Neuroprotective</li>
                                <li><strong>Epicatechin</strong> - Cardiovascular health</li>
                                <li><strong>Quercetin</strong> - Anti-inflammatory</li>
                                <li><strong>Kaempferol</strong> - Cardioprotective</li>
                                <li><strong>Rutin</strong> - Vascular health</li>
                            </ul>

                            <h4>Phenolic Acids</h4>
                            <ul>
                                <li><strong>Chlorogenic Acid</strong> - Blood sugar regulation</li>
                                <li><strong>Gallic Acid</strong> - Powerful antioxidant</li>
                                <li><strong>Ferulic Acid</strong> - UV protection</li>
                            </ul>

                            <h4>Terpenoids</h4>
                            <ul>
                                <li><strong>Oleanolic Acid</strong> - Antimicrobial (TB)</li>
                                <li><strong>Uvaol</strong> - Antitumoral</li>
                            </ul>

                            <h3>Validated Activities</h3>
                            <div class="activity-grid">
                                <div class="activity-item">✓ Antioxidant</div>
                                <div class="activity-item">✓ Anti-inflammatory</div>
                                <div class="activity-item">✓ Antimicrobial</div>
                                <div class="activity-item">✓ Antidiabetic</div>
                                <div class="activity-item">✓ Wound healing</div>
                                <div class="activity-item">✓ Neuroprotective</div>
                                <div class="activity-item">✓ Cardioprotective</div>
                                <div class="activity-item">✓ Anticancer</div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>

        <button class="carousel-btn carousel-next" aria-label="Next article">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </button>

        <div class="carousel-dots">
            <button class="carousel-dot active" data-slide="0" aria-label="Go to slide 1"></button>
            <button class="carousel-dot" data-slide="1" aria-label="Go to slide 2"></button>
        </div>
    </section>
</div>
    `;
}

export function initSphereCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    const trackContainer = document.querySelector('.carousel-track-container');
    trackContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    goToSlide(0);
}
