import { attr$, child$, VirtualDOM } from "@youwol/flux-view"
import { BehaviorSubject } from "rxjs"
import { mergeMap } from "rxjs/operators"
import { AppState } from "../app-state"
import { Asset, AssetsGtwClient } from "../client/assets-gtw.client"
import { headerView, panelBaseClasses } from "../utils.view"


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

function presentationView(asset: Asset): VirtualDOM {

    let selectedSnippet$ = new BehaviorSubject<number>(0)
    selectedSnippet$.next(0)

    return {
        class: "w-100 p-3 h-100 overflow-auto fv-text-primary d-flex",
        children: [
            snippetsView(asset),
            {
                class: 'flex-grow-1 d-flex',
                children: [
                    {
                        class: 'w-50',
                        children: [
                            {
                                class: "d-flex justify-content-center w-100 px-2",
                                tag: 'img',
                                src: attr$(selectedSnippet$, (index) => asset.images[index]),
                                style: { 'margin-top': 'auto', 'margin-bottom': 'auto', }
                            }
                        ]
                    },
                    textColumn(asset)
                ],
            }
        ]
    }
}


export function snippetsView(asset: Asset) {

    let selectedSnippet$ = new BehaviorSubject<number>(0)

    return {
        class: 'h-100', style: { width: '150px', 'min-width': '150px', 'max-width': '150px' },
        children: [
            {
                children: asset.thumbnails.map((thumbnail, index) => {
                    let baseClasses = "d-flex justify-content-center w-100 fv-border"
                    return {
                        class: 'd-fex align-items-center mb-2 position-relative',
                        children: [
                            {
                                class: attr$(
                                    selectedSnippet$,
                                    selected => selected == index ? baseClasses + " fv-color-focus" : baseClasses
                                ),
                                tag: 'img',
                                src: thumbnail,
                                style: { 'margin-top': 'auto', 'margin-bottom': 'auto', },
                                onclick: () => selectedSnippet$.next(index)
                            }
                        ]
                    }
                })
            }
        ]
    }
}
export function preview(asset: Asset) {

    let selectedSnippet$ = new BehaviorSubject<number>(0)
    selectedSnippet$.next(0)

    return {
        snippets: {
            class: 'h-100', style: { width: '150px', 'min-width': '150px', 'max-width': '150px' },
            children: [
                {
                    children: asset.thumbnails.map((thumbnail, index) => {
                        let baseClasses = "d-flex justify-content-center w-100 fv-border"
                        return {
                            class: 'd-fex align-items-center mb-2 position-relative',
                            children: [
                                {
                                    class: attr$(
                                        selectedSnippet$,
                                        selected => selected == index ? baseClasses + " fv-color-focus" : baseClasses
                                    ),
                                    tag: 'img',
                                    src: thumbnail,
                                    style: { 'margin-top': 'auto', 'margin-bottom': 'auto', },
                                    onclick: () => selectedSnippet$.next(index)
                                }
                            ]
                        }
                    })
                }
            ]
        },
        view: {
            class: 'w-50',
            children: [
                {
                    class: "d-flex justify-content-center w-100 px-2",
                    tag: 'img',
                    src: attr$(selectedSnippet$, (index) => asset.images[index]),
                    style: { 'margin-top': 'auto', 'margin-bottom': 'auto', }
                }
            ]
        }
    }
}

function textColumn(asset: Asset) {

    return {
        class: 'w-50 d-flex flex-column px-4',
        children: [
            title(asset),
            tags(asset),
            description(asset)
        ]
    }
}


function title(asset: Asset) {

    let edition$ = new BehaviorSubject<boolean>(false)
    let value$ = new BehaviorSubject<string>(asset.name)
    return child$(
        edition$,
        edited => {
            return edited
                ? {
                    class: 'd-flex align-items-center py-2',
                    children: [
                        {
                            tag: 'input',
                            class: 'w-100 text-center fv-text-on-background',
                            value: asset.name,
                            style: { 'font-size': 'x-large' },
                            onchange: (ev) => { value$.next(ev.target.value) }
                        }
                    ]
                }
                : {
                    class: 'd-flex align-items-center',
                    children: [
                        {
                            class: 'w-100 text-center fv-text-primary',
                            innerText: asset.name,
                            style: { 'font-size': 'xx-large' }
                        }
                    ]
                }
        }
    )
}

function description(asset: Asset) {

    return {
        class: 'w-100  py-2',
        children: [
            {
                class: 'd-flex align-items-center',
                children: [
                    {
                        class: 'fv-text-focus',
                        innerText: 'Description',
                        style: { 'font-size': 'larger' }
                    }
                ]
            },
            {
                class: 'w-100 text-justify fv-text-primary',
                innerHTML: asset.description,
                style: { 'font-size': 'large' }
            }
        ]
    }
}

function tagView(asset: Asset, tag: string) {

    return {
        class: 'd-flex align-items-center px-2',
        children: [
            {
                class: 'border fv-color-primary mx-1 px-2',
                innerText: tag
            }
        ]
    }
}

function tags(asset: Asset) {
    return {
        class: 'w-100 py-2',
        children: [
            {
                class: 'd-flex align-items-center',
                children: [
                    {
                        class: 'fv-text-focus',
                        innerText: 'Tags',
                        style: { 'font-size': 'larger' }
                    }
                ]
            },
            {
                class: 'w-100 text-justify fv-text-primary d-flex flex-wrap my-2',
                children: asset.tags.map((tag) => tagView(asset, tag))
            }
        ]
    }
}

