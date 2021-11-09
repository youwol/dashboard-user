import { VirtualDOM, child$ } from "@youwol/flux-view";
import { BurgerMenu, BurgerMenuSection, SettingsBurgerItem, UserSettings, YouwolBannerView } from "@youwol/flux-youwol-essentials";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AppState } from "../app.state";
import { modalView } from "./modal.view";
import { AssetsView } from "./assets.view";
import { SideBarView } from "./sidebar.view";

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
            burgerMenuView: new BurgerMenu({
                sections: [
                    new BurgerMenuSection({
                        items: [
                            new UserSettings(),
                            new SettingsBurgerItem({ state: state.topBannerState })
                        ]
                    }),
                ]
            })
        })
    }
}

/*

class SideBarContentView implements VirtualDOM {

    public readonly class = ""
    public readonly children: VirtualDOM[]

    public readonly selection$ = new BehaviorSubject(PageType.applications)

    public readonly assetIds$ = this.selection$.pipe(
        map((selection: PageType) => {
            return assetsByPage[selection].map((asset) => asset.assetId)
        })

    )

    constructor(extended$: BehaviorSubject<boolean>) {

        let assetTypeView = {
            children: Object.values(PageType).filter(d => d != PageType.none)
                .map(page => new AssetTypeView(page, this.selection$, extended$))
        }

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
            new SideBarSection({ title: "", contentView: assetTypeView })
        ]
    }
}

*/




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
                    child$(
                        combineLatest([sideBarView.assetIds$, this.state.tags$]),
                        ([assetIds, tags]) => new AssetsView(this.state, assetIds, tags)
                    )
                ]
            }
        ]
    }
}
