import { child$, HTMLElement$, render, VirtualDOM } from "@youwol/flux-view"
import { Modal } from "@youwol/fv-group"
import { BehaviorSubject, merge } from "rxjs"
import { filter, mergeMap } from "rxjs/operators"
import { Asset, AssetsGtwClient } from "../client/assets-gtw.client"
import { AppStateInterface, ywSpinnerView } from "../utils.view"
import { Tabs } from "@youwol/fv-tabs"
import { uuidv4 } from "@youwol/flux-core"
import { YouwolBannerState } from "@youwol/flux-youwol-essentials"

type AssetPreviewApp = {
    name: string,
    canOpen: (Asset) => boolean,
    applicationUrl: (Asset) => string
}
let assetPreviews = [
    {
        name: "Visualization 3D",
        canOpen: (asset: Asset) => asset.kind == "data" && asset.name.endsWith('.ts'),
        applicationURL: (asset: Asset) => {
            let encoded = encodeURI(JSON.stringify(asset))
            return `/ui/flux-runner/?id=81cfdf74-56ec-4202-bd23-d2049d6d96ab&asset=${encoded}`
        }
    }
]

class TabPreview extends Tabs.TabData {
    public readonly preview: AssetPreviewApp

    constructor(preview: AssetPreviewApp) {
        super(preview.name, preview.name)
        this.preview = preview
    }
}


export function modalView(state: AppStateInterface) {

    let modalState = new Modal.State()
    let view = new Modal.View({
        state: modalState,
        contentView: () => {
            return {
                class: 'p-3 rounded fv-color-focus fv-bg-background w-100 h-50 fv-text-primary',
                style: { maxWidth: '1000px' },
                children: [
                    child$(
                        state.selection$.pipe(
                            filter(asset => asset != undefined),
                            mergeMap((assetId) => AssetsGtwClient.getAsset$(assetId))
                        ),
                        (asset) => presentationView(state, asset),
                        {
                            untilFirst: ywSpinnerView({ classes: 'mx-auto', size: '50px', duration: 1.5 }) as any
                        }
                    ),
                ]
            }
        },
        connectedCallback: (elem: HTMLDivElement & HTMLElement$) => {
            elem.children[0].classList.add("w-100")
            // https://stackoverflow.com/questions/63719149/merge-deprecation-warning-confusion
            let sub = merge(...[modalState.cancel$, modalState.ok$]).subscribe(() => {
                modalDiv.remove()
                state.unselect()
            })
            elem.ownSubscriptions(sub)
        }
    } as any)
    let modalDiv = render(view)
    document.querySelector("body").appendChild(modalDiv)
    return view
}


export function presentationView(appState: AppStateInterface, asset: Asset): VirtualDOM {

    let hr = { tag: 'hr' }

    let mainView = {
        class: "w-100 p-3 px-5 h-100 overflow-auto fv-text-primary",
        children: [
            titleView(asset),
            hr,
            snippetView(asset),
            hr,
            descriptionView(asset)
        ]
    }
    console.log((appState['topBannerState'] as YouwolBannerState).settings$.getValue())
    let previews = (appState['topBannerState'] as YouwolBannerState).settings$.getValue().parsed.defaultApplications
        .filter((preview) => preview.canOpen(asset))
        .map((preview) => new TabPreview(preview))

    if (previews.length == 0)
        return mainView

    let overViewUid = uuidv4()
    let state = new Tabs.State([new Tabs.TabData(overViewUid, "Overview"), ...previews])
    let view = new Tabs.View({
        state,
        contentView: (_, tabData: TabPreview) => tabData.id == overViewUid
            ? mainView
            : {
                tag: 'iframe',
                width: '100%',
                style: { aspectRatio: '1' },
                src: tabData.preview.applicationUrl(asset)
            },
        headerView: (_, tabData) => ({
            class: 'px-2 rounded border',
            innerText: tabData.name
        })
    })

    return view
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
