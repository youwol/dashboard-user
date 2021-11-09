import { attr$, VirtualDOM } from "@youwol/flux-view"
import { AppState } from "../app.state"
import { Asset } from "../client/assets-gtw.client"
import { faClasses } from "../utils.view"



export class AssetView implements VirtualDOM {

    baseClasses = 'fv-bg-background d-flex overflow-hidden flex-column text-center rounded fv-pointer fv-color-primary fv-hover-color-focus position-relative my-2'
    class: any
    style = { width: '250px', height: '250px' }

    children: Array<VirtualDOM>

    onclick: () => void

    public readonly asset: Asset
    public readonly action: VirtualDOM

    constructor(asset: Asset, state: AppState, action?: VirtualDOM) {
        this.asset = asset
        this.action = action
        this.class = attr$(
            state.selectedAsset$,
            (assetId) => {
                return asset.assetId == assetId ? 'fv-bg-secondary fv-color-focus' : ''
            },
            {
                wrapper: (d) => `${d} ${this.baseClasses}`,
                untilFirst: this.baseClasses
            }
        )
        this.children = [
            {
                class: 'border rounded fv-bg-primary position-absolute text-center',
                style: { width: '25px', height: '25px' },
                children: [{ tag: 'i', class: ` ${faClasses[asset.kind]} fv-text-secondary w-100` }]
            },
            asset.thumbnails[0]
                ? this.thumbnailView()
                : this.noThumbnailView(),
            this.ribbonView(),
        ]
        this.onclick = () => {
            state.selectAsset(asset.assetId)
        }
    }

    ribbonView(): VirtualDOM {

        return {
            class: 'py-3 fv-bg-background-alt position-absolute w-100 d-flex align-items-center justify-content-around',
            style: {
                bottom: '0px',
                background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))'
            },
            children: [
                {
                    innerText: this.asset.name
                },
                this.action ? this.action : {}
            ]
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
