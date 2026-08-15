// ==========================================
// DAYLIGHT CALENDAR
// ==========================================

"use strict";

// ==========================================
// DOM ELEMENTS
// ==========================================

// Calendar

const monthYear = document.getElementById("monthYear");
const calendarGrid = document.getElementById("calendarGrid");

// Sidebar

const selectedDate = document.getElementById("selectedDate");
const selectedFullDate = document.getElementById("selectedFullDate");

// Event Modal

const eventModal = document.getElementById("eventModal");
const addEventBtn = document.getElementById("addEventBtn");
const cancelEvent = document.getElementById("cancelEvent");

const saveEvent = document.getElementById("saveEvent");

const modalTitle = document.getElementById("modalTitle");
const saveEventText = document.getElementById("saveEventText");

const eventTitle = document.getElementById("eventTitle");
const eventTime = document.getElementById("eventTime");
const eventCategory = document.getElementById("eventCategory");
const eventNotes = document.getElementById("eventNotes");

// Birthday Manager

const birthdaysBtn = document.getElementById("birthdaysBtn");

const birthdayManagerModal =
    document.getElementById("birthdayManagerModal");

const closeBirthdayManager =
    document.getElementById("closeBirthdayManager");

const openBirthdayForm =
    document.getElementById("openBirthdayForm");

const birthdayFormModal =
    document.getElementById("birthdayFormModal");

const cancelBirthday =
    document.getElementById("cancelBirthday");

const saveBirthday =
    document.getElementById("saveBirthday");

const birthdayName =
    document.getElementById("birthdayName");

const birthdayDate =
    document.getElementById("birthdayDate");

// ==========================================
// APPLICATION STATE
// ==========================================

const today = new Date();

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDay = today.getDate();

let editingEventId = null;
let editingBirthdayId = null;

/* ==========================================
   CENTRALIZED STORAGE
========================================== */

const CALENDAR_SECTION = "calendar";


function getCalendarEvents() {

    const data =
        getDaylightSection(
            CALENDAR_SECTION
        );

    return Array.isArray(data?.events)
        ? data.events
        : [];

}


function saveCalendarEvents(events) {

    saveDaylightSection(
        CALENDAR_SECTION,
        {
            events
        }
    );

}


function loadCalendarEvents() {

    const centralized =
        getCalendarEvents();

    const legacy =
        localStorage.getItem(
            "daylightEvents"
        );


    /*
       Migrate existing Calendar events
       the first time centralized storage
       is still empty.
    */

    if (
        centralized.length === 0 &&
        legacy
    ) {

        try {

            const migrated =
                JSON.parse(
                    legacy
                );

            if (
                Array.isArray(
                    migrated
                )
            ) {

                saveCalendarEvents(
                    migrated
                );

                return migrated;

            }

        } catch (error) {

            console.error(
                "Unable to migrate legacy Calendar events.",
                error
            );

        }

    }


    return centralized;

}

function getPlannerPlans() {

    const plannerData =
        getDaylightSection(
            "planner"
        );


    const plans =
        Array.isArray(
            plannerData?.plans
        )
            ? plannerData.plans
            : [];


    return plans.map(
        plan => ({

            ...plan,

            showInCalendar:
                plan.showInCalendar === true

        })
    );

}

// Month Names

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// ==========================================
// CALENDAR ENGINE
// ==========================================

function renderCalendar() {

    calendarGrid.innerHTML = "";

    monthYear.textContent =
        `${months[currentMonth]} ${currentYear}`;

    const firstDay =
        new Date(currentYear, currentMonth, 1).getDay();

    const totalDays =
        new Date(currentYear, currentMonth + 1, 0).getDate();

    calendarGrid.style.opacity = "0";
    calendarGrid.style.transform = "translateY(12px)";

    // Empty Cells

    for (let i = 0; i < firstDay; i++) {

        const empty =
            document.createElement("div");

        empty.className = "day empty";

        calendarGrid.appendChild(empty);

    }

    // Calendar Days

    for (let day = 1; day <= totalDays; day++) {

        const tile =
            document.createElement("div");

        tile.className = "day";
        tile.textContent = day;

        // Birthday Indicator

        const birthdays = getBirthdays();

        const hasBirthday = birthdays.some(birthday => {

            if (birthday.date) {

                const birthDate =
                    new Date(birthday.date);

                return (

                    birthDate.getMonth() === currentMonth &&
                    birthDate.getDate() === day

                );

            }

            return (

                birthday.month === currentMonth + 1 &&
                birthday.day === day

            );

        });

        if (hasBirthday) {

            const badge =
                document.createElement("div");

            badge.className = "birthday-dot";
            badge.textContent = "🎂";

            tile.appendChild(badge);

        }

        // Event Indicators

        const events =
            loadCalendarEvents();

        const dayEvents = events.filter(event => {

            const eventDate =
                new Date(event.date);

            return (

                eventDate.getFullYear() === currentYear &&
                eventDate.getMonth() === currentMonth &&
                eventDate.getDate() === day

            );

        });

        if (dayEvents.length) {

            const indicatorContainer =
                document.createElement("div");

            indicatorContainer.className =
                "event-indicators";

            dayEvents.forEach(() => {

                const dot =
                    document.createElement("span");

                dot.className = "event-pill";

                indicatorContainer.appendChild(dot);

            });

            tile.appendChild(indicatorContainer);

        }

        if (

            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()

        ) {

            tile.classList.add("today");

        }

        tile.addEventListener("click", () => {

            selectDate(day);

        });

        calendarGrid.appendChild(tile);

    }

    selectDate(selectedDay);

    setTimeout(() => {

        calendarGrid.style.opacity = "1";
        calendarGrid.style.transform = "translateY(0)";

    }, 100);

}
// ==========================================
// SELECT DATE
// ==========================================

function selectDate(day) {

    selectedDay = day;

    const date =
        new Date(currentYear, currentMonth, day);

    selectedDate.textContent = day;

    selectedFullDate.textContent =
        date.toLocaleDateString("en-US", {

            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"

        });

    loadEvents();

}

// ==========================================
// LOAD EVENTS
// ==========================================

function loadEvents() {

    const eventList =
        document.querySelector(".event-list");

    const events =
      loadCalendarEvents();

    const birthdays =
        getBirthdays();
    
    const plannerPlans = getPlannerPlans();

    const selectedDateKey =
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

    const todayEvents =
        events.filter(event =>
            event.date === selectedDateKey
        );

    const todayPlans =
    plannerPlans.filter(plan =>
        plan.date === selectedDateKey &&
        plan.showInCalendar === true
    );

    const todayBirthdays =
        birthdays.filter(birthday => {

            if (birthday.date) {

                const birthDate =
                    new Date(birthday.date);

                return (

                    birthDate.getMonth() === currentMonth &&
                    birthDate.getDate() === selectedDay

                );

            }

            return (

                birthday.month === currentMonth + 1 &&
                birthday.day === selectedDay

            );

        });

    eventList.innerHTML = "";

    // ==========================================
    // BIRTHDAY CARDS
    // ==========================================

    todayBirthdays.forEach(birthday => {

        eventList.innerHTML += `

            <div class="event-card birthday-card">

                <div class="event-icon">

                    🎂

                </div>

                <div class="event-content">

                    <strong>${birthday.name}</strong>

                    <p>Birthday</p>

                </div>

            </div>

        `;

    });

    // ==========================================
    // PLANNER CARDS
    // ==========================================

    todayPlans.forEach(plan => {

        eventList.innerHTML += `

            <div class="event-card planner-card">

                <div class="event-header">

                    <div class="event-title">

                        <span class="event-icon">
                            🌅
                        </span>

                        <strong>${plan.title}</strong>

                    </div>

                </div>

                <p class="event-meta">
                    Planner
                </p>

                ${
                    plan.goal
                    ? `<p class="planner-goal">${plan.goal}</p>`
                    : ""
                }

            </div>

        `;

    });

    // ==========================================
    // EVENT CARDS
    // ==========================================

    todayEvents.forEach(event => {

        eventList.innerHTML += `

            <div class="event-card">

                <div class="event-header">

                    <div class="event-title">

                        <span class="event-icon">

                            📅

                        </span>

                        <strong>${event.title}</strong>

                    </div>

                    <div class="event-actions">

                        <button
                            class="edit-event"
                            onclick="editEvent(${event.id})">

                            ✏️

                        </button>

                        <button
                            class="delete-event"
                            onclick="deleteEvent(${event.id})">

                            🗑️

                        </button>

                    </div>

                </div>

                <p class="event-meta">

                    ${event.time || "All Day"} • ${event.category}

                </p>

            </div>

        `;

    });

    // ==========================================
    // EMPTY STATE
    // ==========================================

    if (

        todayBirthdays.length === 0 &&
        todayEvents.length === 0 &&
        todayPlans.length === 0

    ) 

        eventList.innerHTML = `

            <p class="empty-events">

                Nothing planned for this day.

            </p>

        `;

    

}
// ==========================================
// BIRTHDAY FUNCTIONS
// ==========================================

function renderBirthdays() {

    const birthdayList =
        document.querySelector(".birthday-list");

     const birthdays = getBirthdays().sort((a, b) => {

        const today = new Date();

        const currentYear = today.getFullYear();

        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        dateA.setFullYear(currentYear);
        dateB.setFullYear(currentYear);

        if (dateA < today) {

            dateA.setFullYear(currentYear + 1);

        }

        if (dateB < today) {

            dateB.setFullYear(currentYear + 1);

        }

        return dateA - dateB;

    });

    if (birthdays.length === 0) {

        birthdayList.innerHTML = `

            <p class="empty-events">

                No birthdays yet.

            </p>

        `;

        return;

    }

    birthdayList.innerHTML = birthdays.map(birthday => `

        <div class="birthday-card">

            <div class="birthday-info">

                <strong>🎂 ${birthday.name}</strong>

                <br>

               <small>

                ${new Date(birthday.date).toLocaleDateString("en-US", {

                    month: "long",
                    day: "numeric"

                })}

                </small>

            </div>

            <div class="birthday-actions">

                <button
                    class="edit-birthday"
                    onclick="editBirthday('${birthday.id}')">

                    ✏️

                </button>

                <button
                    class="delete-birthday"
                    onclick="deleteBirthday('${birthday.id}')">

                    🗑️

                </button>

            </div>

        </div>

    `).join("");

}

// ==========================================
// EDIT BIRTHDAY
// ==========================================

function editBirthday(id) {

    const birthdays =getBirthdays();

    const birthday = birthdays.find(birthday => birthday.id === id);

    if (!birthday) return;

    editingBirthdayId = id;

    birthdayName.value = birthday.name;
    birthdayDate.value = birthday.date;

    birthdayManagerModal.classList.add("hidden");
    birthdayFormModal.classList.remove("hidden");

}

// ==========================================
// DELETE BIRTHDAY
// ==========================================

function deleteBirthday(id) {

    const confirmDelete =
        confirm("Delete this birthday?");

    if (!confirmDelete) return;

    let birthdays =
        getBirthdays();

    birthdays =
        birthdays.filter(
            birthday => birthday.id !== id
        );

    saveBirthdays(birthdays);

    renderBirthdays();
    renderCalendar();
    loadEvents();

}

// ==========================================
// EVENT FUNCTIONS
// ==========================================

// ==========================================
// DELETE EVENT
// ==========================================

function deleteEvent(id){

    const confirmDelete =
        confirm("Delete this event?");

    if(!confirmDelete) return;

    let events =
        loadCalendarEvents();

    events =
        events.filter(
            event => event.id !== id
        );

     saveCalendarEvents(
        events
    );

    loadEvents();
    renderCalendar();

}

// ==========================================
// EDIT EVENT
// ==========================================

function editEvent(id){

    const events =
       loadCalendarEvents();

    const event =
        events.find(
            event => event.id === id
        );

    if(!event) return;

    editingEventId = id;

    eventTitle.value = event.title;
    eventTime.value = event.time;
    eventCategory.value = event.category;
    eventNotes.value = event.notes;

    modalTitle.textContent =
        "Edit Event";

    saveEventText.textContent =
        "Update Event";

    eventModal.classList.remove("hidden");

}

// ==========================================
// MODAL FUNCTIONS
// ==========================================

// Open Event Modal

addEventBtn.addEventListener("click", () => {

    editingEventId = null;

    eventTitle.value = "";
    eventTime.value = "";
    eventCategory.value = "Personal";
    eventNotes.value = "";

    modalTitle.textContent = "Add Event";
    saveEventText.textContent = "Save Event";

    eventModal.classList.remove("hidden");

});

// Close Event Modal

cancelEvent.addEventListener("click", () => {

    editingEventId = null;

    eventTitle.value = "";
    eventTime.value = "";
    eventCategory.value = "Personal";
    eventNotes.value = "";

    eventModal.classList.add("hidden");

});

// ==========================================
// SAVE EVENT
// ==========================================

saveEvent.addEventListener("click", () => {

    if (eventTitle.value.trim() === "") {

        alert("Please enter an event title.");
        return;

    }

    const events =
        loadCalendarEvents();

    const event = {

        id: editingEventId || Date.now(),

        date:
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`,

        title: eventTitle.value.trim(),
        time: eventTime.value,
        category: eventCategory.value,
        notes: eventNotes.value

    };

    if (editingEventId) {

        const index =
            events.findIndex(
                event => event.id === editingEventId
            );

        if (index !== -1) {

            events[index] = event;

        }

    } else {

        events.push(event);

    }

    saveCalendarEvents(
        events
    );

    editingEventId = null;

    eventTitle.value = "";
    eventTime.value = "";
    eventCategory.value = "Personal";
    eventNotes.value = "";

    modalTitle.textContent = "Add Event";
    saveEventText.textContent = "Save Event";

    eventModal.classList.add("hidden");

    renderCalendar();
    loadEvents();

});

// ==========================================
// MONTH NAVIGATION
// ==========================================

document.getElementById("prevMonth")
.addEventListener("click", () => {

    currentMonth--;

    if (currentMonth < 0) {

        currentMonth = 11;
        currentYear--;

    }

    renderCalendar();

});

document.getElementById("nextMonth")
.addEventListener("click", () => {

    currentMonth++;

    if (currentMonth > 11) {

        currentMonth = 0;
        currentYear++;

    }

    renderCalendar();

});

// ==========================================
// BIRTHDAY LISTENERS
// ==========================================

birthdaysBtn.addEventListener("click", () => {

    renderBirthdays();

    birthdayManagerModal.classList.remove("hidden");

});

closeBirthdayManager.addEventListener("click", () => {

    birthdayManagerModal.classList.add("hidden");

});

openBirthdayForm.addEventListener("click", () => {

    editingBirthdayId = null;

    birthdayName.value = "";
    birthdayDate.value = "";

    birthdayManagerModal.classList.add("hidden");
    birthdayFormModal.classList.remove("hidden");

});

cancelBirthday.addEventListener("click", () => {

    birthdayName.value = "";
    birthdayDate.value = "";

    birthdayFormModal.classList.add("hidden");
    birthdayManagerModal.classList.remove("hidden");

});

saveBirthday.addEventListener("click", () => {

    if (
        birthdayName.value.trim() === "" ||
        birthdayDate.value === ""
    ) {

        alert("Please complete the birthday information.");
        return;

    }

    const birthdays = getBirthdays();

    if (editingBirthdayId) {

        const index = birthdays.findIndex(
            birthday => birthday.id === editingBirthdayId
        );

        if (index !== -1) {

            birthdays[index] = {

                ...birthdays[index],

                name: birthdayName.value.trim(),
                date: birthdayDate.value

            };

        }

        editingBirthdayId = null;

    } else {

        birthdays.push({

            id: crypto.randomUUID(),

            name: birthdayName.value.trim(),

            date: birthdayDate.value

        });

    }

    saveBirthdays(birthdays);

    birthdayName.value = "";
    birthdayDate.value = "";

    birthdayFormModal.classList.add("hidden");
    birthdayManagerModal.classList.remove("hidden");

    renderBirthdays();
    renderCalendar();
    loadEvents();

});

// ==========================================
// INITIALIZE
// ==========================================

renderCalendar();
renderBirthdays();
loadEvents();



