/* =========================================================
   SILLYTAVERN — NoZoomAvatar
   Empêche le recadrage/redimensionnement automatique
   des avatars de personnages et personas.
   ========================================================= */

(() => {
    "use strict";

    const EXTENSION_NAME = "[NoZoomAvatar]";

    function enableNeverResize() {
        const checkbox = document.querySelector("#never_resize_avatars");

        if (!checkbox) return;

        if (!checkbox.checked) {
            checkbox.checked = true;

            // Informe SillyTavern que la valeur a changé
            checkbox.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );

            checkbox.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );

            console.log(
                `${EXTENSION_NAME} : Never resize avatars activé.`
            );
        }
    }

    // Première tentative
    enableNeverResize();

    // Le panneau des paramètres peut être créé après le chargement.
    const observer = new MutationObserver(() => {
        enableNeverResize();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Sécurité supplémentaire
    setInterval(enableNeverResize, 1000);

    console.log(`${EXTENSION_NAME} loaded.`);
})();