/* =========================================================
   SILLYTAVERN — NoZoomAvatar
   Bloque le zoom des avatars sans bloquer leur clic.
   ========================================================= */

(() => {
    "use strict";

    const EXTENSION_NAME = "[NoZoomAvatar]";

    /**
     * Masque tout overlay d'avatar zoomé créé par SillyTavern.
     * Le clic sur l'avatar normal reste totalement fonctionnel.
     */
    function removeZoomOverlay() {
        document.querySelectorAll(
            ".zoomed_avatar, #zoomed_avatar"
        ).forEach(element => {
            element.style.setProperty(
                "display",
                "none",
                "important"
            );

            element.style.setProperty(
                "visibility",
                "hidden",
                "important"
            );

            element.style.setProperty(
                "opacity",
                "0",
                "important"
            );

            element.style.setProperty(
                "pointer-events",
                "none",
                "important"
            );
        });
    }

    /**
     * Surveille le DOM afin de supprimer immédiatement
     * un éventuel overlay de zoom ajouté dynamiquement.
     */
    const observer = new MutationObserver(() => {
        removeZoomOverlay();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    /**
     * Nettoyage initial.
     */
    removeZoomOverlay();

    console.log(`${EXTENSION_NAME} enabled.`);
})();