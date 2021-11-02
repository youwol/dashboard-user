import { attr$, childrenAppendOnly$, Stream$, VirtualDOM } from "@youwol/flux-view"
import { AppendOnlyChildrenStream$ } from "@youwol/flux-view/src/lib/advanced-children$"
import { Observable } from "rxjs"
import { AppState } from "./app-state"
import { Asset } from "./client/assets-gtw.client"


export let panelBaseClasses = 'w-50 h-50 p-2 fv-text-primary d-flex flex-column'


export function headerView(name: string): VirtualDOM {

    return {
        class: 'fv-bg-background-alt fv-color-primary rounded-top w-100 px-2',
        children: [
            {
                innerText: name
            }
        ]
    }
}

export class AssetsListView implements VirtualDOM {

    public readonly class = 'flex-grow-1 border d-flex flex-wrap justify-content-around p-3 overflow-auto'
    public readonly style = { minHeight: '0px' }

    public readonly children: AppendOnlyChildrenStream$<Asset>

    constructor(assets$: Observable<Asset[]>, state: AppState) {

        this.children = childrenAppendOnly$(
            assets$,
            (asset: Asset) => new AssetView(asset, state)
        )
    }
}

export class AssetView implements VirtualDOM {

    baseClasses = 'fv-background-alt d-flex flex-column text-center fv-pointer fv-color-primary fv-hover-color-focus position-relative my-2'
    class: any
    style = { width: '250px', height: '250px' }

    children: Array<VirtualDOM>

    onclick: () => void

    asset: Asset

    constructor(asset: Asset, state: AppState) {
        this.asset = asset
        this.class = attr$(
            state.selection$,
            (assetId) => {
                return asset.assetId == assetId ? 'fv-bg-secondary fv-color-focus' : ''
            },
            {
                wrapper: (d) => `${d} ${this.baseClasses}`,
                untilFirst: this.baseClasses
            }
        )
        this.children = [
            asset.thumbnails[0]
                ? this.thumbnailView()
                : this.noThumbnailView(),
            {
                class: 'py-3 fv-bg-background-alt position-absolute w-100',
                style: {
                    bottom: '0px',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                },
                innerText: asset.name
            }
        ]
        this.onclick = () => {
            state.selectAsset(asset.assetId)
        }
    }

    thumbnailView(): VirtualDOM {

        return {
            tag: 'img', class: "p-1", src: this.asset.thumbnails[0],
            style: { 'margin-top': 'auto', 'margin-bottom': 'auto' }
        }
    }

    noThumbnailView(): VirtualDOM {

        return {
            class: 'flex-grow-1',
            style: { minHeight: " 0px" }
        }
    }
}
