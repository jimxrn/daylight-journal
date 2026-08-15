/* ==========================================
   DAYLIGHT — SETTINGS
========================================== */

"use strict";


/* ==========================================
   ELEMENTS
========================================== */

const nameInput =
    document.getElementById(
        "settings-name"
    );

const exportButton =
    document.getElementById(
        "export-data"
    );

const importButton =
    document.getElementById(
        "import-data"
    );

const importFile =
    document.getElementById(
        "import-file"
    );

const resetButton =
    document.getElementById(
        "reset-data"
    );

const saveSettingsButton =
    document.getElementById(
        "save-settings"
    );

const settingsSaveStatus =
    document.getElementById(
        "settings-save-status"
    );


/* ==========================================
   LOAD SETTINGS
========================================== */

function loadSettings() {

    const settings =
        getDaylightSection(
            "settings"
        );

    if (
        settings &&
        settings.name
    ) {

        nameInput.value =
            settings.name;

    }

}


/* ==========================================
   SAVE SETTINGS
========================================== */

function saveSettings() {

    saveDaylightSection(
        "settings",
        {
            name:
                nameInput.value.trim()
        }
    );

}


/* ==========================================
   EXPORT
========================================== */

function exportDaylightData() {

    const data =
        getDaylightData();

    const json =
        JSON.stringify(
            data,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    const date =
        new Date()
            .toISOString()
            .split("T")[0];

    link.href =
        url;

    link.download =
        `daylight-backup-${date}.json`;

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
        url
    );

}


/* ==========================================
   IMPORT
========================================== */

function importDaylightData(
    file
) {

    const reader =
        new FileReader();

    reader.onload =
        event => {

            try {

                const imported =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !imported ||
                    typeof imported !==
                        "object"
                ) {

                    throw new Error(
                        "Invalid Daylight backup."
                    );

                }


                localStorage.setItem(

                    DAYLIGHT_STORAGE_KEY,

                    JSON.stringify(
                        imported
                    )

                );


                window.location.reload();

            }

            catch (error) {

                console.error(
                    "Unable to restore Daylight data.",
                    error
                );

                alert(
                    "That file is not a valid Daylight backup."
                );

            }

        };


    reader.readAsText(
        file
    );

}


/* ==========================================
   RESET
========================================== */

function resetAllDaylightData() {

    const confirmed =
        window.confirm(
            "This will remove all Daylight data from this device. Continue?"
        );

    if (!confirmed) {
        return;
    }


    resetDaylightData();

    window.location.reload();

}


/* ==========================================
   EVENTS
========================================== */
saveSettingsButton.addEventListener(
    "click",
    saveSettings
);


exportButton.addEventListener(
    "click",
    exportDaylightData
);


importButton.addEventListener(
    "click",
    () => {

        importFile.click();

    }
);


importFile.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        importDaylightData(
            file
        );

    }
);


resetButton.addEventListener(
    "click",
    resetAllDaylightData
);
exportButton.addEventListener(
    "click",
    exportDaylightData
);


importButton.addEventListener(
    "click",
    () => {

        importFile.click();

    }
);


importFile.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        importDaylightData(
            file
        );

    }
);


resetButton.addEventListener(
    "click",
    resetAllDaylightData
);



/* ==========================================
   INITIALIZE
========================================== */

loadSettings();