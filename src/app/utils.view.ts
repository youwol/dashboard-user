import { attr$, VirtualDOM } from "@youwol/flux-view"
import { Button } from "@youwol/fv-button"
import { Subject } from "rxjs"


export let panelBaseClasses = 'w-50 h-50 p-2 fv-text-primary d-flex flex-column'


export enum PageType {
    applications = "flux-project",
    packages = "package",
    stories = "story",
    data = "data",
    announcements = "announcements"
}
export let faClasses = {
    [PageType.applications]: "fas fa-play",
    [PageType.packages]: "fas fa-puzzle-piece",
    [PageType.stories]: "fas fa-book",
    [PageType.data]: "fas fa-database",
    [PageType.announcements]: "fas fa-bullhorn",
}
export function headerView(name: string): VirtualDOM {

    return {
        class: 'fv-bg-background-alt fv-color-primary rounded-top w-100 px-2',
        children: [
            {
                innerText: name
            }
        ]
    }
}


export class ButtonView extends Button.View {

    class = 'fv-btn fv-bg-secondary-alt fv-hover-bg-secondary'

    constructor(name: string, withClass: string = "") {
        super({ state: new Button.State(), contentView: () => ({ innerText: name }) })
        this.class = `${this.class} ${withClass}`
    }
}
export class IconButtonView extends Button.View {

    class = 'fv-btn fv-text-primary-alt fv-hover-text-focus p-0'

    constructor(faClass: string, withClass: string = "") {
        super({ state: new Button.State(), contentView: () => ({ class: faClass }) })
        this.class = `${this.class} ${withClass}`
    }
}


export function loginView() {

    return {
        class: `d-flex align-items-center w-25 justify-content-around`,
        style: { maxWidth: '250px' },
        children: [new ButtonView('login', 'mx-2 fv-text-primary'), new ButtonView('register', 'mx-2 fv-text-primary')]
    }
}

/*

    return {
        id: 'carouselExampleControls',
        class: "carousel slide",
        'data-ride': "carousel",
        children: [
            {
                class: "carousel-inner",
                children: asset.images.map((img, i) => {
                    return {
                        class: 'carousel-item ' + ((i === 0) ? "active" : ""),
                        children: [{
                            tag: 'img',
                            class: 'mx-auto d-block',
                            src: img,
                            width: 500
                        }]
                    }
                })
            },
            {
                tag: 'a',
                class: "carousel-control-prev",
                href: "#carouselExampleControls",
                role: "button",
                'data-slide': "prev",
                children: [
                    {
                        tag: 'span',
                        class: "carousel-control-prev-icon",
                        'aria-hidden': "true"
                    },
                    {
                        tag: 'span',
                        class: "sr-only",
                        innerText: 'Previous'
                    }
                ]
            },
            {
                tag: 'a',
                class: "carousel-control-next",
                href: "#carouselExampleControls",
                role: "button",
                'data-slide': "next",
                children: [
                    {
                        tag: 'span',
                        class: "carousel-control-next-icon",
                        'aria-hidden': "true"
                    },
                    {
                        tag: 'span',
                        class: "sr-only",
                        innerText: 'Next'
                    }
                ]
            }
        ]
    }
*/
