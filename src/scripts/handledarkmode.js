const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
const sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

if (localStorage.getItem('darkMode') === 'true' || (localStorage.getItem('darkMode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark-mode');
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('themeToggle').addEventListener('click', () => toggleDarkMode());

    function setThemeIcon(isDarkMode) {
        const themeToggleBtn = document.getElementById('themeToggle');
        themeToggleBtn.innerHTML = isDarkMode ? sunIcon : moonIcon;
    }

    function toggleDarkMode(force) {
        const isDarkMode = force !== undefined ? force : !document.documentElement.classList.contains('dark-mode');
        document.documentElement.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('darkMode', isDarkMode);
        setThemeIcon(isDarkMode);
        togglePrismTheme(isDarkMode);
    }

    function prefersDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function togglePrismTheme(isDarkMode) {
        const prismThemeLink = document.getElementById('prismTheme');
        prismThemeLink.href = isDarkMode ? '/stylesheets/syntax-dark.css' : '/stylesheets/syntax-light.css';
    }

    function initializeTheme() {
        const savedDarkMode = localStorage.getItem('darkMode');
        const isDarkMode = savedDarkMode !== null ? JSON.parse(savedDarkMode) : prefersDarkMode();
        toggleDarkMode(isDarkMode);
    }


    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('darkMode') === null) {
            toggleDarkMode(e.matches);
        }
    });

    initializeTheme();
});





