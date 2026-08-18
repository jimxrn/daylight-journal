/* ==========================================
   DAYLIGHT — SHARED BRAND
========================================== */

"use strict";


/* ==========================================
   OFFICIAL DAYLIGHT ICON
========================================== */

function getDaylightIconSVG() {

    return `

        <svg
            viewBox="0 0 72 72"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >

            <defs>

                <linearGradient
                    id="daylightSky"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >

                    <stop
                        offset="0%"
                        stop-color="#CDB7E8"
                    />

                    <stop
                        offset="55%"
                        stop-color="#DFA8CF"
                    />

                    <stop
                        offset="100%"
                        stop-color="#F5B8A4"
                    />

                </linearGradient>


                <linearGradient
                    id="daylightSun"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >

                    <stop
                        offset="0%"
                        stop-color="#FFE9A9"
                    />

                    <stop
                        offset="100%"
                        stop-color="#F7B85C"
                    />

                </linearGradient>

                <clipPath id="daylightClip">

                    <rect
                        x="8"
                        y="8"
                        width="56"
                        height="56"
                        rx="16"
                    />

                </clipPath>

            </defs>


            <!-- inner artwork -->

            <g clip-path="url(#daylightClip)">

                <!-- sky -->

                <rect
                    x="8"
                    y="8"
                    width="56"
                    height="56"
                    fill="url(#daylightSky)"
                />


                <!-- soft glow -->

                <circle
                    cx="36"
                    cy="34"
                    r="20"
                    fill="#FFFFFF"
                    opacity="0.08"
                />


                <!-- sun -->

                <circle
                    cx="36"
                    cy="36"
                    r="11"
                    fill="url(#daylightSun)"
                />


                <!-- sun rays -->

                <g
                    stroke="#FFECC2"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    opacity="0.9"
                >

                    <line
                        x1="36"
                        y1="18"
                        x2="36"
                        y2="14"
                    />

                    <line
                        x1="25"
                        y1="22"
                        x2="22"
                        y2="19"
                    />

                    <line
                        x1="47"
                        y1="22"
                        x2="50"
                        y2="19"
                    />

                    <line
                        x1="20"
                        y1="34"
                        x2="15"
                        y2="34"
                    />

                    <line
                        x1="52"
                        y1="34"
                        x2="57"
                        y2="34"
                    />

                </g>


                <!-- back hill -->

                <path
                    d="
                        M 4 48
                        C 16 42,
                          22 43,
                          31 47
                        C 42 52,
                          50 47,
                          68 43
                        L 68 72
                        L 4 72
                        Z
                    "
                    fill="#B39BD9"
                />


                <!-- front hill -->

                <path
                    d="
                        M 4 56
                        C 15 51,
                          26 51,
                          37 56
                        C 47 61,
                          56 55,
                          68 51
                        L 68 72
                        L 4 72
                        Z
                    "
                    fill="#9A83CD"
                    opacity="0.95"
                />


                <!-- water lines -->

                <g
                    fill="none"
                    stroke="#F4EBFA"
                    stroke-linecap="round"
                >

                    <path
                        d="M 24 58
                           C 29 56,
                             34 56,
                             40 58"
                        stroke-width="1.6"
                    />

                    <path
                        d="M 28 62
                           C 34 60,
                             40 60,
                             46 62"
                        stroke-width="1.4"
                    />

                </g>


                <!-- sparkles -->

                <g
                    fill="#FFF9F2"
                    opacity="0.9"
                >

                    <circle
                        cx="22"
                        cy="26"
                        r="1"
                    />

                    <circle
                        cx="49"
                        cy="28"
                        r="1"
                    />

                    <circle
                        cx="29"
                        cy="17"
                        r="0.8"
                    />

                    <circle
                        cx="45"
                        cy="15"
                        r="0.8"
                    />

                </g>

            </g>

        </svg>

    `;

}

/* ==========================================
   SHARED DAYLIGHT ICON
========================================== */

function renderDaylightIcon(
    elementId
) {

    const target =
        document.getElementById(
            elementId
        );

    if (!target) {
        return;
    }

    target.innerHTML =
        getDaylightIconSVG();

}


/* ==========================================
   BRAND NAVIGATION
========================================== */

function getDaylightBasePath() {

    const pathname =
        window.location.pathname;

    const pagesIndex =
        pathname.indexOf("/pages/");

    if (pagesIndex !== -1) {

        return pathname.substring(
            0,
            pagesIndex
        );

    }

    return "";

}


const DAYLIGHT_BASE_PATH =
    getDaylightBasePath();


const DAYLIGHT_NAVIGATION = [

    {
        label: "Dashboard",
        path:
            `${DAYLIGHT_BASE_PATH}/pages/dashboard/dashboard.html`
    },

    {
        label: "Journal",
        path:
            `${DAYLIGHT_BASE_PATH}/pages/journal/journal.html`
    },

    {
        label: "Calendar",
        path:
            `${DAYLIGHT_BASE_PATH}/pages/calendar/calendar.html`
    },

    {
        label: "Planner",
        path:
            `${DAYLIGHT_BASE_PATH}/pages/planner/planner.html`
    },

    {
        label: "Habits",
        path:
            `${DAYLIGHT_BASE_PATH}/pages/habits/habits.html`
    },

    {
        label: "Memories",
        path:
            `${DAYLIGHT_BASE_PATH}/pages/memories/memories.html`
    },

    {
        label: "Settings",
        path:
            `${DAYLIGHT_BASE_PATH}/pages/settings/settings.html`
    }

];

/* ==========================================
   CREATE BRAND HEADER
========================================== */

function renderDaylightBrand(
    currentPage
) {

    const target =
        document.getElementById(
            "daylight-brand"
        );

    if (!target) {
        return;
    }


    target.innerHTML = `

        <header
            class="daylight-brand-header"
        >

            <div
                class="daylight-brand-lockup"
            >

                <div
                    class="daylight-brand-icon"
                    aria-label="Daylight"
                >
                    ${getDaylightIconSVG()}
                </div>


                <h1
                    class="daylight-brand-name"
                >
                    Daylight
                </h1>


                <p
                    class="daylight-brand-tagline"
                >
                    your personal space ♡
                </p>

            </div>


            <nav
                class="daylight-brand-nav"
                aria-label="Daylight navigation"
            >

                ${

                    DAYLIGHT_NAVIGATION
                        .map(
                            item => `

                                <a
                                    href="${item.path}"
                                    class="${
                                        item.label
                                            .toLowerCase()
                                            === currentPage
                                            ? "active"
                                            : ""
                                    }"
                                >
                                    ${item.label}
                                </a>

                            `
                        )
                        .join("")

                }

            </nav>

        </header>

    `;

}


/* ==========================================
   INITIALIZE
========================================== */

function initDaylightBrand() {
    const page = document.body?.dataset.page || "";
    renderDaylightBrand(page);
    renderDaylightIcon("planner-brand-icon");
}

// brand.js is loaded at the end of each page, so render immediately when
// the DOM is already available. This prevents the legacy static logo from
// flashing during cross-document tab transitions.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDaylightBrand, { once: true });
} else {
    initDaylightBrand();
}

/* ==========================================
   DAYLIGHT — LIGHT PAGE TRANSITIONS
========================================== */
(function initDaylightPageTransitions(){
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.body;
    if (!body) return;

    // The incoming document starts covered. Reveal it only after the page
    // has had a chance to render its real header/content, avoiding flashes.
    const reveal = () => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                body.classList.add("daylight-transition-enter");
                body.classList.remove("daylight-transition-exit");
            });
        });
    };

    if (reduceMotion) {
        body.classList.add("daylight-transition-enter");
        return;
    }

    window.addEventListener("pageshow", reveal, { once: true });
    if (document.readyState === "complete") {
        reveal();
    } else {
        window.addEventListener("load", reveal, { once: true });
    }

    // Intercept same-origin anchor navigation so the outgoing page is
    // covered immediately, then let the browser perform the normal
    // navigation. No artificial navigation delay.
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");
        if (!link) return;
        if (link.target === "_blank" || link.hasAttribute("download") || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

        let url;
        try {
            url = new URL(link.href, location.href);
        } catch {
            return;
        }

        if (url.origin !== location.origin) return;
        if (url.href === location.href) return;

        const destination = url.pathname + url.search + url.hash;
        const current = location.pathname + location.search + location.hash;
        if (destination === current) return;

        event.preventDefault();
        body.classList.remove("daylight-transition-enter");
        body.classList.add("daylight-transition-exit");
        window.location.assign(url.href);
    }, true);
})();
