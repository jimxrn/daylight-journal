// ==========================================
// DOM ELEMENTS
// ==========================================

const todayPlans = document.getElementById("todayPlans");
const upcomingPlans = document.getElementById("upcomingPlans");
const allPlans = document.getElementById("allPlans");

const newPlanBtn = document.getElementById("newPlanBtn");
const emptyNewPlanBtn = document.getElementById("emptyNewPlanBtn");

const planWorkspace = document.getElementById("planWorkspace");
const planDetails = document.getElementById("planDetails");

const planModal = document.getElementById("planModal");

const cancelPlan = document.getElementById("cancelPlan");

const savePlan = document.getElementById("savePlan");

const planTitle = document.getElementById("planTitle");

const planDate = document.getElementById("planDate");

const quickCaptureInput =
document.getElementById("quickCaptureInput");
const quickCaptureBtn =
document.getElementById("quickCaptureBtn");

const quickCaptureList =
document.getElementById("quickCaptureList");

// ==========================================
// APPLICATION STATE
// ==========================================

let planner = [];

let selectedPlanId = null;

let quickCapture = [];

// ==========================================
// LOCAL STORAGE
// ==========================================

const STORAGE_KEY = "daylightPlanner";

function loadPlanner() {

    const saved = localStorage.getItem(STORAGE_KEY);

    planner = saved ? JSON.parse(saved) : [];

}

function savePlanner() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(planner)

    );

}
function saveQuickCapture(){

    localStorage.setItem(

        "daylightQuickCapture",

        JSON.stringify(quickCapture)

    );

}

function loadQuickCapture(){

    const saved = localStorage.getItem(

        "daylightQuickCapture"

    );

    quickCapture = saved

        ? JSON.parse(saved)

        : [];

}

// ==========================================
// RENDER
// ==========================================

function renderPlanner() {

    console.log("Planner Loaded");

}
function renderQuickCapture(){

    quickCaptureList.innerHTML = "";

    quickCapture.forEach((item,index)=>{

        quickCaptureList.innerHTML += `

            <div class="quick-item">

                <input
                    type="checkbox">

                <span>${item}</span>

            </div>

        `;

    });

}

function addQuickCapture(){

    const text =
    quickCaptureInput.value.trim();

    if(!text) return;

    quickCapture.push(text);

    saveQuickCapture();

    renderQuickCapture();

    quickCaptureInput.value="";

    quickCaptureInput.focus();

}

// ==========================================
// CREATE PLAN
// ==========================================

function createPlan() {

    planModal.classList.remove("hidden");

    planTitle.focus();
}
function closeModal(){

    planModal.classList.add("hidden");

}

// ==========================================
// OPEN PLAN
// ==========================================

function openPlan(id) {

    selectedPlanId = id;

    console.log("Open", id);

}

// ==========================================
// DELETE PLAN
// ==========================================

function deletePlan(id) {

    console.log("Delete", id);

}

// ==========================================
// EVENT LISTENERS
// ==========================================
cancelPlan.addEventListener(

    "click",

    closeModal

);

newPlanBtn.addEventListener("click", createPlan);

emptyNewPlanBtn.addEventListener("click", createPlan);
quickCaptureBtn.addEventListener(

    "click",

    addQuickCapture

);

quickCaptureInput.addEventListener(

    "keydown",

    e=>{

        if(e.key==="Enter"){

            addQuickCapture();

        }

    }

);

// ==========================================
// INITIALIZE
// ==========================================

loadPlanner();

renderPlanner();

loadQuickCapture();

renderQuickCapture();