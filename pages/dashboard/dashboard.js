/* ==========================================
   DAYLIGHT — DASHBOARD
========================================== */


/* ==========================================
   DATE HELPERS
========================================== */

function getDashboardDateKey(date = new Date()) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* ==========================================
   FULL DATE
========================================== */

function renderDashboardDate() {

    const dateElement =
        document.getElementById(
            "dashboard-full-date"
        );

    if (!dateElement) {
        return;
    }


    const today =
        new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

}


/* ==========================================
   PLANNER DATA
========================================== */

function getDashboardPlannerData() {

    let todayItems = [];

    let plans = [];


    /*
       Quick-capture tasks
       from the Planner.
    */

    const savedToday =
        localStorage.getItem(
            "daylightToday"
        );


    if (savedToday) {

        try {

            todayItems =
                JSON.parse(savedToday);

        } catch (error) {

            console.error(
                "Unable to read today's Planner tasks.",
                error
            );

        }

    }


    /*
       Dated plans
       from the Planner.
    */

    const savedPlanner =
        localStorage.getItem(
            "daylightPlanner"
        );


    if (savedPlanner) {

        try {

            plans =
                JSON.parse(savedPlanner);

        } catch (error) {

            console.error(
                "Unable to read Planner plans.",
                error
            );

        }

    }


    const todayKey =
        getDashboardDateKey();


    const todaysPlans =
        plans.filter(
            plan =>
                plan.date === todayKey
        );


    return {
        todayItems,
        todaysPlans
    };

}


/* ==========================================
   PLANNER WIDGET
========================================== */

function renderDashboardPlanner() {

    const container =
        document.getElementById(
            "dashboard-planner-content"
        );


    if (!container) {
        return;
    }


    const {
        todayItems,
        todaysPlans
    } =
        getDashboardPlannerData();


    /*
       Combine today's quick tasks
       and today's dated plans.
    */

    const items = [];


    todayItems.forEach(
        item => {

            items.push({
                type: "task",
                text: item.text,
                completed: item.completed
            });

        }
    );


    todaysPlans.forEach(
        plan => {

            items.push({
                type: "plan",
                text: plan.title,
                completed: false
            });

        }
    );


    /*
       Nothing planned.
    */

    if (items.length === 0) {

        container.innerHTML = `
            <div class="dashboard-planner-empty">

                <p class="dashboard-empty-state">
                    Nothing planned for today yet.
                </p>

                <span>
                    Add something in Planner.
                </span>

            </div>
        `;

        return;

    }


    /*
       Keep the Dashboard compact.
       Show only the first 4 items.
    */

    const visibleItems =
        items.slice(0, 4);


    container.innerHTML = `

        <div class="dashboard-plan-list">

            ${visibleItems.map(
                item => `

                    <div
                        class="
                            dashboard-plan-item
                            ${item.completed ? "is-completed" : ""}
                        "
                    >

                        <span class="dashboard-plan-check">

                            ${item.completed ? "✓" : "○"}

                        </span>


                        <span class="dashboard-plan-text">

                            ${escapeDashboardHTML(item.text)}

                        </span>

                    </div>

                `
            ).join("")}

        </div>


        ${
            items.length > 4
                ? `
                    <p class="dashboard-plan-more">
                        + ${items.length - 4} more
                    </p>
                `
                : ""
        }

    `;

}


/* ==========================================
   SAFE TEXT
========================================== */

function escapeDashboardHTML(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   JOURNAL WIDGET
========================================== */

function loadDashboardJournal() {

    const preview =
        document.querySelector(
            "#dashboard-journal-preview"
        );


    const status =
        document.querySelector(
            "#dashboard-journal-status"
        );


    if (!preview || !status) {
        return;
    }


    const raw =
        localStorage.getItem(
            "daylightJournalEntries"
        );


    let entries = {};


    if (raw) {

        try {

            entries =
                JSON.parse(raw);

        } catch (error) {

            console.error(
                "Unable to load Dashboard Journal data.",
                error
            );

            return;

        }

    }


    const todayKey =
        getDashboardDateKey();


    const entry =
        entries[todayKey];


    const thought =
        entry &&
        entry.thoughts
            ? entry.thoughts.trim()
            : "";


    if (!thought) {

        preview.innerHTML = `
            <p class="dashboard-empty-state">
                Nothing written today yet.
            </p>
        `;

        status.textContent =
            "No entry today";

        return;

    }


    const maxLength =
        180;


    const previewText =
        thought.length > maxLength

            ? thought
                .substring(0, maxLength)
                .trim() + "..."

            : thought;


    preview.textContent =
        `"${previewText}"`;


    status.textContent =
        "Entry saved today";

}


/* ==========================================
   OPEN JOURNAL
========================================== */

function openJournal() {

    window.location.href =
        "../journal/journal.html";

}


/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderDashboardDate();

        renderDashboardPlanner();

        renderDashboardCalendar();

        loadDashboardJournal();


        const openJournalButton =
            document.querySelector(
                "#open-journal"
            );


        if (openJournalButton) {

            openJournalButton.addEventListener(
                "click",
                openJournal
            );

        }

    }
);
/* ==========================================
   CALENDAR DATA
========================================== */

function getDashboardCalendarData() {

    const todayKey =
        getDashboardDateKey();


    let events = [];

    try {

        events =
            JSON.parse(
                localStorage.getItem("daylightEvents")
            ) || [];

    } catch (error) {

        console.error(
            "Unable to read Calendar events.",
            error
        );

    }


    const todayEvents =
        events
            .filter(event =>
                event.date === todayKey
            )
            .sort((a, b) => {

                /*
                   Events with a time come first.
                   All-day events come after.
                */

                if (!a.time && !b.time) {
                    return 0;
                }

                if (!a.time) {
                    return 1;
                }

                if (!b.time) {
                    return -1;
                }

                return a.time.localeCompare(
                    b.time
                );

            });


    /*
       Birthdays
       Use the existing Calendar birthday system.
    */

    let birthdays = [];

    if (
        typeof getBirthdays === "function"
    ) {

        try {

            birthdays =
                getBirthdays() || [];

        } catch (error) {

            console.error(
                "Unable to read birthdays.",
                error
            );

        }

    }


    const today =
        new Date();


    const todayBirthdays =
        birthdays.filter(
            birthday => {

                if (birthday.date) {

                    const birthDate =
                        new Date(
                            birthday.date
                        );


                    return (
                        birthDate.getMonth()
                            === today.getMonth()
                        &&
                        birthDate.getDate()
                            === today.getDate()
                    );

                }


                return (
                    birthday.month
                        === today.getMonth() + 1
                    &&
                    birthday.day
                        === today.getDate()
                );

            }
        );


    return {
        todayEvents,
        todayBirthdays
    };

}


/* ==========================================
   CALENDAR WIDGET
========================================== */

function renderDashboardCalendar() {

    const container =
        document.getElementById(
            "dashboard-calendar-content"
        );


    if (!container) {
        return;
    }


    const {
        todayEvents,
        todayBirthdays
    } =
        getDashboardCalendarData();


    const items = [];


    /*
       Birthdays first
    */

    todayBirthdays.forEach(
        birthday => {

            items.push({

                type: "birthday",

                title:
                    birthday.name,

                time:
                    "Birthday",

                category:
                    ""

            });

        }
    );


    /*
       Today's events
    */

    todayEvents.forEach(
        event => {

            items.push({

                type: "event",

                title:
                    event.title,

                time:
                    event.time || "All Day",

                category:
                    event.category || ""

            });

        }
    );


    /*
       Empty state
    */

    if (items.length === 0) {

        container.innerHTML = `

            <div class="dashboard-calendar-empty">

                <p class="dashboard-empty-state">
                    Nothing scheduled for today.
                </p>

                <span>
                    Your day is clear.
                </span>

            </div>

        `;

        return;

    }


    /*
       Show first 4 items.
    */

    const visibleItems =
        items.slice(0, 4);


    container.innerHTML = `

        <div class="dashboard-calendar-list">

            ${visibleItems.map(
                item => `

                    <div
                        class="
                            dashboard-calendar-item
                            ${item.type === "birthday"
                                ? "is-birthday"
                                : ""}
                        "
                    >

                        <span class="dashboard-calendar-icon">

                            ${
                                item.type === "birthday"
                                    ? "🎂"
                                    : "📅"
                            }

                        </span>


                        <div class="dashboard-calendar-info">

                            <strong>
                                ${escapeDashboardHTML(
                                    item.title
                                )}
                            </strong>


                            <span>

                            ${escapeDashboardHTML(item.time)}

                            </span>

                        </div>

                    </div>

                `
            ).join("")}

        </div>


        ${
            items.length > 4
                ? `
                    <p class="dashboard-calendar-more">
                        + ${items.length - 4} more
                    </p>
                `
                : ""
        }

    `;

}