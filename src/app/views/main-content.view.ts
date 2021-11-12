import { attr$, child$, VirtualDOM } from "@youwol/flux-view";
import { BehaviorSubject, combineLatest } from "rxjs";
import { AppState } from "../app.state";
import { ButtonView, PageType } from "../utils.view";
import { AssetsView } from "./assets.view";


let headerViewFactory = {
    [PageType.applications]: () => {
        return {
            class: 'd-flex justify-content-center my-2',
            children: [
                new ButtonView({ name: 'New application', withClass: 'fv-text-primary', enabled: true })
            ]
        }
    },
    [PageType.stories]: () => {
        return {
            class: 'd-flex justify-content-center my-2',
            children: [
                new ButtonView({ name: 'New story', withClass: 'fv-text-primary', enabled: true })
            ]
        }
    }
}

class PrivateHall {

    name = 'Private'

    contentView(state: AppState) {

        return {
            class: 'w-100 h-100',
            children: [
                child$(
                    combineLatest([
                        state.assetIds$,
                        state.tags$
                    ]),
                    ([assetIds, tags]) => {
                        let page = state.selectedPage$.getValue()
                        let headerView = headerViewFactory[page]?.()
                        return new AssetsView({ state, assetIds, tags, headerView: headerView })
                    }
                )
            ]
        }
    }
}

class YouWolHall {

    name = 'YouWol'

    constructor() {
    }

    contentView(state) {
        return {
            class: 'w-100 h-100',
            children: [
                child$(
                    combineLatest([
                        state.assetIds$,
                        state.tags$
                    ]),
                    ([assetIds, tags]) => new AssetsView({ state, assetIds, tags })
                )
            ]
        }
    }
}


export class ContentView implements VirtualDOM {

    class = "w-100 h-100 d-flex flex-column"
    children: VirtualDOM[]

    public readonly halls = [
        new YouWolHall(),
        new PrivateHall()
    ]

    selectedHall$ = new BehaviorSubject<any>(this.halls[0])

    constructor(state: AppState) {

        this.children = [
            this.headerView(),
            child$(
                this.selectedHall$,
                (hall) => hall.contentView(state)
            )
        ]
    }

    headerView(): VirtualDOM {

        return {
            class: 'd-flex align-items-center py-2 w-100 justify-content-between flex-wrap',
            children: [
                {
                    class: 'fas fa-person-booth px-3'
                },
                {
                    class: 'd-flex align-items-center justify-content-around flex-grow-1 flex-wrap',
                    children: this.halls.map(hall => {
                        let view = this.hallView(hall)
                        return { ...view, onclick: () => { this.selectedHall$.next(hall) } }
                    })
                }
            ]
        }
    }

    hallView(hall): VirtualDOM {

        return {
            class: attr$(
                this.selectedHall$,
                (selected) => hall.name === selected.name ? 'fv-bg-focus' : '',
                { wrapper: (d) => `${d} px-3 fv-color-primary rounded fv-pointer` }
            ),
            innerText: hall.name
        }
    }
}
