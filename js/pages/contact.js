export const contact = `
<div class="page" id="page-contact">
<div class="contact-hero">
    <h1>Get in Touch</h1>
    <p>We'd love to hear from you - questions, feedback, or just to say hello</p>
</div>

<section class="contact-content">
    <div class="contact-wrapper">
        <div class="contact-info">
            <h3>Let's Connect</h3>
            <p>Whether you're interested in our products, want to learn more about sour figs, or have a question about using them, we're here to help.</p>
            <ul class="contact-methods">
                <li>
                    <div class="icon">📧</div>
                    <div>
                        <div class="label">Email</div>
                        <div class="value">hello@brotusphere.co.za</div>
                    </div>
                </li>
                <li>
                    <div class="icon">📍</div>
                    <div>
                        <div class="label">Location</div>
                        <div class="value">Cape Town, South Africa</div>
                    </div>
                </li>
                <li>
                    <div class="icon">🕐</div>
                    <div>
                        <div class="label">Hours</div>
                        <div class="value">Mon - Fri: 9am - 5pm SAST</div>
                    </div>
                </li>
            </ul>
        </div>
        <form class="contact-form" id="contactForm">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required placeholder="Your name">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="your@email.com">
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" required placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" class="submit-btn">Send Message</button>
        </form>
    </div>
</section>
</div>
`;
