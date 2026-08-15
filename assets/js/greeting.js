const greeting = document.getElementById("greeting");
const today = document.getElementById("today");

const now = new Date();

const hour = now.getHours();

let message = "Good Evening";

if (hour < 12) {

    message = "Good Morning";

}

else if (hour < 18) {

    message = "Good Afternoon";

}


/* ==========================================
   LOAD NAME FROM DAYLIGHT SETTINGS
========================================== */

let name = "Jim";

try {

    const settings =
        getDaylightSection("settings");

    if (
        settings &&
        settings.name
    ) {

        name =
            settings.name.trim() ||
            "Jim";

    }

}

catch (error) {

    console.error(
        "Unable to load Daylight settings.",
        error
    );

}


/* ==========================================
   RENDER GREETING
========================================== */

greeting.textContent =
    `${message}, ${name}.`;


/* ==========================================
   RENDER DATE
========================================== */

today.textContent =
    now.toLocaleDateString(
        "en-US",
        {

            weekday: "long",

            month: "long",

            day: "numeric"

        }
    );