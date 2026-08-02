// ==========================================
// DOM ELEMENTS
// ==========================================

const monthYear = document.getElementById("monthYear");
const calendarGrid = document.getElementById("calendarGrid");

const selectedDate = document.getElementById("selectedDate");
const selectedFullDate = document.getElementById("selectedFullDate");

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

let editingEventId = null;

// ==========================================
// DATE VARIABLES
// ==========================================

const today = new Date();

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDay = today.getDate();

const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

// ==========================================
// CALENDAR
// ==========================================

function renderCalendar(){

    calendarGrid.innerHTML = "";

    monthYear.textContent =
        `${months[currentMonth]} ${currentYear}`;

    const firstDay =
        new Date(currentYear,currentMonth,1).getDay();

    const totalDays =
        new Date(currentYear,currentMonth+1,0).getDate();

    calendarGrid.style.opacity = "0";

    calendarGrid.style.transform = "translateY(12px)";

    // Empty Cells

    for(let i=0;i<firstDay;i++){

        const empty=document.createElement("div");

        empty.className="day empty";

        calendarGrid.appendChild(empty);

    }

    // Days

    for(let day=1;day<=totalDays;day++){

        const tile=document.createElement("div");

        tile.className="day";

        tile.textContent=day;

        // Check if this day has a birthday

        const birthdays = getBirthdays();

        const hasBirthday = birthdays.some(birthday =>

            birthday.month === currentMonth + 1 &&
            birthday.day === day

        );

         if(hasBirthday){

                const badge = document.createElement("div");

                badge.className = "birthday-dot";

                badge.textContent = "🎂";

                tile.appendChild(badge);

        }

        // Event Check

            const events =
                JSON.parse(localStorage.getItem("daylightEvents")) || [];

            const dayEvents = events.filter(event => {

                const eventDate = new Date(event.date);

                return (

                    eventDate.getFullYear() === currentYear &&
                    eventDate.getMonth() === currentMonth &&
                    eventDate.getDate() === day

                );

            });

            if(dayEvents.length){

                const indicatorContainer =
                    document.createElement("div");

                indicatorContainer.className =
                    "event-indicators";

                dayEvents.forEach(()=>{

                    const dot =
                        document.createElement("span");

                    dot.className="event-pill";

                    indicatorContainer.appendChild(dot);

                });

                tile.appendChild(indicatorContainer);

            }

        if(
            day===today.getDate() &&
            currentMonth===today.getMonth() &&
            currentYear===today.getFullYear()
        ){

            tile.classList.add("today");

        }

        tile.addEventListener("click",()=>{

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

renderCalendar();

// ==========================================
// SELECT DATE
// ==========================================

function selectDate(day){

    selectedDay = day;

    const date = new Date(currentYear,currentMonth,day);

    selectedDate.textContent = day;

    selectedFullDate.textContent =
        date.toLocaleDateString("en-US",{

            weekday:"long",
            month:"long",
            day:"numeric",
            year:"numeric"

        });

    loadEvents();

}

// ==========================================
// LOAD EVENTS
// ==========================================

function loadEvents(){

    const eventList = document.querySelector(".event-list");

    const events =
        JSON.parse(localStorage.getItem("daylightEvents")) || [];

    const birthdays = getBirthdays();

    const selectedDateKey =
        `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`;

    const todayEvents = events.filter(event =>
        event.date === selectedDateKey
    );

    const todayBirthdays = birthdays.filter(birthday =>
        birthday.month === currentMonth + 1 &&
        birthday.day === selectedDay
    );

    eventList.innerHTML = "";

    // Birthdays First

    todayBirthdays.forEach(birthday => {

        eventList.innerHTML += `

            <div class="event-card birthday-card">

                <div class="event-icon">🎂</div>

                <div class="event-content">

                    <strong>${birthday.name}</strong>

                    <p>Birthday</p>

                </div>

            </div>

        `;

    });

    // Events

     todayEvents.forEach(event => {

         eventList.innerHTML += `

            <div class="event-card">

                <div class="event-header">

                    <div class="event-title">

                        <span class="event-icon">📅</span>

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

    if(
        todayBirthdays.length===0 &&
        todayEvents.length===0
    ){

        eventList.innerHTML = `

            <p class="empty-events">

                Nothing planned for this day.

            </p>

        `;

    }

}

// ==========================================
// MODAL
// ==========================================

addEventBtn.addEventListener("click",()=>{

    editingEventId = null;

    eventTitle.value = "";

    eventTime.value = "";

    eventCategory.value = "Personal";

    eventNotes.value = "";

    eventModal.classList.remove("hidden");

    modalTitle.textContent = "Add Event";

    saveEventText.textContent = "Save Event";

});

cancelEvent.addEventListener("click",()=>{

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

saveEvent.addEventListener("click",()=>{

    if(eventTitle.value.trim()===""){

        alert("Please enter an event title.");

        return;

    }

    const events =
        JSON.parse(localStorage.getItem("daylightEvents")) || [];

    const event={

        id:Date.now(),

        date:
        `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`,

        title:eventTitle.value,

        time:eventTime.value,

        category:eventCategory.value,

        notes:eventNotes.value

    };

    if(editingEventId){

    const index = events.findIndex(
        event => event.id === editingEventId
    );

    events[index] = {

        ...events[index],

        title: eventTitle.value,

        time: eventTime.value,

        category: eventCategory.value,

        notes: eventNotes.value

    };

    editingEventId = null;

}else{

    events.push(event);

}

    localStorage.setItem(

        "daylightEvents",

        JSON.stringify(events)

    );

    eventTitle.value = "";

    eventTime.value = "";

    eventCategory.value = "Personal";

    eventNotes.value = "";

    eventModal.classList.add("hidden");

    loadEvents();

    renderCalendar();

    loadEvents();

    eventModal.classList.add("hidden");

    eventTitle.value="";
    eventTime.value="";
    eventCategory.selectedIndex=0;
    eventNotes.value="";

});

// ==========================================
// DELETE EVENT
// ==========================================

function deleteEvent(id){

    const confirmDelete = confirm(
        "Delete this event?"
    );

    if(!confirmDelete) return;

    let events =
        JSON.parse(localStorage.getItem("daylightEvents")) || [];

    events = events.filter(event => event.id !== id);

    localStorage.setItem(
        "daylightEvents",
        JSON.stringify(events)
    );

    loadEvents();

    renderCalendar();

}

// ==========================================
// EDIT EVENT
// ==========================================

function editEvent(id){

    const events =
        JSON.parse(localStorage.getItem("daylightEvents")) || [];

    const event =
        events.find(e => e.id === id);

    if(!event) return;

    editingEventId = id;

    eventTitle.value = event.title;

    eventTime.value = event.time;

    eventCategory.value = event.category;

    eventNotes.value = event.notes;

    modalTitle.textContent = "Edit Event";
    saveEventText.textContent = "Update Event";

    eventModal.classList.remove("hidden");

}

// ==========================================
// MONTH NAVIGATION
// ==========================================

document.getElementById("prevMonth").addEventListener("click", () => {

    currentMonth--;

    if(currentMonth < 0){

        currentMonth = 11;

        currentYear--;

    }

    renderCalendar();

});

document.getElementById("nextMonth").addEventListener("click", () => {

    currentMonth++;

    if(currentMonth > 11){

        currentMonth = 0;

        currentYear++;

    }

    renderCalendar();

});