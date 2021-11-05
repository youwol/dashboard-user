import { attr$, child$, VirtualDOM } from "@youwol/flux-view"
import { BehaviorSubject } from "rxjs"
import { mergeMap } from "rxjs/operators"
import { AppState } from "./utils.view"
import { Asset, AssetsGtwClient } from "./client/assets-gtw.client"
import { headerView, panelBaseClasses } from "./utils.view"


export class DetailsView {

    class = panelBaseClasses
    children: Array<VirtualDOM>

    constructor(state: AppState) {
        this.children = [
            headerView("Description"),
            {
                class: 'flex-grow-1 border',
                style: { minHeight: '0px' },
                children: [
                    child$(
                        state.selection$.pipe(
                            mergeMap((assetId) => AssetsGtwClient.getAsset$(assetId))
                        ),
                        (asset: Asset) => presentationView(asset)
                    )
                ]
            }
        ]
    }
}

export function presentationView(asset: Asset): VirtualDOM {

    let hr = { tag: 'hr' }
    return {
        class: "w-100 p-3 px-5 h-100 overflow-auto fv-text-primary",
        children: [
            titleView(asset),
            hr,
            snippetView(asset),
            hr,
            descriptionView(asset)
        ]
    }
}

export function snippetView(asset: Asset) {
    if (asset.images.length == 0)
        return {}

    let selectedSnippet$ = new BehaviorSubject<number>(0)
    let handleView = (index, icon, increment) => {
        return (increment == -1 && index > 0) || (increment == 1 && index < asset.images.length - 1)
            ? {
                class: `fas ${icon} my-auto fa-2x fv-pointer fv-text-primary fv-hover-text-focus`, onclick: () => selectedSnippet$.next(selectedSnippet$.getValue() + increment)
            }
            : { class: increment > 0 ? 'mr-auto' : 'ml-auto' }
    }

    return {
        class: 'd-flex',
        children: [
            child$(
                selectedSnippet$,
                (index) => handleView(index, 'fa-chevron-left ml-auto', -1)
            ),
            child$(
                selectedSnippet$,
                (index) => ({
                    class: "d-flex w-100 justify-content-center w-100 px-2 snippet",
                    tag: 'img',
                    style: {
                        maxHeight: '500px',
                        maxWidth: '500px',
                        height: 'auto'
                    },
                    src: asset.images[index]
                })
            ),
            child$(
                selectedSnippet$,
                (index) => handleView(index, 'fa-chevron-right mr-auto', 1)
            ),
        ]
    }
}



function titleView(asset: Asset) {

    return {
        tag: 'h1',
        class: 'text-center',
        innerText: asset.name
    }
}

function descriptionView(asset: Asset) {

    return {
        class: 'w-100  py-2',
        children: [
            {
                class: 'w-100 text-justify fv-text-primary',
                innerHTML: asset.description,
                style: { 'font-size': 'large' }
            }
        ]
    }
}
