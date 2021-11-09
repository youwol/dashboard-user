import { YouwolBannerState } from "@youwol/flux-youwol-essentials"
import { BehaviorSubject, ReplaySubject } from "rxjs"
import { map } from "rxjs/operators"
import { assetsByPage } from "./data"
import { PageType } from "./utils.view"


export class AppState {

    tags$ = new BehaviorSubject([])
    topBannerState = new YouwolBannerState()
    public readonly selectedAsset$ = new ReplaySubject<string>(1)
    public readonly selectedPage$ = new BehaviorSubject(PageType.applications)

    public readonly assetIds$ = this.selectedPage$.pipe(
        map((selection: PageType) => {
            return assetsByPage[selection].map((asset) => asset.assetId)
        })
    )

    selectAsset(assetId: string) {
        this.selectedAsset$.next(assetId)
    }

    unselect() {
        this.selectedAsset$.next(undefined)
    }
}
