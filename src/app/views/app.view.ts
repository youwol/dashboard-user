import { VirtualDOM } from "@youwol/flux-view";
import { defaultUserMenu, defaultYouWolMenu, YouwolBannerView } from "@youwol/flux-youwol-essentials";
import { BehaviorSubject, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { AppState } from "../app.state";
import { modalView } from "./modal.view";
import { SideBarView } from "./sidebar.view";
import { ContentView } from "./main-content.view";

class SearchView implements VirtualDOM {

    class = 'd-flex align-items-center w-25 fv-bg-primary rounded'
    children: VirtualDOM[]
    style = { minWidth: '400px' }
    constructor(search$: Subject<string[]>) {

        this.children = [
            {
                tag: 'input',
                type: 'text',
                class: 'w-100',
                placeholder: 'search assets by tags',
                onkeydown: (ev: KeyboardEvent) => {
                    if (ev.key == "Enter") {
                        search$.next(ev.target['value'].split(" ").filter(d => d != "").map(keyword => keyword))
                    }
                    console.log(ev)
                }
            },
            {
                tag: 'i',
                class: 'fas fa-search px-2 fv-text-on-primary',

            }
        ]
    }
}
/**
 * Top banner of the application
 */
export class TopBannerView extends YouwolBannerView {

    constructor(state: AppState) {
        super({
            state: state.topBannerState,
            customActionsView: {
                class: 'd-flex align-items-center justify-content-around flex-grow-1 flex-wrap',
                children: [
                    new SearchView(state.tags$)
                ]
            },
            userMenuView: defaultUserMenu(state.topBannerState),
            youwolMenuView: defaultYouWolMenu(state.topBannerState)
        })
    }
}


/**
 * Global application's view
 */
export class AppView implements VirtualDOM {

    public readonly state: AppState
    public readonly class = 'fv-bg-background fv-text-primary d-flex flex-column w-100 h-100'

    public readonly children: Array<VirtualDOM>

    extended$ = new BehaviorSubject(true)

    constructor() {

        this.state = new AppState()

        this.state.selectedAsset$.pipe(
            filter(asset => asset != undefined)
        ).subscribe(() => modalView(this.state))

        let sideBarView = new SideBarView(this.state, this.extended$)

        this.children = [
            new TopBannerView(this.state),
            {
                class: 'd-flex h-100',
                children: [
                    sideBarView,
                    new ContentView(this.state)
                ]
            }
        ]
    }
}
