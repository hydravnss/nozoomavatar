/* =========================================================
   NoZoomAvatar
   Force "Never resize avatars" ON
   ========================================================= */

(() => {
    'use strict';

    const EXTENSION_NAME = 'NoZoomAvatar';

    function forceNoResize() {
        const checkbox = document.querySelector('#never_resize_avatars');

        if (!checkbox) {
            return;
        }

        // Force l'option activée
        if (!checkbox.checked) {
            checkbox.checked = true;

            // Informe SillyTavern du changement
            if (window.jQuery) {
                window.jQuery(checkbox).trigger('input');
                window.jQuery(checkbox).trigger('change');
            } else {
                checkbox.dispatchEvent(
                    new Event('input', { bubbles: true })
                );

                checkbox.dispatchEvent(
                    new Event('change', { bubbles: true })
                );
            }
        }
    }

    // Attend que SillyTavern ait chargé son interface
    const observer = new MutationObserver(() => {
        forceNoResize();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Vérification régulière
    const interval = setInterval(() => {
        forceNoResize();
    }, 500);

    // Première tentative
    forceNoResize();

    console.log(`[${EXTENSION_NAME}] loaded — avatar resizing disabled.`);
})();