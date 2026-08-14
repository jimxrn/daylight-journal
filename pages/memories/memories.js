/* ==========================================
   DAYLIGHT — MEMORIES
========================================== */

"use strict";


/* ==========================================
   STORAGE
========================================== */

const MEMORIES_STORAGE_KEY =
    "daylightMemories";


/* ==========================================
   ELEMENTS
========================================== */

const calendar =
    document.getElementById(
        "memory-calendar"
    );

const monthLabel =
    document.getElementById(
        "memory-month"
    );

const detail =
    document.getElementById(
        "memory-detail"
    );

const previousMonthButton =
    document.getElementById(
        "previous-month"
    );

const nextMonthButton =
    document.getElementById(
        "next-month"
    );

const addMemoryButton =
    document.getElementById(
        "add-memory-button"
    );


/* ==========================================
   STATE
========================================== */

const today =
    new Date();


let currentMonth =
    new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );


let selectedDate =
    getDateKey(today);


/* ==========================================
   DATE HELPERS
========================================== */

function getDateKey(
    date
) {

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


function parseDateKey(
    dateKey
) {

    const [
        year,
        month,
        day
    ] =
        dateKey
            .split("-")
            .map(Number);


    return new Date(
        year,
        month - 1,
        day
    );

}


function isToday(
    dateKey
) {

    return (
        dateKey ===
        getDateKey(
            new Date()
        )
    );

}


/* ==========================================
   STORAGE
========================================== */

function getMemories() {

    return getDaylightSection(
        "memories"
    );

}

function saveMemories(
    memories
) {

    saveDaylightSection(
        "memories",
        memories
    );

}

/* ==========================================
   MONTH
========================================== */

function renderMonth() {

   const memories =
        getMemories();


    const monthSubtitle =
        document.getElementById(
            "memory-month-subtitle"
        );

    const monthMessage =
        document.getElementById(
            "memory-month-message"
        );

    const monthCount =
        document.getElementById(
            "memory-month-count"
        );

    const year =
        currentMonth.getFullYear();

    const month =
        currentMonth.getMonth();


    monthLabel.textContent =
        currentMonth.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    const monthName =
    currentMonth.toLocaleDateString(
        "en-US",
        {
            month: "long"
        }
    );
    
    const monthMemoryCount =
    Object.keys(memories)
        .filter(
            dateKey => {

                const date =
                    parseDateKey(
                        dateKey
                    );

                return (
                    date.getFullYear() ===
                        currentMonth.getFullYear()
                    &&
                    date.getMonth() ===
                        currentMonth.getMonth()
                );

            }
        )
        .length;

    monthSubtitle.textContent =
    "a collection of little moments";


    monthMessage.textContent =
        `${monthName}, in little moments.`;


    if (
        monthMemoryCount === 0
    ) {

        monthCount.textContent =
            "Nothing saved yet. There is still time.";

    }

    else if (
        monthMemoryCount === 1
    ) {

        monthCount.textContent =
            "One little moment worth keeping.";

    }

    else {

        monthCount.textContent =
            `${monthMemoryCount} little moments worth keeping.`;

    }


    calendar.innerHTML =
        "";


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /*
        Leading empty cells
    */

    for (
        let index = 0;
        index < firstDay;
        index++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "memory-day empty";


        calendar.appendChild(
            empty
        );

    }


    /*
        Days
    */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const dateKey =
            getDateKey(
                date
            );


        const memory =
            memories[
                dateKey
            ];


        const tile =
            document.createElement(
                "button"
            );


        tile.type =
            "button";


        tile.className =
            "memory-day";


        if (
            isToday(
                dateKey
            )
        ) {

            tile.classList.add(
                "today"
            );

        }


        if (memory) {

            tile.classList.add(
                "has-memory"
            );


            tile.innerHTML = `

                <img
                    class="memory-day-image"
                    src="${memory.photo}"
                    alt=""
                >

                <span
                    class="memory-day-overlay"
                ></span>

                <span
                    class="memory-day-number"
                >
                    ${day}
                </span>

            `;

        }

        else {

            tile.innerHTML = `

                <span
                    class="memory-day-empty-number"
                >
                    ${day}
                </span>

            `;

        }


        if (
            dateKey ===
            selectedDate
        ) {

            tile.classList.add(
                "selected"
            );

        }


        tile.addEventListener(
            "click",
            () => {

                selectedDate =
                    dateKey;


                renderMonth();

                renderDetail();

            }
        );


        calendar.appendChild(
            tile
        );

    }

}


/* ==========================================
   DETAIL
========================================== */

function renderDetail() {

    const memories =
        getMemories();


    const memory =
        memories[
            selectedDate
        ];


    const date =
        parseDateKey(
            selectedDate
        );


    const formattedDate =
        date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    const weekday =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    if (memory) {

        renderExistingMemory(
            memory,
            formattedDate,
            weekday
        );

    }

    else {

        renderAddMemory(
            formattedDate,
            weekday
        );

    }

}


/* ==========================================
   EXISTING MEMORY
========================================== */

function renderExistingMemory(
    memory,
    formattedDate,
    weekday
) {

    detail.innerHTML = `

        <div class="memory-detail-inner">

            <div class="memory-detail-top">

                <div>

                    <h2
                        class="memory-detail-date"
                    >
                        ${formattedDate}
                    </h2>

                    <p
                        class="memory-detail-weekday"
                    >
                        ${weekday}
                    </p>

                </div>

            </div>


            <div
                class="memory-detail-heart"
            >
                ♡
            </div>


            <img
                class="memory-photo"
                src="${memory.photo}"
                alt="Memory from ${formattedDate}"
            >


            ${
                memory.caption
                    ? `
                        <p
                            class="memory-caption"
                        >
                            ${escapeHTML(
                                memory.caption
                            )}
                            ♡
                        </p>
                    `
                    : ""
            }


            <div
                class="memory-actions"
            >

                <button
                    type="button"
                    class="memory-primary-button"
                    id="edit-memory"
                >
                    ✎ Edit Memory
                </button>


                <button
                    type="button"
                    class="memory-secondary-button"
                    id="delete-memory"
                >
                    ♡ Delete Memory
                </button>

            </div>

        </div>

    `;


    document
        .getElementById(
            "edit-memory"
        )
        .addEventListener(
            "click",
            () => {

                renderAddMemory(
                    formattedDate,
                    weekday,
                    memory
                );

            }
        );


    document
        .getElementById(
            "delete-memory"
        )
        .addEventListener(
            "click",
            deleteSelectedMemory
        );

}


/* ==========================================
   ADD MEMORY
========================================== */

function renderAddMemory(
    formattedDate,
    weekday,
    existingMemory = null
) {

    detail.innerHTML = `

        <div class="memory-add-panel">

            <h2 class="memory-detail-date">
                ${formattedDate}
            </h2>

            <p class="memory-detail-weekday">
                ${weekday}
            </p>


            <div class="memory-detail-heart">
                ♡
            </div>


            <label
                class="
                    memory-upload
                    ${
                        existingMemory
                            ? "has-preview"
                            : ""
                    }
                "
                id="memory-upload"
            >

                <div
                    class="memory-upload-content"
                >

                    <div
                        class="memory-upload-icon"
                    >
                        ▧
                    </div>

                    <strong>
                        ${
                            existingMemory
                                ? "Choose a new photo"
                                : "Upload one photo"
                        }
                    </strong>

                    <span>
                        ${
                            existingMemory
                                ? "Your new photo will replace today's memory."
                                : "One memory per day."
                        }
                    </span>

                </div>


                <input
                    type="file"
                    id="memory-photo"
                    accept="image/*"
                >

            </label>


            <label
                class="memory-form-label"
                for="memory-caption"
            >
                What mattered today?
            </label>


            <textarea
                id="memory-caption"
                class="memory-caption-input"
                placeholder="Write a little about it..."
            >${
                existingMemory
                    ? escapeHTML(
                        existingMemory.caption || ""
                    )
                    : ""
            }</textarea>


            <button
                type="button"
                id="save-memory"
                class="memory-save-button"
            >
                Save Memory ♡
            </button>

        </div>

    `;


    const photoInput =
        document.getElementById(
            "memory-photo"
        );


    const upload =
        document.getElementById(
            "memory-upload"
        );


    let selectedPhoto =
        existingMemory
            ? existingMemory.photo
            : null;


    photoInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }


        resizeImage(
            file,
            photo => {

                selectedPhoto =
                    photo;


                upload.classList.add(
                    "has-preview"
                );


                let preview =
                    upload.querySelector(
                        ".memory-preview"
                    );


                if (!preview) {

                    preview =
                        document.createElement(
                            "img"
                        );

                    preview.className =
                        "memory-preview";

                    preview.alt =
                        "Selected memory photo";

                    upload.prepend(
                        preview
                    );

                }


                preview.src =
                    photo;


                const content =
                    upload.querySelector(
                        ".memory-upload-content"
                    );


                if (content) {

                    const strong =
                        content.querySelector(
                            "strong"
                        );

                    const span =
                        content.querySelector(
                            "span"
                        );


                    if (strong) {

                        strong.textContent =
                            "Change photo";

                    }


                    if (span) {

                        span.textContent =
                            "One photo per day.";

                    }

                }

            }
        );

    }
    );

    document
        .getElementById(
            "save-memory"
        )
        .addEventListener(
            "click",
            () => {

                if (!selectedPhoto) {

                    alert(
                        "Add one photo to save this memory."
                    );

                    return;

                }


                const caption =
                    document
                        .getElementById(
                            "memory-caption"
                        )
                        .value
                        .trim();


                const memories =
                    getMemories();


                memories[
                    selectedDate
                ] = {

                    photo:
                        selectedPhoto,

                    caption:
                        caption,

                    createdAt:
                        existingMemory?.createdAt ||
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString()

                };


                saveMemories(
                    memories
                );


                renderMonth();

                renderDetail();

            }
        );

}


/* ==========================================
   DELETE
========================================== */

function deleteSelectedMemory() {

    const memories =
        getMemories();


    delete memories[
        selectedDate
    ];


    saveMemories(
        memories
    );


    renderMonth();

    renderDetail();

}


/* ==========================================
   IMAGE RESIZE
========================================== */

function resizeImage(
    file,
    callback
) {

    const reader =
        new FileReader();


    reader.onload =
        event => {

            const image =
                new Image();


            image.onload =
                () => {

                    const maxSize =
                        1200;


                    let width =
                        image.width;

                    let height =
                        image.height;


                    if (
                        width >
                        height
                    ) {

                        if (
                            width >
                            maxSize
                        ) {

                            height =
                                Math.round(
                                    height *
                                    maxSize /
                                    width
                                );

                            width =
                                maxSize;

                        }

                    }

                    else {

                        if (
                            height >
                            maxSize
                        ) {

                            width =
                                Math.round(
                                    width *
                                    maxSize /
                                    height
                                );

                            height =
                                maxSize;

                        }

                    }


                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const context =
                        canvas.getContext(
                            "2d"
                        );


                    context.drawImage(
                        image,
                        0,
                        0,
                        width,
                        height
                    );


                    callback(
                        canvas.toDataURL(
                            "image/jpeg",
                            .82
                        )
                    );

                };


            image.src =
                event.target.result;

        };


    reader.readAsDataURL(
        file
    );

}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(
    value
) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ==========================================
   MONTH NAVIGATION
========================================== */

previousMonthButton.addEventListener(
    "click",
    () => {

        currentMonth =
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
            );

        const todayKey =
            getDateKey(
                new Date()
            );

        const isCurrentMonth =
            currentMonth.getFullYear() ===
                new Date().getFullYear() &&
            currentMonth.getMonth() ===
                new Date().getMonth();


        selectedDate =
            isCurrentMonth
                ? todayKey
                : getDateKey(
                    currentMonth
                );


        renderMonth();
        renderDetail();

    }
);


nextMonthButton.addEventListener(
    "click",
    () => {

        currentMonth =
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
            );

        const todayKey =
            getDateKey(
                new Date()
            );

        const isCurrentMonth =
            currentMonth.getFullYear() ===
                new Date().getFullYear() &&
            currentMonth.getMonth() ===
                new Date().getMonth();


        selectedDate =
            isCurrentMonth
                ? todayKey
                : getDateKey(
                    currentMonth
                );


        renderMonth();
        renderDetail();

    }
);


/* ==========================================
   ADD BUTTON
========================================== */

addMemoryButton.addEventListener(
    "click",
    () => {

        const now =
            new Date();


        currentMonth =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );


        selectedDate =
            getDateKey(
                now
            );


        renderMonth();

        renderDetail();

    }
);


/* ==========================================
   INITIALIZE
========================================== */

renderMonth();

renderDetail();