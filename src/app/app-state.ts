import { VirtualDOM, render } from "@youwol/flux-view";
import { ReplaySubject, forkJoin, Observable, of, Subject } from "rxjs";
import { ApplicationsView } from "./applications/applications.view";
import { AssetsView } from "./assets/assets.view";
import { Asset } from "./client/assets-gtw.client";
import { DetailsView } from "./details/details.view";
import { GeneralView } from "./general/general.view";

import { TopBannerState, TopBannerView } from "./top-banner";

/**
 * 
 * @param storyId id of the story to load
 * @param container where to insert the main view
 * @returns application state & application view
 */
export function load(container: HTMLElement): Observable<{ appState: AppState, appView: AppView }> {
    container.innerHTML = ""

    let appState = new AppState()
    let appView = new AppView({ state: appState })
    container.appendChild(render(appView))
    return of({ appState, appView })
}

/**
 * Global application state, logic side of [[AppView]]
 */
export class AppState {

    public readonly selection$ = new Subject<string>()

    constructor() {
    }

    selectAsset(assetId: string) {
        this.selection$.next(assetId)
    }
}

/**
 * Global application's view
 */
export class AppView implements VirtualDOM {

    public readonly state: AppState
    public readonly class = 'fv-bg-background fv-text-primary d-flex flex-column w-100 h-100'

    public readonly children: Array<VirtualDOM>

    constructor(params: { state: AppState }) {

        Object.assign(this, params)

        this.children = [
            new TopBannerView(),
            {
                class: 'flex-grow-1 d-flex flex-wrap',
                style: { minHeight: '0px' },
                children: [
                    new GeneralView(),
                    new ApplicationsView(this.state),
                    new AssetsView(this.state),
                    new DetailsView(this.state)
                ]

            }
        ]
    }

}
