(function(){
    // Professional theme toggler
    const THEME_KEY = 'ephemeralchat_theme';
    const root = document.documentElement;
    const btns = document.querySelectorAll('#themeToggleBtn');
    
    // SVG icons for theme toggle
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    function applyTheme(theme) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            updateButtons(sunIcon, 'Switch to light mode');
        } else {
            root.removeAttribute('data-theme');
            updateButtons(moonIcon, 'Switch to dark mode');
        }
    }

    function updateButtons(icon, tooltip) {
        btns.forEach(b => {
            b.innerHTML = icon;
            b.setAttribute('title', tooltip);
            b.setAttribute('aria-label', tooltip);
        });
    }

    function toggleTheme() {
        const current = localStorage.getItem(THEME_KEY) || (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) applyTheme(saved);
        else {
            // Respect prefers-color-scheme initial value
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }

        // attach listeners to any toggler buttons present
        document.querySelectorAll('#themeToggleBtn').forEach(b => b.addEventListener('click', toggleTheme));
    });
})();
