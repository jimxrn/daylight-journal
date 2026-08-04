// ==========================================
// DOM REFERENCES
// ==========================================

const quickCaptureInput = document.getElementById("quickCaptureInput");
const quickCaptureBtn = document.getElementById("quickCaptureBtn");

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
        notes: ""

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

                <h3>${plan.title}</h3>

                <small>${plan.date || "No date"}</small>

            </div>

        `;

    });

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

            <h2>${plan.title}</h2>

            <p class="plan-date">

                ${plan.date || ""}
            </p>    

            <hr>

            <div class="plan-section">

                <h3> Goal </h3>

                <textarea>${plan.goal}</textarea>

            </div>

            <div class="plan-section">

                <h3> Notes</h3>

                <textarea>${plan.notes}</textarea>

            </div>

        </div>          

    `;

}
// ==========================================
// RENDER
// ==========================================
function renderHome(){

    planWorkspace.innerHTML = `

        <div class="planner-home">

            <h2>Today</h2>

            <p id="todayDate"></p>

            <div id="todayList"></div>

        </div>

    `;

    todayList = document.getElementById("todayList");

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

quickCaptureBtn.addEventListener(

    "click",

    addTodayItem

);

quickCaptureInput.addEventListener(

    "keydown",

    e=>{

        if(e.key==="Enter"){

            addTodayItem();

        }

    }

);

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