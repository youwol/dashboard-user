import { attr$, VirtualDOM } from "@youwol/flux-view"
import { BehaviorSubject } from "rxjs"
import { map } from "rxjs/operators"
import { AppState } from "../app.state"
import { assetsByPage } from "../data"
import { faClasses, PageType } from "../utils.view"



class AssetTypeView implements VirtualDOM {

    class = 'd-flex align-items-center w-100'
    children: VirtualDOM[]

    constructor(page: PageType, selection$: BehaviorSubject<PageType>, extended$: BehaviorSubject<boolean>) {

        let faClass = faClasses[page]
        let title = {
            [PageType.applications]: "Applications",
            [PageType.packages]: "Bricks",
            [PageType.stories]: "Stories",
            [PageType.data]: "Data",
            [PageType.announcements]: "Announcements",
        }[page]

        this.children = [{
            class: attr$(
                selection$,
                (p: PageType) => p == page ? 'fv-text-secondary' : ' fv-hover-text-focus',
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
                console.log("New selection", page)
                selection$.next(page)
            }
        }
        ]
    }
}

export class SideBarView implements VirtualDOM {

    class = "fv-bg-background p-3 h-100"
    style: any
    children: VirtualDOM[]

    public readonly selection$ = new BehaviorSubject(PageType.applications)

    public readonly assetIds$ = this.selection$.pipe(
        map((selection: PageType) => {
            console.log("Asset ids", selection)
            return assetsByPage[selection].map((asset) => asset.assetId)
        })

    )

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
            {
                children: Object.values(PageType)
                    .map(page => new AssetTypeView(page, this.selection$, extended$))
            }
        ]
    }
}
