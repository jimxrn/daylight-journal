/* ==========================================
   DAYLIGHT - MOOD WIDGET
========================================== */

const moodNames = {
    "😄": "Excited",
    "😊": "Happy",
    "😌": "Calm",
    "😐": "Neutral",
    "😔": "Tired",
    "😭": "Overwhelmed"
};

const moodButtons = document.querySelectorAll(".mood-btn");
const moodLabel = document.querySelector(".mood-label");
const moodTime = document.querySelector(".mood-time");

if (moodButtons.length && moodLabel && moodTime) {

    // Load saved mood
    const savedEmoji = localStorage.getItem("todayMood");
    const savedMood = localStorage.getItem("todayMoodName");
    const savedTime = localStorage.getItem("todayMoodTime");

    if (savedEmoji) {

        moodButtons.forEach(button => {

            if (button.textContent.trim() === savedEmoji) {
                button.classList.add("active");
            }

        });

        moodLabel.textContent = `${savedEmoji} ${savedMood}`;
        moodTime.textContent = `Updated at ${savedTime}`;
    }

    // Click events
    moodButtons.forEach(button => {

        button.addEventListener("click", () => {

            document.querySelector(".mood-btn.active")
                ?.classList.remove("active");

            button.classList.add("active");

            const emoji = button.textContent.trim();
            const mood = moodNames[emoji];

            const now = new Date();

            const time = now.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
            });

            localStorage.setItem("todayMood", emoji);
            localStorage.setItem("todayMoodName", mood);
            localStorage.setItem("todayMoodTime", time);

            moodLabel.textContent = `${emoji} ${mood}`;
            moodTime.textContent = `Updated at ${time}`;

        });

    });

}