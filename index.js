/* =========================================================
   NoZoomAvatar
   Force SillyTavern à NE JAMAIS recadrer/redimensionner
   les avatars des personnages et des personas.
   ========================================================= */

import { power_user } from '../../power-user.js';
import { saveSettingsDebounced } from '../../../script.js';

(() => {
    'use strict';

    const EXTENSION_NAME = '[NoZoomAvatar]';

    function forceNoResize() {
        // Force directement le réglage interne de SillyTavern
        if (power_user.never_resize_avatars !== true) {
            power_user.never_resize_avatars = true;
            saveSettingsDebounced();
        }

        // Force également la case de l'interface si elle existe
        const checkbox = document.querySelector('#never_resize_avatars');

        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
        }
    }

    // Activation immédiate
    forceNoResize();

    // Si SillyTavern recharge ses paramètres après l'extension,
    // on remet immédiatement la valeur à true.
    const observer = new MutationObserver(() => {
        forceNoResize();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Sécurité : impossible pour le réglage de rester désactivé.
    setInterval(forceNoResize, 500);

    console.log(`${EXTENSION_NAME} : Never resize avatars FORCÉ.`);
})();