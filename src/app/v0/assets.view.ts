import { VirtualDOM } from "@youwol/flux-view"
import { merge } from "rxjs"
import { map } from "rxjs/operators"
import { AssetsGtwClient } from "../client/assets-gtw.client"
import { assets } from "../data"
import { AppState, AssetsListView, headerView, panelBaseClasses } from "../utils.view"



export class AssetsView {

    class = panelBaseClasses

    children: VirtualDOM[]

    constructor(state: AppState) {

        let assets$ = merge(...assets.map(({ assetId }) => {
            return AssetsGtwClient.getAsset$(assetId)
        })).pipe(
            map(asset => [asset])
        )

        this.children = [
            headerView("Popular Assets"),
            {
                class: 'border h-100',
                children: [new AssetsListView(assets$, state)]
            }
        ]
    }
}
