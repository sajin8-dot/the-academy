// Inline script to prevent FOUC on dark mode
export default function DarkModeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  try {
    var stored = localStorage.getItem('dispatch-theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
        `,
      }}
    />
  );
}
