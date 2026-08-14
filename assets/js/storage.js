/* ==========================================
   DAYLIGHT — STORAGE
========================================== */

"use strict";


/* ==========================================
   STORAGE KEY
========================================== */

const DAYLIGHT_STORAGE_KEY =
    "daylightData";


/* ==========================================
   DEFAULT DATA
========================================== */

const DEFAULT_DAYLIGHT_DATA = {

    journal: {},

    planner: {},

    calendar: {},

    habits: {},

    memories: {},

    settings: {}

};


/* ==========================================
   GET ALL DATA
========================================== */

function getDaylightData() {

    const saved =
        localStorage.getItem(
            DAYLIGHT_STORAGE_KEY
        );


    if (!saved) {

        return structuredClone(
            DEFAULT_DAYLIGHT_DATA
        );

    }


    try {

        const parsed =
            JSON.parse(saved);


        return {

            ...structuredClone(
                DEFAULT_DAYLIGHT_DATA
            ),

            ...parsed

        };

    }


    catch (error) {

        console.error(
            "Unable to load Daylight data.",
            error
        );


        return structuredClone(
            DEFAULT_DAYLIGHT_DATA
        );

    }

}


/* ==========================================
   SAVE ALL DATA
========================================== */

function saveDaylightData(
    data
) {

    localStorage.setItem(

        DAYLIGHT_STORAGE_KEY,

        JSON.stringify(data)

    );

}


/* ==========================================
   GET SECTION
========================================== */

function getDaylightSection(
    section
) {

    const data =
        getDaylightData();


    return data[section];

}


/* ==========================================
   SAVE SECTION
========================================== */

function saveDaylightSection(
    section,
    value
) {

    const data =
        getDaylightData();


    data[section] =
        value;


    saveDaylightData(
        data
    );

}


/* ==========================================
   RESET ALL DATA
========================================== */

function resetDaylightData() {

    localStorage.removeItem(
        DAYLIGHT_STORAGE_KEY
    );

}
/* ==========================================
   MIGRATE LEGACY MEMORIES
========================================== */

function migrateLegacyMemories() {

    const legacy =
        localStorage.getItem(
            "daylightMemories"
        );

    if (!legacy) {
        return;
    }

    const data =
        getDaylightData();

    if (
        Object.keys(data.memories).length === 0
    ) {

        try {

            data.memories =
                JSON.parse(legacy);

            saveDaylightData(data);

        } catch (error) {

            console.error(
                "Unable to migrate Memories.",
                error
            );

        }

    }

}


/* ==========================================
   INITIALIZE STORAGE
========================================== */

migrateLegacyMemories();