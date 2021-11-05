import { VirtualDOM } from "@youwol/flux-view"
import { merge } from "rxjs"
import { map } from "rxjs/operators"
import { Asset, AssetsGtwClient } from "../client/assets-gtw.client"
import { applications } from "../data"
import { AppState, AssetsListView, headerView, IconButtonView, panelBaseClasses } from "../utils.view"




function actionView(asset: Asset) {
    let view = new IconButtonView('fas fa-play')
    view.state.click$.subscribe(() => {
        window.location.href = `/ui/flux-runner/?id=${asset.rawId}`
    })
    return view
}

export class ApplicationsView {

    class = panelBaseClasses
    children: VirtualDOM[]

    constructor(state: AppState) {

        let assets$ = merge(...applications.map(({ assetId }) => {
            return AssetsGtwClient.getAsset$(assetId)
        })).pipe(
            map(asset => [asset])
        )

        this.children = [
            headerView("Popular Applications"),
            {
                class: 'border h-100',
                children: [
                    new AssetsListView(assets$, state)
                ]
            }
        ]
    }
}
