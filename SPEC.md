# Brotusphere - Sour Fig Repository

## Project Overview

**Project Name:** Brotusphere  
**Project Type:** Content + E-commerce Website  
**Core Functionality:** Educational resource about Carpobrotus edulis (sour fig) with product sales  
**Target Users:** Health-conscious individuals, gardeners, herbal enthusiasts, South Africans

---

## UI/UX Specification

### Layout Structure

**Pages:**
1. **Home** - Hero, introduction, featured content, products preview
2. **About** - The story of the sour fig, its misunderstood nature in SA
3. **Health & Nutrition** - Medical applications, nutritional info, benefits
4. **Products** - Shop for sour fig products (jam, etc.)
5. **Contact** - Contact form

**Responsive Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette:**
- Primary: `#2D5016` (deep sage green - plant/nature)
- Secondary: `#F4A259` (warm terracotta orange - fruit/sun)
- Accent: `#BC4749` (rich red - bold statements)
- Background: `#FEFAE0` (warm cream - natural/organic feel)
- Text Primary: `#283618` (dark forest green)
- Text Secondary: `#606C38` (muted olive)
- Light Accent: `#DDA15E` (golden honey)

**Typography:**
- Headings: "Fraunces" (serif, warm, distinctive)
- Body: "Outfit" (clean, modern, readable)
- Accent: "Caveat" (handwritten for personal touches)

**Spacing System:**
- Base unit: 8px
- Section padding: 80px (desktop), 48px (mobile)
- Component gaps: 24px
- Card padding: 32px

**Visual Effects:**
- Organic, flowing shapes
- Subtle grain texture overlay
- Soft shadows with warm tones
- Gentle parallax on hero
- Staggered fade-in animations

### Components

**Navigation:**
- Fixed top nav with logo
- Transparent on hero, solid on scroll
- Mobile: hamburger menu with slide-in drawer

**Hero Section:**
- Full viewport height
- Background: artistic sour fig illustration/photo
- Animated headline with typewriter effect
- Call-to-action buttons

**Content Cards:**
- Rounded corners (16px)
- Soft shadow
- Hover: lift + shadow increase
- Image + title + excerpt + link

**Product Cards:**
- Image, name, price, "Add to Cart" button
- Hover: scale image slightly
- Badge for "Featured" items

**Buttons:**
- Primary: filled with accent color
- Secondary: outlined
- Hover: color shift + slight scale

**Footer:**
- Newsletter signup
- Social links
- Quick navigation

---

## Functionality Specification

### Core Features

1. **Responsive Navigation** - Smooth scroll to sections, mobile menu
2. **Content Sections** - Informative pages about sour fig
3. **Product Display** - Grid of products with prices
4. **Shopping Cart** - Add/remove items, cart count in nav
5. **Contact Form** - Name, email, message fields
6. **Animations** - Scroll-triggered fade-ins, hover effects
7. **Newsletter Signup** - Email capture form

### User Interactions
- Smooth scrolling between sections
- Cart updates persist in localStorage
- Form validation with visual feedback
- Image lazy loading

---

## Acceptance Criteria

1. ✅ Home page loads with hero animation
2. ✅ All 5 pages are accessible and responsive
3. ✅ Navigation works on all devices
4. ✅ Products can be added to cart
5. ✅ Cart displays correct item count
6. ✅ Contact form validates inputs
7. ✅ Animations trigger on scroll
8. ✅ Color palette matches spec exactly
9. ✅ Typography matches spec exactly
10. ✅ All images and assets load correctly
