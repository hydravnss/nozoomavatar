/* =========================================================
   NoZoomAvatar — SillyTavern
   Empêche le zoom/crop VISUEL des avatars.
   Le clic sur les avatars reste entièrement fonctionnel.
   ========================================================= */

(() => {
    'use strict';

    const EXTENSION_NAME = 'NoZoomAvatar';

    const AVATAR_SELECTOR = [
        '.character_select .avatar img',
        '.character_select_container .avatar img',
        '.group_select .avatar img',
        '.group_member .avatar img',
        '.persona .avatar img',
        '.persona_select .avatar img',
        '.persona_select_container .avatar img',
        '#persona-management .avatar img',
        '#persona-management img.avatar'
    ].join(',');

    function fixAvatars() {
        document.querySelectorAll(AVATAR_SELECTOR).forEach(img => {
            // Conserve les proportions de l'image
            img.style.setProperty('object-fit', 'contain', 'important');
            img.style.setProperty('object-position', 'center', 'important');

            // Supprime les transformations qui peuvent agrandir l'image
            img.style.setProperty('transform', 'none', 'important');
            img.style.setProperty('scale', '1', 'important');
        });
    }

    // Première application
    fixAvatars();

    // SillyTavern reconstruit souvent les listes dynamiquement
    const observer = new MutationObserver(() => {
        fixAvatars();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Vérification supplémentaire
    setInterval(fixAvatars, 500);

    console.log(`[${EXTENSION_NAME}] loaded.`);
})();