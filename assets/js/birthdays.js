// ==========================================
// DAYLIGHT BIRTHDAY DATABASE
// ==========================================

// Loads every birthday saved in Daylight.

function getBirthdays(){

    return JSON.parse(

        localStorage.getItem("daylightBirthdays")

    ) || [];

}

// Saves the birthday list.

function saveBirthdays(data){

    localStorage.setItem(

        "daylightBirthdays",

        JSON.stringify(data)

    );

}