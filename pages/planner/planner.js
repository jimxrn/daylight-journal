// ==========================================
// DOM REFERENCES
// ==========================================

let quickCaptureInput;

let quickCaptureBtn;

let todayList;

const allPlans = document.getElementById("allPlans");

const planWorkspace = document.getElementById("planWorkspace");

const planModal = document.getElementById("planModal");

const newPlanBtn = document.getElementById("newPlanBtn");
const cancelPlan = document.getElementById("cancelPlan");
const savePlan = document.getElementById("savePlan");

const planTitle = document.getElementById("planTitle");
const planDate = document.getElementById("planDate");
const planTime = document.getElementById("planTime");
const viewArchivedPlansBtn = document.getElementById("viewArchivedPlansBtn");
const archiveModal = document.getElementById("archiveModal");
const archiveList = document.getElementById("archiveList");
const closeArchive = document.getElementById("closeArchive");



// ==========================================
// APP STATE
// ==========================================

const PLANNER_SECTION = "planner";

let planner = [];

let todayItems = [];


// ==========================================
// STORAGE
// ==========================================

function getPlannerData() {

    const saved =
        getDaylightSection(
            PLANNER_SECTION
        );

    return {

        plans:
            Array.isArray(saved?.plans)
                ? saved.plans
                : [],

        todayItems:
            Array.isArray(saved?.todayItems)
                ? saved.todayItems
                : []

    };

}


function savePlannerData() {

    saveDaylightSection(

        PLANNER_SECTION,

        {

            plans: planner,

            todayItems: todayItems

        }

    );

}


function loadPlannerData() {

    const data =
        getPlannerData();


    /* ==========================================
       LEGACY MIGRATION
    ========================================== */

    const legacyPlanner =
        localStorage.getItem(
            "daylightPlanner"
        );

    const legacyToday =
        localStorage.getItem(
            "daylightToday"
        );


    /*
       If centralized Planner data is empty,
       recover existing legacy data.
    */

    if (
        data.plans.length === 0 &&
        legacyPlanner
    ) {

        try {

            data.plans =
                JSON.parse(
                    legacyPlanner
                );

        } catch (error) {

            console.error(
                "Unable to migrate legacy Planner plans.",
                error
            );

        }

    }


    if (
        data.todayItems.length === 0 &&
        legacyToday
    ) {

        try {

            data.todayItems =
                JSON.parse(
                    legacyToday
                );

        } catch (error) {

            console.error(
                "Unable to migrate legacy Today items.",
                error
            );

        }

    }


    /*
       Apply recovered data.
    */

    planner =
        data.plans;

    todayItems =
        data.todayItems;


    /*
       Save the recovered data
       into centralized Daylight storage.
    */

    savePlannerData();

}

// ==========================================
// MODAL
// ==========================================

function openModal(){

    planModal.classList.remove("hidden");

}

function closeModal(){

    planModal.classList.add("hidden");

    planTitle.value = "";

    planDate.value = "";
    planTime.value = "";

}


// ==========================================
// TODAY
// ==========================================

function addTodayItem(){

    const text = quickCaptureInput.value.trim();

    if(!text) return;

    todayItems.push({

        id: Date.now(),

        text,

        completed:false

    });

    savePlannerData();

    renderToday();

    quickCaptureInput.value = "";

    quickCaptureInput.focus();

}

function deleteTodayItem(id){

    todayItems = todayItems.filter(

        item=>item.id!==id

    );

    savePlannerData();

    renderToday();

}

function toggleTodayItem(id){

    const item = todayItems.find(

        item=>item.id===id

    );

    if(!item) return;

    item.completed = !item.completed;

    savePlannerData();

    renderToday();

}

// ==========================================
// PLANS
// ==========================================

function createPlan(){

    const title = planTitle.value.trim();
    const date = planDate.value;
    const time = planTime.value;

    if(!title){

        alert("Please enter a plan title.");

        return;

    }

    const plan = {

        id: Date.now(),
        title,
        date,
        time,
        goal: "",
        notes: "",
        checklist: [],
        showInCalendar: false

    };

    planner.push(plan);

   savePlannerData();

    renderPlanner();

    closeModal();

}

function formatPlanDate(date, time = "") {
    if (!date) return "No date";
    const d = new Date(`${date}T12:00:00`);
    const label = d.toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
    return time ? `${label} · ${formatPlanTime(time)}` : label;
}

function formatPlanTime(time) {
    if (!time) return "";
    const [h,m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h,m,0,0);
    return d.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit" });
}

function renderPlanner(){
    allPlans.innerHTML = "";
    const todayKey = getTodayKey();
    const todayPlans = planner.filter(plan => plan.date === todayKey);

    todayPlans.forEach(plan => {
        allPlans.innerHTML += `
            <div class="plan-card" onclick="openPlan(${plan.id})">
                <div class="plan-card-content">
                    <h3>${escapePlannerHTML(plan.title)}</h3>
                    <small>${formatPlanDate(plan.date, plan.time)}</small>
                </div>
                <button class="plan-options-btn" aria-label="Plan options" onclick="event.stopPropagation(); openPlanMenu(${plan.id})">⋯</button>
            </div>`;
    });

    if(todayPlans.length === 0){
        allPlans.innerHTML = `<div class="plans-empty"><p>Nothing planned for today.</p></div>`;
    }

    renderIncomingPlans();
}

function getTodayKey(){
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
}

function escapePlannerHTML(value = ""){
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function openArchive(){
    const todayKey = getTodayKey();
    const archived = planner
        .filter(plan => plan.date && plan.date < todayKey)
        .sort((a,b) => `${b.date}${b.time||""}`.localeCompare(`${a.date}${a.time||""}`));

    archiveList.innerHTML = archived.length ? archived.map(plan => `
        <button class="archive-item" type="button" onclick="closeArchiveModal(); openPlan(${plan.id})">
            <span class="archive-item-date">${formatPlanDate(plan.date, plan.time)}</span>
            <strong>${escapePlannerHTML(plan.title)}</strong>
            <span class="archive-item-arrow">→</span>
        </button>
    `).join("") : `<div class="archive-empty"><span>🌤</span><h3>No archived plans yet.</h3><p>Plans will appear here once their date has passed.</p></div>`;
    archiveModal.classList.remove("hidden");
}

function closeArchiveModal(){ archiveModal.classList.add("hidden"); }

function renderIncomingPlans(){

    const incomingPlansList =
        document.getElementById("incomingPlansList");

    const viewAllIncoming =
        document.getElementById("viewAllIncoming");

    if(!incomingPlansList) return;

    const today = new Date();

    const todayKey =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const incomingPlans = planner
        .filter(plan =>
            plan.date &&
            plan.date > todayKey
        )
        .sort((a, b) =>
            a.date.localeCompare(b.date)
        );

    const previewPlans =
        incomingPlans.slice(0, 3);

    incomingPlansList.innerHTML = "";

    if(previewPlans.length === 0){

        incomingPlansList.innerHTML = `

            <p class="incoming-empty">

                No upcoming plans.

            </p>

        `;

        viewAllIncoming.style.display = "none";

        return;

    }

    previewPlans.forEach(plan => {

        incomingPlansList.innerHTML += `

            <div
                class="incoming-plan-item"
                onclick="openPlan(${plan.id})">

                <div class="incoming-plan-info">

                    <strong>
                        ${plan.title}
                    </strong>

                    <small>
                        ${plan.date}
                    </small>

                </div>

                <span>
                    →
                </span>

            </div>

        `;

    });

    if(incomingPlans.length > 3){

        viewAllIncoming.style.display = "block";

    } else {

        viewAllIncoming.style.display = "none";

    }

}

function openPlanMenu(planId){

    const plan = planner.find(p => p.id === planId);

    if(!plan) return;

    const existing = document.getElementById("planActionMenu");

    if(existing){
        existing.remove();
    }

    const menu = document.createElement("div");

    menu.id = "planActionMenu";

    menu.innerHTML = `

        <div class="plan-menu-backdrop"></div>

        <div class="plan-action-menu">

            <div class="plan-menu-header">

                <div>
                    <span>PLAN OPTIONS</span>
                    <h3>${plan.title}</h3>
                </div>

                <button
                    class="plan-menu-close"
                    onclick="closePlanMenu()">

                    ×

                </button>

            </div>

            <button
                class="plan-action"
                onclick="closePlanMenu(); renamePlan(${planId})">

                <span>✎</span>

                <div>
                    <strong>Rename</strong>
                    <small>Change your plan name</small>
                </div>

            </button>

            <button
                class="plan-action"
                onclick="closePlanMenu(); duplicatePlan(${planId})">

                <span>＋</span>

                <div>
                    <strong>Duplicate</strong>
                    <small>Create a copy of this plan</small>
                </div>

            </button>

            <button
                class="plan-action plan-action-danger"
                onclick="closePlanMenu(); deletePlan(${planId})">

                <span>×</span>

                <div>
                    <strong>Delete</strong>
                    <small>Remove this plan</small>
                </div>

            </button>

        </div>

    `;   

    document.body.appendChild(menu);

}

function closePlanMenu(){

    const menu = document.getElementById("planActionMenu");

    if(menu){
        menu.remove();
    }

}

function normalizeEditorContent(value = ""){
    if (!value) return "";
    if (/<[a-z][\s\S]*>/i.test(value)) return value;
    return escapePlannerHTML(value).replace(/\n/g, "<br>");
}

function setupRichEditor(editor, plan, key){
    if(!editor) return;
    editor.addEventListener("input", () => {
        plan[key] = editor.innerHTML;
        savePlannerData();
    });
    const toolbar = editor.previousElementSibling;
    if(toolbar){
        toolbar.querySelectorAll("button[data-command]").forEach(button => {
            button.addEventListener("mousedown", event => event.preventDefault());
            button.addEventListener("click", () => {
                editor.focus();
                document.execCommand(button.dataset.command, false, null);
                plan[key] = editor.innerHTML;
                savePlannerData();
            });
        });
        toolbar.querySelector(`[data-save="${key}"]`)?.addEventListener("click", () => {
            plan[key] = editor.innerHTML;
            savePlannerData();
            const button = toolbar.querySelector(`[data-save="${key}"]`);
            const original = button.textContent;
            button.textContent = "Saved ✓";
            window.setTimeout(() => button.textContent = original, 1000);
        });
    }
}

function openPlan(id){

    console.log("Opening:", id);

    const plan = planner.find(

        p => p.id === id

    );

    if(!plan) return;

    planWorkspace.innerHTML = `
    
        <div class="plan-details">

            <button class="back-btn" onclick="renderHome()">

            ← Back

            </button>   

           <p class="plan-label">
                YOUR PLAN

            </p>    

            <h1 class="plan-title">

                ${plan.title}

            </h1>


            <p class="plan-date">

                ${plan.date || ""}
            </p>    

            <div class="calendar-toggle">

                <label>

                    <input
                        type="checkbox"
                        id="calendarToggle"
                        ${plan.showInCalendar ? "checked" : ""}
                        ${!plan.date ? "disabled" : ""}
                    >

                    <span>
                        Add this plan to Calendar
                    </span>

                </label>
                
                <small>

                    ${
                        plan.date
                        ? "Show this important plan on your calendar."
                        : "Add a date first to place this plan on Calendar."
                    }

                </small>

            </div>

            <hr>

            <div class="plan-section">

                <h3>🎯 Goal</h3>

                <p class="section-description">

                    What do you want to accomplish with this plan?

                </p>

                <div class="format-toolbar" role="toolbar" aria-label="Goal formatting">
                    <button type="button" data-command="bold" aria-label="Bold"><strong>B</strong></button>
                    <button type="button" data-command="italic" aria-label="Italic"><em>I</em></button>
                    <button type="button" data-command="underline" aria-label="Underline"><u>U</u></button>
                    <button type="button" data-command="insertUnorderedList" aria-label="Bulleted list">•</button>
                    <button type="button" class="editor-save-btn" data-save="goal">Save Goals</button>
                </div>
                <div id="goalEditor" class="rich-editor" contenteditable="true" role="textbox" aria-multiline="true">${normalizeEditorContent(plan.goal || "")}</div>

            </div>

            <div class="progress-section">

                <div class="progress-info">

                    <span>TODAY'S PROGRESS</span>

                    <span id="progressText">0 / 0</span>

                </div>  


                <div class="progress-bar">

                    <div
                        id="progressFill"
                        class="progress-fill">
                    </div>

                </div>

           </div>     
                    

            <div class="plan-section">

                <h3>✓ Checklist</h3>

                <p class="section-description">

                    Break your goal into smaller tasks.
                </p>

                <div class="checklist-input">

                    <input
                        id="checklistInput"
                        type="text"
                        placeholder="Add a checklist item">

                    <button id="addChecklistBtn">

                        Add
                    </button>

                </div>  

                <div id="checklistList"></div>

            </div>


            <div class="plan-section">

                <h3>📝 Notes</h3>

                <p class="section-description">

                    Capture ideas, reminders and progress.

                </p>

                <div class="format-toolbar" role="toolbar" aria-label="Notes formatting">
                    <button type="button" data-command="bold" aria-label="Bold"><strong>B</strong></button>
                    <button type="button" data-command="italic" aria-label="Italic"><em>I</em></button>
                    <button type="button" data-command="underline" aria-label="Underline"><u>U</u></button>
                    <button type="button" data-command="insertUnorderedList" aria-label="Bulleted list">•</button>
                    <button type="button" class="editor-save-btn" data-save="notes">Save Notes</button>
                </div>
                <div id="notesEditor" class="rich-editor" contenteditable="true" role="textbox" aria-multiline="true">${normalizeEditorContent(plan.notes || "")}</div>

            </div>

        </div> 
        

    `;

    const checklistInput = document.getElementById("checklistInput");
    const addChecklistBtn = document.getElementById("addChecklistBtn");

    addChecklistBtn.addEventListener("click", () => {

        addChecklistItem(plan.id);

    });    

    checklistInput.addEventListener("keydown", (e) => {

            if(e.key === "Enter"){

            addChecklistItem(plan.id);

        }

    });

        if(!plan.checklist){

        plan.checklist = [];

    }
    renderChecklist(plan);

    updateProgress(plan);

    const goalEditor = document.getElementById("goalEditor");
    const notesEditor = document.getElementById("notesEditor");

    setupRichEditor(goalEditor, plan, "goal");
    setupRichEditor(notesEditor, plan, "notes");

    const calendarToggle =
    document.getElementById("calendarToggle");

    if(calendarToggle){

    calendarToggle.addEventListener(
        "change",
        () => {

            plan.showInCalendar =
                calendarToggle.checked;

            savePlannerData();

        }
    );

}

}
function deletePlan(planId){

    const plan = planner.find(p => p.id === planId);

    if(!plan) return;

    const confirmed = confirm(
        `Delete "${plan.title}"?\n\nThis cannot be undone.`
    );

    if(!confirmed) return;

    planner = planner.filter(p => p.id !== planId);

    savePlannerData();

    renderPlanner();

}
function renamePlan(planId){

    const plan = planner.find(p => p.id === planId);

    if(!plan) return;

    const newTitle = prompt(
        "Rename plan:",
        plan.title
    );

    if(newTitle === null) return;

    const trimmedTitle = newTitle.trim();

    if(!trimmedTitle) return;

    plan.title = trimmedTitle;

    savePlannerData();

    renderPlanner();

}

function duplicatePlan(planId){

    const plan = planner.find(p => p.id === planId);

    if(!plan) return;

    const duplicate = JSON.parse(
        JSON.stringify(plan)
    );

    duplicate.id = Date.now();

    duplicate.title = `${plan.title} Copy`;

    planner.push(duplicate);

    savePlannerData();

    renderPlanner();

}

function updateProgress(plan){

    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");

    if(!progressText || !progressFill) return;

    const total = plan.checklist.length;

    const completed = plan.checklist.filter(

        item => item.done

    ).length;

    progressText.textContent = `${completed} of ${total} completed`;

    const percent = total === 0
        ? 0
        : (completed / total) * 100;

    progressFill.style.width = `${percent}%`;

}
function renderChecklist(plan){

    const checklistList = document.getElementById("checklistList");

    if(!checklistList) return;

    checklistList.innerHTML = "";

    if((plan.checklist || []).length === 0){

        checklistList.innerHTML = `

            <div class="empty-checklist">

                <div class="empty-illustration">

                    ☁️ 🌤 ☁️

                </div>

                <h3>Today is still unwritten.</h3>

                <p>
                    Begin with one thoughtful task.<br>
                     Small steps create brighter tomorrows.
                </p>

            </div>

        `;

        return;

    }

   (plan.checklist || []).forEach(item=>{

        checklistList.innerHTML += `

            <div class="checklist-item ${item.done ? "completed" : ""}">

                <label class="checkbox-wrapper">

                    <input
                        type="checkbox"
                        ${item.done ? "checked" : ""}
                        onchange="toggleChecklist(${plan.id}, ${item.id})"
                    >

                    <span class="checkmark"></span>

                </label>

                <span>${item.text}</span>


               <button
                    onclick="deleteChecklistItem(${plan.id}, ${item.id})"
                    
                    >     
                      ✕

                </button>

            </div>

        `;

    });

}
function addChecklistItem(planId){

    const plan = planner.find(

        p => p.id === planId

    );

    if(!plan) return;

    const checklistInput = document.getElementById("checklistInput");

    const text = checklistInput.value.trim();

    if(text === "") return;

    if(!plan.checklist){

        plan.checklist = [];

    }

    plan.checklist.push({

        id: Date.now(),

        text,

        done:false

    });

    checklistInput.value = "";

    savePlannerData();

    renderChecklist(plan);

    updateProgress(plan);

}
function toggleChecklist(planId, itemId){

    const plan = planner.find(
        p => p.id === planId
    );

    if(!plan) return;

    const item = plan.checklist.find(
        i => i.id === itemId
    );

    if(!item) return;

    item.done = !item.done;

    savePlannerData();

    renderChecklist(plan);

    updateProgress(plan);

}
function deleteChecklistItem(planId, itemId){

    const plan = planner.find(

        p => p.id === planId

    );

    if(!plan) return;

    plan.checklist = plan.checklist.filter(

        item => item.id !== itemId

    );

    savePlannerData();

    renderChecklist(plan);

    updateProgress(plan);

}

// ==========================================
// RENDER
// ==========================================
function renderHome(){

    planWorkspace.innerHTML = `

        <div class="planner-home">

            <div class="workspace-header">

                <div>

                     <p class="workspace-label">
                        TODAY'S FOCUS
                    </p>

                    <h2>
                        Make progress, one task at a time.
                    </h2>

                </div>

            </div>

            <div class="morning-banner">

                <div class="banner-content">

                    <span class="banner-icon">🌤</span>

                    <div>

                        <h4>One thoughtful step today.</h4>

                        <p>A brighter tomorrow begins here.</p>

                    </div>

                </div>   

                <div class="banner-art">
                    ☀️
                 </div>

            </div>

            <div class="task-input-card">

                <input
                    id="quickCaptureInput"
                    placeholder="What do you want to accomplish today?">

                <button id="quickCaptureBtn">

                    Add
                </button>

            </div>
            <div id="todayList"></div>
       </div>

    `;
    quickCaptureInput = document.getElementById("quickCaptureInput");

    quickCaptureBtn = document.getElementById("quickCaptureBtn");

    todayList = document.getElementById("todayList");

    quickCaptureBtn.addEventListener("click", addTodayItem);

    quickCaptureInput.addEventListener("keydown",e=>{

        if(e.key==="Enter"){

            addTodayItem();

        }

    });

    renderToday();

}
function renderToday(){

    if(todayItems.length===0){

        todayList.innerHTML = `

            <div class="planner-empty-state">

                <p>Nothing planned yet.</p>

                <small>Start with one small step.</small>

            </div>

        `;

        return;

    }

    todayList.innerHTML = "";

    todayItems.forEach(item=>{

        todayList.innerHTML += `

            <div class="today-item">

                <div class="today-left">

                    <input

                        type="checkbox"

                        ${item.completed ? "checked" : ""}

                        onchange="toggleTodayItem(${item.id})">

                    <span

                        class="today-text ${item.completed ? "completed" : ""}">

                        ${item.text}

                    </span>

                </div>

                <button

                    class="delete-today"

                    onclick="deleteTodayItem(${item.id})">

                    🗑️

                </button>

            </div>

        `;

    });

}
// ==========================================
// EVENT LISTENERS
// ==========================================


newPlanBtn.addEventListener(

    "click",

    openModal

);

cancelPlan.addEventListener(

    "click",

    closeModal

);

savePlan.addEventListener(

    "click",

    createPlan

);

if (viewArchivedPlansBtn) {
    viewArchivedPlansBtn.addEventListener("click", openArchive);
}

if (closeArchive) {
    closeArchive.addEventListener("click", closeArchiveModal);
}

if (archiveModal) {
    archiveModal.addEventListener("click", (event) => {
        if (event.target === archiveModal) closeArchiveModal();
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeArchiveModal();
        closePlanMenu();
    }
});

// ==========================================
// INITIALIZE
// ==========================================

loadPlannerData();

renderPlanner();

renderHome();

const todayFullDate = document.getElementById("todayFullDate");

if(todayFullDate){

    todayFullDate.textContent = new Date().toLocaleDateString(
        "en-US",
        {
            weekday:"long",
            month:"long",
            day:"numeric",
            year:"numeric"
        }
    );

}