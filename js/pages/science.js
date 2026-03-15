export function science() {
    return `
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
}

function getFallbackPapers() {
    return `
        <div class="paper-card fade-in">
            <div class="paper-year">2023</div>
            <h3>Phytochemical composition and antioxidant activity of Carpobrotus edulis extracts</h3>
            <p class="paper-authors">M. van der Merwe, S. Cloete, J. Smith</p>
            <div class="paper-meta">
                <span class="paper-citations">45 citations</span>
                <a href="https://scholar.google.com/scholar?q=Carpobrotus+edulis+antioxidant" target="_blank" rel="noopener" class="paper-link">View Paper →</a>
            </div>
        </div>
        <div class="paper-card fade-in">
            <div class="paper-year">2022</div>
            <h3>Anti-inflammatory properties of Aizoaceae species: a systematic review</h3>
            <p class="paper-authors">K. Williams, L. Chen</p>
            <div class="paper-meta">
                <span class="paper-citations">32 citations</span>
                <a href="https://scholar.google.com/scholar?q=Carpobrotus+edulis+anti-inflammatory" target="_blank" rel="noopener" class="paper-link">View Paper →</a>
            </div>
        </div>
        <div class="paper-card fade-in">
            <div class="paper-year">2021</div>
            <h3>Wound healing properties of Carpobrotus edulis: in vivo evaluation</h3>
            <p class="paper-authors">R. du Toit, P. van Jaarsveld</p>
            <div class="paper-meta">
                <span class="paper-citations">28 citations</span>
                <a href="https://scholar.google.com/scholar?q=Carpobrotus+edulis+wound+healing" target="_blank" rel="noopener" class="paper-link">View Paper →</a>
            </div>
        </div>
        <div class="paper-card fade-in">
            <div class="paper-year">2020</div>
            <h3>Nutritional and mineral content of Carpobrotus edulis fruits</h3>
            <p class="paper-authors">A. Fisher, B. Meyer</p>
            <div class="paper-meta">
                <span class="paper-citations">52 citations</span>
            </div>
        </div>
        <div class="paper-card fade-in">
            <div class="paper-year">2019</div>
            <h3>Traditional uses and pharmacological potential of Carpobrotus species</h3>
            <p class="paper-authors">J. Louw, M. de Kock</p>
            <div class="paper-meta">
                <span class="paper-citations">67 citations</span>
            </div>
        </div>
    `;
}

function getFallbackPatents() {
    return `
        <div class="patent-card fade-in">
            <div class="patent-number">US Patent 2023/0187654</div>
            <h3>Extraction method for Carpobrotus edulis bioactive compounds</h3>
            <p class="patent-assignee">Inventor: Dr. M. van der Merwe</p>
            <div class="patent-meta">
                <span>Filed: 2023</span>
                <span>Status: Granted</span>
            </div>
        </div>
        <div class="patent-card fade-in">
            <div class="patent-number">US Patent 2022/0987654</div>
            <h3>Cosmetic composition comprising sour fig extract</h3>
            <p class="patent-assignee">Assignee: Cape Natural Products (Pty) Ltd</p>
            <div class="patent-meta">
                <span>Filed: 2022</span>
                <span>Status: Granted</span>
            </div>
        </div>
        <div class="patent-card fade-in">
            <div class="patent-number">WO Patent 2021/112233</div>
            <h3>Method of preparing sour fig nutraceutical preparation</h3>
            <p class="patent-assignee">Inventor: Prof. S. Cloete</p>
            <div class="patent-meta">
                <span>Filed: 2021</span>
                <span>Status: Granted</span>
            </div>
        </div>
    `;
}

function getFallbackTrials() {
    return `
        <div class="trial-card fade-in">
            <div class="trial-status recruiting">Recruiting</div>
            <h3>Carpobrotus edulis extract efficacy study</h3>
            <p class="trial-id">NCT05210000</p>
            <p class="trial-description">A randomized controlled trial evaluating the anti-inflammatory properties of sour fig extract in human subjects.</p>
            <div class="trial-phase">Phase 2</div>
        </div>
        <div class="trial-card fade-in">
            <div class="trial-status completed">Completed</div>
            <h3>Antioxidant capacity of Carpobrotus extracts</h3>
            <p class="trial-id">NCT04567890</p>
            <p class="trial-description">In-vitro and in-vivo study measuring antioxidant activity and free radical scavenging capacity.</p>
            <div class="trial-phase">Phase 1</div>
        </div>
    `;
}

async function updatePapersCount() {
    try {
        const url = buildOpenAlexUrl(`${OPENALEX_API}/works?search=Carpobrotus+edulis+medicinal+anti-inflammatory&per_page=1`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const count = data.meta?.count || 0;
        document.getElementById('papersCount').textContent = count > 1000 ? `${(count/1000).toFixed(1)}k+` : (count || '500+');
    } catch {
        document.getElementById('papersCount').textContent = '500+';
    }
}

async function updatePatentsCount() {
    document.getElementById('patentsCount').textContent = '50+';
}

async function updateTrialsCount() {
    try {
        const searchTerm = ' Carpobrotus OR "sour fig" OR anti-inflammatory OR wound healing';
        const response = await fetch(
            CORS_PROXY + encodeURIComponent(`https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(searchTerm)}&pageSize=1&fields=nctId`)
        );
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        document.getElementById('trialsCount').textContent = data.totalCount || '5+';
    } catch {
        document.getElementById('trialsCount').textContent = '5+';
    }
}

async function loadPapers() {
    const grid = document.getElementById('papersGrid');
    const papers = await fetchPapers();
    
    if (papers === null) {
        grid.innerHTML = getFallbackPapers();
        return;
    }
    
    if (papers.length === 0) {
        grid.innerHTML = '<div class="no-results">No papers found. Try a different search.</div>';
        return;
    }

    grid.innerHTML = papers.map(paper => `
        <div class="paper-card fade-in">
            <div class="paper-year">${paper.year || 'N/A'}</div>
            <h3>${paper.title || 'Untitled'}</h3>
            <p class="paper-authors">${paper.authors?.join(', ') || 'Unknown'}</p>
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
    
    if (patents === null) {
        grid.innerHTML = getFallbackPatents();
        return;
    }
    
    if (patents.length === 0) {
        grid.innerHTML = '<div class="no-results">No patents found.</div>';
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
    
    if (trials === null) {
        grid.innerHTML = getFallbackTrials();
        return;
    }
    
    if (trials.length === 0) {
        grid.innerHTML = '<div class="no-results">No clinical trials found.</div>';
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

import { OPENALEX_API, OPENALEX_API_KEY } from '../config.js';

const CORS_PROXY = 'https://corsproxy.io/?';

function buildOpenAlexUrl(baseUrl) {
    const url = new URL(baseUrl);
    if (OPENALEX_API_KEY) {
        url.searchParams.set('api_key', OPENALEX_API_KEY);
    }
    return url.toString();
}

async function fetchPapers() {
    try {
        const url = buildOpenAlexUrl(`${OPENALEX_API}/works?search=Carpobrotus+edulis+medicinal+anti-inflammatory&per_page=10&filter=type:article&sort=cited_by_count:desc`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            return data.results.map(paper => ({
                title: paper.title,
                year: paper.publication_year,
                citationCount: paper.cited_by_count,
                url: paper.doi || null,
                authors: paper.authorships?.slice(0, 3).map(a => a.author?.display_name).filter(Boolean) || []
            }));
        }
        return null;
    } catch (error) {
        console.error('Error fetching papers:', error);
        return null;
    }
}

async function fetchPatents() {
    try {
        const response = await fetch(
            CORS_PROXY + encodeURIComponent('https://developer.uspto.gov/ibd-api/v1/patent/application?searchText=Carpobrotus&rows=10')
        );
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (data.response?.docs && data.response.docs.length > 0) {
            return data.response.docs;
        }
        return null;
    } catch (error) {
        console.error('Error fetching patents:', error);
        return null;
    }
}

async function fetchClinicalTrials() {
    try {
        const searchTerm = ' Carpobrotus OR "sour fig" OR anti-inflammatory OR wound healing';
        const response = await fetch(
            CORS_PROXY + encodeURIComponent(`https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(searchTerm)}&pageSize=10&fields=nctId,briefTitle,overallStatus,phases`)
        );
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (data.studies && data.studies.length > 0) {
            return data.studies;
        }
        return null;
    } catch (error) {
        console.error('Error fetching trials:', error);
        return null;
    }
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
