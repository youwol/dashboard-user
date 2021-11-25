import { VirtualDOM } from "@youwol/flux-view"
import { AssetsListView } from "@youwol/platform-essentials"
import { merge } from "rxjs"
import { map } from "rxjs/operators"
import { AppState } from "../app.state"
import { Asset, AssetsGtwClient } from "../client/assets-gtw.client"
import { IconButtonView, PageType } from "../utils.view"



export let backgrounds = {
    [PageType.applications]: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7oWwBRmPGqAamHHaepQbxsxrsfOMatdYIcw&usqp=CAU",
    [PageType.packages]: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_2VMUwjtfzrRRFSIy9QTd1snq4jdf6ekjoA&usqp=CAU",
    [PageType.data]: "",
    [PageType.stories]: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe6EZbq3ttSqGVYR_QLTFt3GJIIFfoUPF3Bw&usqp=CAU",
    [PageType.announcements]: "https://images.unsplash.com/photo-1527168027773-0cc890c4f42e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHBvc3QlMjBpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
}


export function actionViewFactory(assetKind: string) {
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


export class AssetsView {

    class = 'w-100 h-100 flex-grow-1 overflow-auto fv-text-primary d-flex flex-column position-relative'
    style = {
        backgroundColor: 'darkgray'
    }
    children: VirtualDOM[]

    constructor({ state, assetIds, tags, headerView }: {
        state: AppState,
        assetIds: string[],
        tags: string[],
        headerView?: VirtualDOM
    }) {

        let page = state.selectedPage$.getValue()

        let assets$ = merge(...assetIds.map((assetId) => {
            return AssetsGtwClient.getAsset$(assetId, tags)
        }))

        this.children = [
            {

                class: "h-100 w-100",
                style: {
                    backgroundImage: `url(${backgrounds[page]})`,
                    opacity: "0.1"
                }
            },
            {
                class: "position-absolute h-100 w-100",
                children: [
                    headerView ? headerView : {},
                    new AssetsListView({ assets$: assets$.pipe(map(asset => [asset])), state })
                ]
            }
        ]
    }
}

