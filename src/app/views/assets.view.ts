import { child$, childrenAppendOnly$, VirtualDOM } from "@youwol/flux-view"
import { ywSpinnerView } from "@youwol/flux-youwol-essentials"
import { merge, Observable, ReplaySubject } from "rxjs"
import { map } from "rxjs/operators"
import { AppState } from "../app.state"
import { Asset, AssetsGtwClient } from "../client/assets-gtw.client"
import { IconButtonView } from "../utils.view"
import { AssetView } from "./asset.view"



function actionViewFactory(assetKind: string) {
    let factory = {
        'flux-project': (asset: Asset) => {
            let view = new IconButtonView('fas fa-play')
            view.state.click$.subscribe(() => {
                window.location.href = `/ui/flux-runner/?id=${asset.rawId}`
            })
            return view
        },
        'story': (asset: Asset) => {
            let view = new IconButtonView('fab fa-readme')
            view.state.click$.subscribe(() => {
                window.location.href = `/ui/stories/?id=${asset.rawId}`
            })
            return view
        }
    }
    return factory[assetKind] ? factory[assetKind] : () => ({})
}


export class AssetsListView implements VirtualDOM {

    public readonly class = 'h-100 overflow-auto w-100'
    public readonly style = { minHeight: '0px' }

    public readonly children: VirtualDOM

    constructor(assets$: Observable<Asset[]>, state: AppState) {
        let elementInDoc$ = new ReplaySubject(1)
        this.children = [
            {
                class: "w-100 d-flex flex-wrap justify-content-around ",
                children: childrenAppendOnly$(
                    assets$,
                    (asset: Asset) => new AssetView(asset, state, actionViewFactory(asset.kind)),
                    { sideEffects: () => elementInDoc$.next(true) }
                )
            },
            child$(
                elementInDoc$,
                () => ({}),
                {
                    untilFirst: ywSpinnerView({ classes: 'mx-auto', size: '50px', duration: 1.5 }) as any
                }
            )
        ]
    }
}

export class AssetsView {

    class = 'w-100 h-100 flex-grow-1 overflow-auto fv-text-primary d-flex flex-column position-relative'
    style = {
        backgroundColor: 'darkgray'
    }
    children: VirtualDOM[]

    constructor(state: AppState, assetIds: string[], tags: string[]) {

        console.log("Assets", assetIds)

        let assets$ = merge(...assetIds.map((assetId) => {
            return AssetsGtwClient.getAsset$(assetId, tags)
        }))

        this.children = [
            {

                class: "h-100 w-100",
                style: {
                    backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7oWwBRmPGqAamHHaepQbxsxrsfOMatdYIcw&usqp=CAU)",
                    opacity: "0.1"
                }
            },
            {
                class: "position-absolute h-100 w-100",
                children: [
                    new AssetsListView(assets$.pipe(map(asset => [asset])), state)
                ]
            }
        ]
    }
}

