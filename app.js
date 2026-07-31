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

/* Analog clock */

const clockTime = document.querySelector("#clock-time");
const hourHand = document.querySelector("#hour-hand");
const minuteHand = document.querySelector("#minute-hand");

function updateClock() {
  const now = new Date();

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourDegrees = (hours + minutes / 60) * 30;
  const minuteDegrees = (minutes + seconds / 60) * 6;

  hourHand.style.transform =
    `translateX(-50%) rotate(${hourDegrees}deg)`;

  minuteHand.style.transform =
    `translateX(-50%) rotate(${minuteDegrees}deg)`;

  clockTime.textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

updateClock();
setInterval(updateClock, 1000);

/* Birthdays on the calendar */

const calendarDays = document.querySelectorAll(".day-box");
const birthdays = JSON.parse(localStorage.getItem("birthdays")) || {};

calendarDays.forEach((day) => {
  day.dataset.day = day.textContent.trim();

  day.addEventListener("click", () => {
    const dayNumber = day.dataset.day;

    const name = prompt(
      `Whose birthday is on July ${dayNumber}?`
    );

    if (!name || !name.trim()) {
      return;
    }

    if (!birthdays[dayNumber]) {
      birthdays[dayNumber] = [];
    }

    birthdays[dayNumber].push(name.trim());

    localStorage.setItem("birthdays", JSON.stringify(birthdays));

    showBirthdays();
  });
});

function showBirthdays() {
  calendarDays.forEach((day) => {
    const dayNumber = day.dataset.day;

    day.querySelector(".birthday-label")?.remove();

    if (birthdays[dayNumber]?.length) {
      const birthdayLabel = document.createElement("span");

      birthdayLabel.className = "birthday-label";
      birthdayLabel.textContent = `🎂 ${birthdays[dayNumber].join(", ")}`;

      day.appendChild(birthdayLabel);
      day.classList.add("has-birthday");
    }
  });
}

showBirthdays();