import { install } from "@youwol/cdn-client"
import { YouwolBannerState } from "@youwol/platform-essentials"
import { BehaviorSubject, from, Observable, ReplaySubject } from "rxjs"
import { map } from "rxjs/operators"
import { assetsByPage } from "./data"
import { PageType } from "./utils.view"

function fetchCodeMirror$(): Observable<any> {

    return from(
        install({
            modules: ['codemirror'],
            scripts: [
                "codemirror#5.52.0~mode/javascript.min.js"
            ],
            css: [
                "codemirror#5.52.0~codemirror.min.css",
                "codemirror#5.52.0~theme/blackboard.min.css"
            ]
        })
    )
}

export class AppState {

    tags$ = new BehaviorSubject([])
    topBannerState = new YouwolBannerState({
        cmEditorModule$: fetchCodeMirror$()
    })
    public readonly selectedAsset$ = new ReplaySubject<string>(1)
    public readonly selectedPage$ = new BehaviorSubject(PageType.applications)

    public readonly assetIds$ = this.selectedPage$.pipe(
        map((selection: PageType) => {
            return assetsByPage[selection].map((asset) => asset.assetId)
        })
    )

    selectPage(page: PageType) {
        this.selectedPage$.next(page)
    }

    selectAsset(assetId: string) {
        this.selectedAsset$.next(assetId)
    }

    unselect() {
        this.selectedAsset$.next(undefined)
    }
}
