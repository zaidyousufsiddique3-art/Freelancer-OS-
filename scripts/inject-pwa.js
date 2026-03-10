const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// PWA meta tags to inject into <head>
const headTags = `
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/assets/icon.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="FreelancerOS" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="FreelancerOS" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />`;

// Service worker registration script to inject before </body>
const swScript = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js')
            .then(function(reg) { console.log('SW registered:', reg.scope); })
            .catch(function(err) { console.log('SW registration failed:', err); });
        });
      }
    </script>`;

// Additional styles for app-like feel
const appStyles = `
    <style>
      body { overscroll-behavior-y: contain; -webkit-font-smoothing: antialiased; }
      * { -webkit-tap-highlight-color: transparent; }
      #root { -webkit-overflow-scrolling: touch; }
    </style>`;

// Replace the existing basic viewport meta with our enhanced one
html = html.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />',
  ''
);

// Inject before </head>
html = html.replace('</head>', headTags + appStyles + '\n  </head>');

// Inject before </body>
html = html.replace('</body>', swScript + '\n  </body>');

fs.writeFileSync(indexPath, html);
console.log('PWA tags injected into index.html');
