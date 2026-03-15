# Science Page API Documentation

This document outlines the external APIs used on the `/science` page to fetch research papers, patents, and clinical trials.

## Overview

The science page fetches data from three external APIs:
1. **OpenAlex** - Academic papers
2. **USPTO** - Patent filings
3. **ClinicalTrials.gov** - Clinical trials

## API Endpoints

### 1. OpenAlex (Academic Papers)

**Purpose:** Fetch peer-reviewed research papers on Carpobrotus edulis and related topics.

**Base URL:** `https://api.openalex.org`

**Endpoints Used:**
- Search works: `GET /works?search=...`
- Count: `GET /works?search=...&per_page=1`

**Rate Limits:**
- Without API key: 100,000 requests/day
- With API key: Higher limits (see OpenAlex pricing)

**API Key:**
- Add to `js/config.js`: `OPENALEX_API_KEY = 'your-key'`

**Search Query:**
```
search=Carpobrotus+edulis+medicinal+anti-inflammatory
filter=type:article
sort=cited_by_count:desc
per_page=10
```

**Fallback:** Curated list of 5 research papers when API fails.

---

### 2. USPTO (Patents)

**Purpose:** Fetch patent applications related to Carpobrotus.

**Base URL:** `https://developer.uspto.gov/ibd-api/v1/patent/application`

**Endpoint:**
```
GET /application?searchText=Carpobrotus&rows=10
```

**Authentication:** None (public API)

**Notes:**
- Uses CORS proxy (`corsproxy.io`) for browser requests
- API can be unreliable (returns 503 errors)

**Fallback:** Curated list of 3 patent examples.

---

### 3. ClinicalTrials.gov (Clinical Trials)

**Purpose:** Fetch clinical trials related to anti-inflammatory and wound healing.

**Base URL:** `https://clinicaltrials.gov/api/v2`

**Endpoints:**
- Search: `GET /studies?query.cond=...&pageSize=10`
- Count: `GET /studies?query.cond=...&pageSize=1`

**Search Query:**
```
query.cond= Carpobrotus OR "sour fig" OR anti-inflammatory OR wound healing
fields=nctId,briefTitle,overallStatus,phases
```

**Authentication:** None (public API)

**Rate Limit:** ~50 requests/minute

**Notes:**
- Uses CORS proxy for browser requests
- "Carpobrotus" alone returns 400 (not a recognized condition)
- Uses broader health terms for search

**Fallback:** Curated list of 2 trial examples.

---

## Configuration

All API configuration is in `js/config.js`:

```javascript
export const OPENALEX_API = 'https://api.openalex.org';
export const OPENALEX_API_KEY = ''; // Add key for higher rate limits
```

## Error Handling

All API calls include try/catch blocks. On failure, the page displays curated fallback data rather than empty states.

## CORS Proxy

Browser requests to USPTO and ClinicalTrials.gov go through `https://corsproxy.io/` to bypass CORS restrictions.
