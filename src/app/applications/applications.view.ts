import { childrenAppendOnly$, VirtualDOM } from "@youwol/flux-view"
import { merge } from "rxjs"
import { map } from "rxjs/operators"
import { AppState } from "../app-state"
import { Asset, AssetsGtwClient } from "../client/assets-gtw.client"
import { AssetsListView, AssetView, headerView, panelBaseClasses } from "../utils.view"



let applications = [

    {
        // remeshing & smoothing
        assetId: "ZTRhN2UyMGYtNzBkMy00ZDg5LWJhZjItZWYzZDVlMDRkYzA3"
    },
    {
        // plotly simple example
        assetId: "YjZmN2FlNGItYzEwNi00NTdjLTlkZTEtMmM5NGFlZWE1OTg2"
    },
    {
        // nested components
        assetId: "ODQ0ZGIzMjAtYWUwYy00ZWFjLTg3N2EtN2RmYTBiNDY4MDEw"
    }
]

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
            new AssetsListView(assets$, state)
        ]
    }
}
