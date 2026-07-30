const moodButtons = document.querySelectorAll(".mood-button");
const journalEntry = document.querySelector("textarea");
const saveButton = document.querySelector(".save-button");

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".mood-button.active")?.classList.remove("active");

    button.classList.add("active");
  });
});

saveButton.addEventListener("click", () => {
  localStorage.setItem("journalEntry", journalEntry.value);

  saveButton.textContent = "Saved ✓";

  setTimeout(() => {
    saveButton.textContent = "Save entry";
  }, 2000);
});

const savedEntry = localStorage.getItem("journalEntry");

if (savedEntry) {
  journalEntry.value = savedEntry;
}

const clockTime = document.querySelector("#clock-time");

function updateClock() {
  const now = new Date();

  clockTime.textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

updateClock();
setInterval(updateClock, 1000);