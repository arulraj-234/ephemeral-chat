(function(){
    // Minimal theme toggler
    const THEME_KEY = 'ephemeralchat_theme';
    const root = document.documentElement;
    const btns = document.querySelectorAll('#themeToggleBtn');

    function applyTheme(theme) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            updateButtons('🌞');
        } else {
            root.removeAttribute('data-theme');
            updateButtons('🌚');
        }
    }

    function updateButtons(text) {
        btns.forEach(b => {
            b.textContent = text;
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
