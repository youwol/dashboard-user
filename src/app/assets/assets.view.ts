import { childrenAppendOnly$, VirtualDOM } from "@youwol/flux-view"
import { merge } from "rxjs"
import { map } from "rxjs/operators"
import { AppState } from "../app-state"
import { Asset, AssetsGtwClient } from "../client/assets-gtw.client"
import { AssetView, headerView, panelBaseClasses } from "../utils.view"


let assets = [

    {
        // CodeMirror
        assetId: "UUhsdmRYZHZiQzltYkhWNExXTnZaR1V0YldseWNtOXk="
    },
    {
        // FluxFiles
        assetId: "UUhsdmRYZHZiQzltYkhWNExXWnBiR1Z6"
    },
    {
        // FluxRxjs
        assetId: "UUhsdmRYZHZiQzltYkhWNExYSjRhbk09"
    },
    {
        // FluxThree
        assetId: "UUhsdmRYZHZiQzltYkhWNExYUm9jbVZs"
    },
    {
        // FluxFvWidgets
        assetId: "UUhsdmRYZHZiQzltYkhWNExXWjJMWGRwWkdkbGRITT0="
    },

]

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
                class: 'flex-grow-1 border d-flex flex-wrap justify-content-around p-3 overflow-auto',
                style: { minHeight: '0px' },
                children: childrenAppendOnly$(
                    assets$,
                    (asset: Asset) => new AssetView(asset, state)
                )
            }
        ]
    }
}
