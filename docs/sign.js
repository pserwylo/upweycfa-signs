function dateParam() {
    const params = new URLSearchParams(document.location.search)

    if (!params.has('date')) {
        console.error("missing date=YYYY-MM-DD HH:MM:SS query param");
        return null;
    }

    let now = new Date();
    if (params.has('now')) {
        try {
            now = new Date(params.get('now'));
        } catch (e) {
            console.error("incorrect format for now=YYYY-MM-DD HH:MM:SS query param, defaulting to new Date()")
        }
    }

    try {
        const targetDate = new Date(params.get('date'));
        const diffSeconds = Math.round((targetDate.getTime() - now.getTime()) / 1000);
        let days = Math.round(diffSeconds / 60 / 60 / 24);

        // In case I forget to include Luxon...
        try {
            const luxonNow = luxon.DateTime.fromJSDate(now);
            const luxonTargetDate = luxon.DateTime.fromJSDate(targetDate);
            days = luxonTargetDate.ordinal = luxonTargetDate.ordinal - luxonNow.ordinal;
        } catch (e) {}

        const diff = {
            seconds: diffSeconds,
            minutes: Math.round(diffSeconds / 60),
            hours: Math.round(diffSeconds / 60 / 60),
            days,
        }

        const debug = params.has('debug');

        return {
            now,
            targetDate,
            diff,
            debug,
        }
    } catch (e) {
        console.error("incorrect format for date=YYYY-MM-DD HH:MM:SS query param");
        return null;
    }
}

class CfaBannerComponent extends HTMLElement {
    constructor() {
        super();
        const templateNode = document.createElement('template');
        templateNode.innerHTML = `
            <style>
            .cfa-banner--wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                background: #caca3b;
            }
            
            .cfa-banner--left {
                background: #d60b0b;
                flex-grow: 1;
                display: flex;
                padding-left: 1em;
                padding-right: 1em;
            }
            
            .cfa-banner--right {
                background: #fefe24;
                display: flex;
                padding-left: 1em;
                padding-right: 1em;
            }
            
            .cfa-banner--left slot {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            .cfa-banner--right slot {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            </style>
            <div class="cfa-banner cfa-banner--wrapper">
                <div class="cfa-banner--left">
                    <slot></slot>
                </div>
                <div class="cfa-banner--right">
                    <slot name="right"></slot>
                </div>
            </div>
        `;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateNode.content.cloneNode(true));
    }
}

customElements.define(
    "cfa-banner",
    CfaBannerComponent,
)