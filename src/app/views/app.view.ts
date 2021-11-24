import { VirtualDOM } from "@youwol/flux-view";
import {
    popupAssetModalView, AssetsGatewayClient, defaultUserMenu, defaultYouWolMenu, YouwolBannerView,
    Asset, AssetActionsView
} from "@youwol/flux-youwol-essentials";
import { BehaviorSubject, from, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AppState } from "../app.state";

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
            youwolMenuView: defaultYouWolMenu(state.topBannerState),
            signedIn$: from(fetch(new Request("/api/assets-gateway/healthz"))).pipe(
                map(resp => resp.status == 200)
            )
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

    extended$ = new BehaviorSubject(false)

    constructor() {

        this.state = new AppState()
        let client = new AssetsGatewayClient()
        this.state.selectedAsset$.pipe(
            filter(asset => asset != undefined)
        ).subscribe((assetId: string) => popupAssetModalView({
            asset$: client.getAsset$(assetId),
            actionsFactory: (asset: Asset) => new AssetActionsView({ asset }),
            forceReadonly: true
        }))

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
