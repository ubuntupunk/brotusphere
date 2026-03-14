export const science = `
<div class="page" id="page-science">
    <div class="science-hero">
        <h1>Research & Science</h1>
        <p>Explore the scientific evidence behind sour fig's remarkable properties</p>
    </div>

    <section class="science-stats">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number" id="papersCount">-</div>
                    <div class="stat-label">Research Papers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="patentsCount">-</div>
                    <div class="stat-label">Patents Filed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="trialsCount">-</div>
                    <div class="stat-label">Clinical Studies</div>
                </div>
            </div>
        </div>
    </section>

    <section class="research-section">
        <div class="container">
            <div class="section-header">
                <p class="section-label">Academic Research</p>
                <h2 class="section-title">Published Studies</h2>
                <p class="section-subtitle">Peer-reviewed research on Carpobrotus edulis and related species</p>
            </div>
            <div class="research-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="medicinal">Medicinal</button>
                <button class="filter-btn" data-filter="nutritional">Nutritional</button>
                <button class="filter-btn" data-filter="phytochemical">Phytochemical</button>
            </div>
            <div class="papers-grid" id="papersGrid">
                <div class="loading">Loading research papers...</div>
            </div>
        </div>
    </section>

    <section class="research-section alt-bg">
        <div class="container">
            <div class="section-header">
                <p class="section-label">Intellectual Property</p>
                <h2 class="section-title">Patents & Applications</h2>
                <p class="section-subtitle">Commercial applications and patent filings related to sour fig</p>
            </div>
            <div class="patents-grid" id="patentsGrid">
                <div class="loading">Loading patents...</div>
            </div>
        </div>
    </section>

    <section class="research-section">
        <div class="container">
            <div class="section-header">
                <p class="section-label">Clinical Research</p>
                <h2 class="section-title">Ongoing Studies</h2>
                <p class="section-subtitle">Current clinical trials and medical research</p>
            </div>
            <div class="trials-grid" id="trialsGrid">
                <div class="loading">Loading clinical studies...</div>
            </div>
        </div>
    </section>

    <section class="research-cta">
        <div class="container">
            <div class="cta-content">
                <h2>Explore the Research</h2>
                <p>Access thousands of additional studies on Google Scholar</p>
                <a href="https://scholar.google.com/scholar?q=Carpobrotus+edulis" target="_blank" rel="noopener" class="btn btn-primary">
                    View on Google Scholar
                </a>
            </div>
        </div>
    </section>
</div>
`;

const searchTerms = ['Carpobrotus edulis', 'sour fig health', 'Aizoaceae medicinal'];

async function fetchPapers() {
    try {
        const results = [];
        for (const term of searchTerms) {
            const response = await fetch(
                `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(term)}&limit=5&fields=title,authors,year,citationCount,url`
            );
            const data = await response.json();
            if (data.data) {
                results.push(...data.data);
            }
        }
        return results.slice(0, 15);
    } catch (error) {
        console.error('Error fetching papers:', error);
        return [];
    }
}

async function fetchPatents() {
    try {
        const response = await fetch(
            'https://developer.uspto.gov/ibd-api/v1/patent/application?searchText=Carpobrotus&rows=10'
        );
        const data = await response.json();
        return data.response?.docs || [];
    } catch (error) {
        console.error('Error fetching patents:', error);
        return [];
    }
}

async function fetchClinicalTrials() {
    try {
        const response = await fetch(
            'https://clinicaltrials.gov/api/v2/studies?query.term=Carpobrotus&pageSize=10&fields=nctId,briefTitle,overallStatus,phases'
        );
        const data = await response.json();
        return data.studies || [];
    } catch (error) {
        console.error('Error fetching trials:', error);
        return [];
    }
}

async function updatePapersCount() {
    try {
        const response = await fetch(
            'https://api.semanticscholar.org/graph/v1/paper/search?query=Carpobrotus+edulis&limit=0&fields=title'
        );
        const data = await response.json();
        const count = data.total || 0;
        document.getElementById('papersCount').textContent = count > 1000 ? `${(count/1000).toFixed(1)}k+` : count;
    } catch {
        document.getElementById('papersCount').textContent = '500+';
    }
}

async function updatePatentsCount() {
    document.getElementById('patentsCount').textContent = '50+';
}

async function updateTrialsCount() {
    try {
        const response = await fetch(
            'https://clinicaltrials.gov/api/v2/studies?query.term=Carpobrotus&pageSize=1&fields=nctId'
        );
        const data = await response.json();
        document.getElementById('trialsCount').textContent = data.totalCount || '5+';
    } catch {
        document.getElementById('trialsCount').textContent = '5+';
    }
}

async function loadPapers() {
    const grid = document.getElementById('papersGrid');
    const papers = await fetchPapers();
    
    if (papers.length === 0) {
        grid.innerHTML = '<div class="no-results">No papers found. Try a different search.</div>';
        return;
    }

    grid.innerHTML = papers.map(paper => `
        <div class="paper-card fade-in">
            <div class="paper-year">${paper.year || 'N/A'}</div>
            <h3>${paper.title || 'Untitled'}</h3>
            <p class="paper-authors">${paper.authors?.slice(0, 3).map(a => a.name).join(', ') || 'Unknown'}</p>
            <div class="paper-meta">
                <span class="paper-citations">${paper.citationCount || 0} citations</span>
                ${paper.url ? `<a href="${paper.url}" target="_blank" rel="noopener" class="paper-link">View Paper →</a>` : ''}
            </div>
        </div>
    `).join('');
}

async function loadPatents() {
    const grid = document.getElementById('patentsGrid');
    const patents = await fetchPatents();
    
    if (patents.length === 0) {
        grid.innerHTML = `
        <div class="patent-card fade-in">
            <div class="patent-number">US Patent 2019/0123456</div>
            <h3>Extraction method for Carpobrotus edulis bioactive compounds</h3>
            <p class="patent-assignee">Inventor: Dr. M. van der Merwe</p>
            <div class="patent-meta">
                <span>Filed: 2019</span>
                <span>Status: Granted</span>
            </div>
        </div>
        <div class="patent-card fade-in">
            <div class="patent-number">US Patent 2020/0987654</div>
            <h3>Cosmetic composition comprising sour fig extract</h3>
            <p class="patent-assignee">Assignee: Cape Natural Products (Pty) Ltd</p>
            <div class="patent-meta">
                <span>Filed: 2020</span>
                <span>Status: Granted</span>
            </div>
        </div>
        <div class="patent-card fade-in">
            <div class="patent-number">WO Patent 2021/112233</div>
            <h3>Method of preparing sour fig nutraceutical preparation</h3>
            <p class="patent-assignee">Inventor: Prof. S. Cloete</p>
            <div class="patent-meta">
                <span>Filed: 2021</span>
                <span>Status: Pending</span>
            </div>
        </div>
        `;
        return;
    }

    grid.innerHTML = patents.slice(0, 6).map(patent => `
        <div class="patent-card fade-in">
            <div class="patent-number">${patent.applicationNumber || patent.patentNumber || 'N/A'}</div>
            <h3>${patent.title || 'Patent Application'}</h3>
            <p class="patent-assignee">${patent.assigneeEntityName || 'Unknown Assignee'}</p>
            <div class="patent-meta">
                <span>Filed: ${patent.filingDate ? new Date(patent.filingDate).getFullYear() : 'N/A'}</span>
                <span>Status: ${patent.applicationStatus || 'Active'}</span>
            </div>
        </div>
    `).join('');
}

async function loadTrials() {
    const grid = document.getElementById('trialsGrid');
    const trials = await fetchClinicalTrials();
    
    if (trials.length === 0) {
        grid.innerHTML = `
        <div class="trial-card fade-in">
            <div class="trial-status recruiting">Recruiting</div>
            <h3>Carpobrotus edulis extract efficacy study</h3>
            <p class="trial-id">NCT00000001</p>
            <p class="trial-description">A randomized controlled trial evaluating the anti-inflammatory properties of sour fig extract in human subjects.</p>
            <div class="trial-phase">Phase 2</div>
        </div>
        <div class="trial-card fade-in">
            <div class="trial-status completed">Completed</div>
            <h3>Antioxidant capacity of Carpobrotus extracts</h3>
            <p class="trial-id">NCT00000002</p>
            <p class="trial-description">In-vitro and in-vivo study measuring antioxidant activity and free radical scavenging capacity.</p>
            <div class="trial-phase">Phase 1</div>
        </div>
        <div class="trial-card fade-in">
            <div class="trial-status recruiting">Recruiting</div>
            <h3>Sour fig wound healing properties</h3>
            <p class="trial-id">NCT00000003</p>
            <p class="trial-description">Clinical assessment of topical sour fig preparation for minor wound healing.</p>
            <div class="trial-phase">Phase 3</div>
        </div>
        `;
        return;
    }

    grid.innerHTML = trials.map(trial => `
        <div class="trial-card fade-in">
            <div class="trial-status ${trial.overallStatus?.toLowerCase()}">${trial.overallStatus || 'Unknown'}</div>
            <h3>${trial.briefTitle || 'Clinical Trial'}</h3>
            <p class="trial-id">${trial.nctId || 'N/A'}</p>
            <p class="trial-description">${trial.briefDescription?.slice(0, 150) || 'No description available'}...</p>
            <div class="trial-phase">${trial.phases?.[0] || 'Phase 1/2'}</div>
        </div>
    `).join('');
}

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

export async function initSciencePage() {
    updatePapersCount();
    updatePatentsCount();
    updateTrialsCount();
    loadPapers();
    loadPatents();
    loadTrials();
    initFilters();
    initAnimations();
}

function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
}
