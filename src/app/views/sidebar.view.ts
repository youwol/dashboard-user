import { attr$, VirtualDOM } from "@youwol/flux-view"
import { BehaviorSubject } from "rxjs"
import { AppState } from "../app.state"
import { faClasses, PageType } from "../utils.view"



class AssetTypeView implements VirtualDOM {

    class = 'd-flex align-items-center w-100'
    children: VirtualDOM[]

    constructor(state: AppState, page: PageType, extended$: BehaviorSubject<boolean>) {

        let faClass = faClasses[page]
        let title = {
            [PageType.applications]: "Applications",
            [PageType.packages]: "Blocks",
            [PageType.stories]: "Stories",
            [PageType.data]: "Data",
            [PageType.announcements]: "Announcements",
        }[page]

        this.children = [{
            class: attr$(
                state.selectedPage$,
                (p: PageType) => p == page ? 'fv-text-focus' : ' fv-hover-text-focus',
                { wrapper: (d) => `d-flex ${d} align-items-center fv-pointer my-3 flex-grow-1` }
            ),
            children: [,
                {
                    class: attr$(
                        extended$,
                        (extended) => extended ? 'px-2' : 'd-none'
                    ),
                    innerText: title
                },
                {
                    class: faClass + " ml-auto"
                }
            ],
            onclick: () => {
                state.selectPage(page)
            }
        }
        ]
    }
}

export class PagesView implements VirtualDOM {

    children: Array<VirtualDOM>

    constructor({ state, extended$ }) {
        this.children = Object.values(PageType)
            .map(page => new AssetTypeView(state, page, extended$))
    }
}


export class SideBarView implements VirtualDOM {

    class = "fv-bg-background p-2 border-right h-100"
    style: any
    children: VirtualDOM[]

    constructor(state: AppState, extended$: BehaviorSubject<boolean>) {

        this.style = attr$(
            extended$,
            (extanded) => extanded
                ? {
                    width: '250px'
                } : { width: 'auto' }
        )

        this.children = [
            {
                class: "w-100 fv-text-primary text-right mb-3",
                children: [
                    {
                        class: 'ml-auto fas fa-bars fv-pointer p-1 fv-hover-text-focus',
                        onclick: () => { extended$.next(!extended$.getValue()) }
                    }
                ]
            },
            new PagesView({ state, extended$ })
        ]
    }
}
