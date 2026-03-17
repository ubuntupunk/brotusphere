export function notFound() {
    return `
<div class="page" id="page-notfound">
<div class="page-header" style="min-height: 60vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
    <h1 style="font-size: 6rem; color: var(--primary);">404</h1>
    <h2 style="color: var(--primary); margin-bottom: 16px;">Page Not Found</h2>
    <p style="color: var(--text-secondary); margin-bottom: 32px;">The page you're looking for doesn't exist.</p>
    <a href="/" class="btn btn-primary" data-link>Go Home</a>
</div>
</div>
`;
}
