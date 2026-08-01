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
const saveBirthday = document.getElementById("saveBirthday");

const eventTitle = document.getElementById("eventTitle");
const eventTime = document.getElementById("eventTime");
const eventCategory = document.getElementById("eventCategory");
const eventNotes = document.getElementById("eventNotes");

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

                    <small class="event-type">Birthday</small>

                    <strong>${birthday.name}</strong>

                    <p>${birthday.notes || "No notes added"}</p>

                </div>

            </div>

        `;

    });

    // Events

    todayEvents.forEach(event => {

        eventList.innerHTML += `

            <div class="event-card">

                <div class="event-icon">📅</div>

                <div class="event-content">

                    <strong>${event.title}</strong>

                    <p>${event.time || "All Day"}</p>

                    <small>${event.category}</small>

                </div>

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

    eventModal.classList.remove("hidden");

});

cancelEvent.addEventListener("click",()=>{

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

    events.push(event);

    localStorage.setItem(

        "daylightEvents",

        JSON.stringify(events)

    );

    loadEvents();

    eventModal.classList.add("hidden");

    eventTitle.value="";
    eventTime.value="";
    eventCategory.selectedIndex=0;
    eventNotes.value="";

});

saveBirthday.addEventListener("click",()=>{

    if(eventTitle.value.trim()===""){

        alert("Please enter a name.");

        return;

    }

    const birthdays = getBirthdays();

    birthdays.push({

        id:Date.now(),

        name:eventTitle.value,

        month:currentMonth + 1,

        day:selectedDay,

        notes:eventNotes.value

    });

    saveBirthdays(birthdays);

    eventModal.classList.add("hidden");

    eventTitle.value="";
    eventTime.value="";
    eventCategory.selectedIndex=0;
    eventNotes.value="";

    alert("Birthday saved!");

});