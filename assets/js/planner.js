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



// ==========================================
// APP STATE
// ==========================================

const STORAGE_KEY = "daylightPlanner";

let planner = [];

let todayItems = [];


// ==========================================
// STORAGE
// ==========================================

function savePlanner(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(planner)

    );

}

function loadPlanner(){

    const saved = localStorage.getItem(

        STORAGE_KEY

    );

    planner = saved ? JSON.parse(saved) : [];

}

function saveTodayItems(){

    localStorage.setItem(

        "daylightToday",

        JSON.stringify(todayItems)

    );

}

function loadTodayItems(){

    const saved = localStorage.getItem(

        "daylightToday"

    );

    todayItems = saved ? JSON.parse(saved) : [];

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

    saveTodayItems();

    renderToday();

    quickCaptureInput.value = "";

    quickCaptureInput.focus();

}

function deleteTodayItem(id){

    todayItems = todayItems.filter(

        item=>item.id!==id

    );

    saveTodayItems();

    renderToday();

}

function toggleTodayItem(id){

    const item = todayItems.find(

        item=>item.id===id

    );

    if(!item) return;

    item.completed = !item.completed;

    saveTodayItems();

    renderToday();

}

// ==========================================
// PLANS
// ==========================================

function createPlan(){

    const title = planTitle.value.trim();
    const date = planDate.value;

    if(!title){

        alert("Please enter a plan title.");

        return;

    }

    const plan = {

        id: Date.now(),
        title,
        date,
        goal: "",
        notes: "",
        checklist: [],
        showInCalendar: false

    };

    planner.push(plan);

    savePlanner();

    renderPlanner();

    closeModal();

}

function renderPlanner(){

    allPlans.innerHTML = "";

    planner.forEach(plan=>{

        allPlans.innerHTML += `

            <div
                class="plan-card"
                onclick="openPlan(${plan.id})">

                <div class="plan-card-info">

                    <h3>${plan.title}</h3>

                    <small>${plan.date || "No date"}</small>

                </div>    

                <button
                    class="plan-menu-btn"
                    onclick="event.stopPropagation(); openPlanMenu(${plan.id})">

                     ⋮

                </button>

            </div>

        `;

    });

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

                <textarea id="goalTextarea">${plan.goal || ""}</textarea>


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

                <textarea id="notesTextarea">${plan.notes || ""}</textarea>

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

    const goalTextarea = document.getElementById("goalTextarea");

    goalTextarea.addEventListener("input", () => {

        plan.goal = goalTextarea.value;

        savePlanner();

    });
    const notesTextarea = document.getElementById("notesTextarea");

    notesTextarea.addEventListener("input", () => {

        plan.notes = notesTextarea.value;

        savePlanner();

    });

    const calendarToggle =
    document.getElementById("calendarToggle");

    if(calendarToggle){

    calendarToggle.addEventListener(
        "change",
        () => {

            plan.showInCalendar =
                calendarToggle.checked;

            savePlanner();

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

    savePlanner();

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

    savePlanner();

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

    savePlanner();

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

    savePlanner();

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

    savePlanner();

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

    savePlanner();

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

                <small>Capture something from the left.</small>

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
// ==========================================
// INITIALIZE
// ==========================================

loadPlanner();

loadTodayItems();

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