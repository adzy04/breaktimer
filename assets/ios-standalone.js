/**
 * iOS Standalone Fullscreen Link Handler
 * 
 * Prevents iOS Safari from escaping fullscreen standalone mode and opening
 * regular Safari tabs when clicking internal links.
 */
(function () {
    // Detect standalone mode (iOS or standard PWA)
    const isIOSStandalone = ('standalone' in window.navigator) && window.navigator.standalone;
    const isPWAStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;

    if (isIOSStandalone || isPWAStandalone) {
        document.addEventListener('click', function (event) {
            let node = event.target;

            // Climb up the DOM tree to locate an <a> element if a child was clicked
            while (node && node.nodeName !== 'A' && node.nodeName !== 'HTML') {
                node = node.parentNode;
            }

            if (!node || node.nodeName !== 'A' || !node.href) {
                return;
            }

            // Don't intercept mailto, tel, or javascript
            const href = node.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            // Parse URL
            try {
                const targetUrl = new URL(node.href, window.location.href);

                // If same origin and regular self target, handle navigation without escaping standalone mode
                const isSameOrigin = targetUrl.origin === window.location.origin;
                const isTargetBlank = node.getAttribute('target') === '_blank';
                const isDownload = node.hasAttribute('download');

                if (isSameOrigin && !isTargetBlank && !isDownload) {
                    event.preventDefault();
                    window.location.href = targetUrl.href;
                }
            } catch (err) {
                // Ignore parse errors and let browser handle naturally
            }
        }, false);
    }
})();
