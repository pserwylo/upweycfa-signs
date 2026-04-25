function dateParam() {
    const params = new URLSearchParams(document.location.search)

    if (!params.has('date')) {
        console.error("missing date=YYYY-MM-DD HH:MM:SS query param");
        return null;
    }

    try {
        const targetDate = new Date(params.get('date'));
        const now = new Date();
        const diffSeconds = Math.round((targetDate.getTime() - now.getTime()) / 1000);
        const diff = {
            seconds: diffSeconds,
            minutes: Math.round(diffSeconds / 60),
            hours: Math.round(diffSeconds / 60 / 60),
            days: Math.round(diffSeconds / 60 / 60 / 24),
        }

        const debug = params.has('debug');

        return {
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