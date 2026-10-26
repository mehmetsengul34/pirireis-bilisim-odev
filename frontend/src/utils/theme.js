export function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark');
    return 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    return 'light';
  }
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: 'light' }));
    return 'light';
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: 'dark' }));
    return 'dark';
  }
}

export function getTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}
