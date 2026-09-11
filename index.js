/* =========================================================
   NoZoomAvatar
   Configuration des avatars SillyTavern
   ========================================================= */

(() => {
    'use strict';

    const MODULE_NAME = 'noZoomAvatar';

    const DEFAULT_SETTINGS = {
        enabled: true,
        neverResize: true,
        preventCrop: true,
        characters: true,
        personas: true,
        groups: true
    };

    let settings = null;

    function getContext() {
        return window.SillyTavern?.getContext?.();
    }

    function loadSettings() {
        const context = getContext();

        if (!context) {
            settings = structuredClone(DEFAULT_SETTINGS);
            return;
        }

        const { extensionSettings } = context;

        if (!extensionSettings[MODULE_NAME]) {
            extensionSettings[MODULE_NAME] = structuredClone(DEFAULT_SETTINGS);
        }

        settings = extensionSettings[MODULE_NAME];

        for (const key of Object.keys(DEFAULT_SETTINGS)) {
            if (!(key in settings)) {
                settings[key] = DEFAULT_SETTINGS[key];
            }
        }
    }

    function saveSettings() {
        const context = getContext();

        if (context?.saveSettingsDebounced) {
            context.saveSettingsDebounced();
        }
    }

    function applySettings() {
        if (!settings) {
            return;
        }

        document.documentElement.classList.toggle(
            'nozoomavatar-enabled',
            settings.enabled
        );

        document.documentElement.classList.toggle(
            'nozoomavatar-never-resize',
            settings.enabled && settings.neverResize
        );

        document.documentElement.classList.toggle(
            'nozoomavatar-no-crop-characters',
            settings.enabled &&
            settings.preventCrop &&
            settings.characters
        );

        document.documentElement.classList.toggle(
            'nozoomavatar-no-crop-personas',
            settings.enabled &&
            settings.preventCrop &&
            settings.personas
        );

        document.documentElement.classList.toggle(
            'nozoomavatar-no-crop-groups',
            settings.enabled &&
            settings.preventCrop &&
            settings.groups
        );

        /*
         * Si le réglage natif existe dans l'interface,
         * on le synchronise automatiquement.
         */
        const nativeSetting =
            document.querySelector('#never_resize_avatars');

        if (nativeSetting && settings.neverResize) {
            nativeSetting.checked = true;
        }
    }

    async function createSettingsPanel() {
        const context = getContext();

        if (!context) {
            console.error('[NoZoomAvatar] SillyTavern context unavailable.');
            return;
        }

        const container =
            document.querySelector('#extensions_settings2') ||
            document.querySelector('#extensions_settings');

        if (!container) {
            setTimeout(createSettingsPanel, 1000);
            return;
        }

        if (document.querySelector('#nozoomavatar_settings')) {
            return;
        }

        const panel = document.createElement('div');

        panel.id = 'nozoomavatar_settings';

        panel.innerHTML = `
            <div class="nozoomavatar-panel">

                <div class="nozoomavatar-header">
                    <div>
                        <b>NoZoomAvatar</b>
                        <small>v2.0.0</small>
                    </div>

                    <label class="nozoomavatar-switch">
                        <input
                            type="checkbox"
                            id="nozoomavatar_enabled"
                        >
                        <span></span>
                    </label>
                </div>

                <div class="nozoomavatar-description">
                    Contrôle le comportement des avatars des personnages
                    et des personas.
                </div>

                <div class="nozoomavatar-section">

                    <div class="nozoomavatar-title">
                        Général
                    </div>

                    <label class="nozoomavatar-option">
                        <span>
                            <b>Ne jamais redimensionner</b>
                            <small>
                                Force SillyTavern à conserver l'image
                                originale lors de l'import.
                            </small>
                        </span>

                        <input
                            type="checkbox"
                            id="nozoomavatar_never_resize"
                        >
                    </label>

                    <label class="nozoomavatar-option">
                        <span>
                            <b>Empêcher le crop</b>
                            <small>
                                Empêche l'avatar d'être agrandi pour
                                remplir artificiellement son cadre.
                            </small>
                        </span>

                        <input
                            type="checkbox"
                            id="nozoomavatar_prevent_crop"
                        >
                    </label>

                </div>

                <div class="nozoomavatar-section">

                    <div class="nozoomavatar-title">
                        Appliquer à
                    </div>

                    <label class="nozoomavatar-option">
                        <span>Personnages</span>
                        <input
                            type="checkbox"
                            id="nozoomavatar_characters"
                        >
                    </label>

                    <label class="nozoomavatar-option">
                        <span>Personas</span>
                        <input
                            type="checkbox"
                            id="nozoomavatar_personas"
                        >
                    </label>

                    <label class="nozoomavatar-option">
                        <span>Groupes</span>
                        <input
                            type="checkbox"
                            id="nozoomavatar_groups"
                        >
                    </label>

                </div>

                <div class="nozoomavatar-status"
                     id="nozoomavatar_status">
                    NoZoomAvatar actif
                </div>

            </div>
        `;

        container.appendChild(panel);

        const bind = (id, key) => {
            const element = document.querySelector(id);

            if (!element) return;

            element.checked = !!settings[key];

            element.addEventListener('change', () => {
                settings[key] = element.checked;

                saveSettings();
                applySettings();
                updateStatus();
            });
        };

        bind('#nozoomavatar_enabled', 'enabled');
        bind('#nozoomavatar_never_resize', 'neverResize');
        bind('#nozoomavatar_prevent_crop', 'preventCrop');
        bind('#nozoomavatar_characters', 'characters');
        bind('#nozoomavatar_personas', 'personas');
        bind('#nozoomavatar_groups', 'groups');

        updateStatus();
    }

    function updateStatus() {
        const status =
            document.querySelector('#nozoomavatar_status');

        if (!status || !settings) {
            return;
        }

        if (!settings.enabled) {
            status.textContent = 'NoZoomAvatar désactivé';
            status.classList.add('disabled');
        } else {
            status.textContent = 'NoZoomAvatar actif';
            status.classList.remove('disabled');
        }
    }

    async function init() {
        loadSettings();
        applySettings();

        await createSettingsPanel();

        /*
         * SillyTavern construit certaines parties de son interface
         * après le chargement de l'extension.
         */
        const observer = new MutationObserver(() => {
            applySettings();

            if (!document.querySelector('#nozoomavatar_settings')) {
                createSettingsPanel();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[NoZoomAvatar] Loaded.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();