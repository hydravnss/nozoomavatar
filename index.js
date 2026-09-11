/* =========================================================
   NoZoomAvatar — SillyTavern
   Empêche uniquement l'affichage du zoom avatar.
   Le clic sur l'avatar reste fonctionnel.
   ========================================================= */

(() => {
    'use strict';

    const EXTENSION_NAME = 'NoZoomAvatar';

    function hideZoom() {
        const zoom = document.querySelector('.zoomed_avatar');

        if (!zoom) return;

        zoom.style.setProperty('display', 'none', 'important');
        zoom.style.setProperty('visibility', 'hidden', 'important');
        zoom.style.setProperty('opacity', '0', 'important');
        zoom.style.setProperty('pointer-events', 'none', 'important');
    }

    /*
     * SillyTavern peut créer .zoomed_avatar après le clic.
     * On surveille donc le DOM en permanence.
     */
    const observer = new MutationObserver(() => {
        hideZoom();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    /*
     * Vérification régulière supplémentaire.
     * Utile notamment sur mobile/iOS où le DOM peut être
     * modifié après les animations.
     */
    setInterval(hideZoom, 100);

    /*
     * Première vérification.
     */
    hideZoom();

    console.log(`[${EXTENSION_NAME}] enabled`);
})();