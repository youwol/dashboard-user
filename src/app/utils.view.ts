import { attr$, child$, childrenAppendOnly$, VirtualDOM } from "@youwol/flux-view"
import { Button } from "@youwol/fv-button"
import { BehaviorSubject, merge, Observable, ReplaySubject, Subject } from "rxjs"
import { map } from "rxjs/operators"
import { Asset, AssetsGtwClient } from "./client/assets-gtw.client"
import { announcements, applications, assets, stories } from "./data"


export let panelBaseClasses = 'w-50 h-50 p-2 fv-text-primary d-flex flex-column'


export enum PageType {
    none = "none",
    applications = "flux-project",
    packages = "package",
    stories = "story",
    data = "data",
    announcements = "announcements"
}
let faClasses = {
    [PageType.applications]: "fas fa-play",
    [PageType.packages]: "fas fa-puzzle-piece",
    [PageType.stories]: "fas fa-book",
    [PageType.data]: "fas fa-database",
    [PageType.announcements]: "fas fa-bullhorn",
}
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


export class ButtonView extends Button.View {

    class = 'fv-btn fv-bg-secondary-alt fv-hover-bg-secondary'

    constructor(name: string, withClass: string = "") {
        super({ state: new Button.State(), contentView: () => ({ innerText: name }) })
        this.class = `${this.class} ${withClass}`
    }
}
export class IconButtonView extends Button.View {

    class = 'fv-btn fv-text-primary-alt fv-hover-text-focus p-0'

    constructor(faClass: string, withClass: string = "") {
        super({ state: new Button.State(), contentView: () => ({ class: faClass }) })
        this.class = `${this.class} ${withClass}`
    }
}


export function ywSpinnerView({ classes, size, duration }: { classes?: string, size: string, duration: number }) {
    let logoUrl = '/api/assets-gateway/raw/package/QHlvdXdvbC9mbHV4LXlvdXdvbC1lc3NlbnRpYWxz/latest/assets/images/logo_YouWol_white.png'

    return {
        class: classes || "",
        style: {
            width: size,
            height: size,
        },
        children: [
            {
                tag: 'img',
                class: `my-auto image`,
                src: logoUrl,
                style: {
                    position: 'absolute',
                    width: size,
                    height: size,
                    animation: `spin ${duration}s linear infinite`,
                }
            }
        ]
    }
}


export function pageHeaderView(page: PageType, page$: Subject<PageType>, withClasses = "") {
    let faClass = faClasses[page]
    let title = {
        [PageType.applications]: "Applications",
        [PageType.packages]: "Bricks",
        [PageType.stories]: "Stories",
        [PageType.data]: "Data",
        [PageType.announcements]: "Announcements",
    }[page]

    return {
        class: attr$(
            page$,
            (p: PageType) => p == page ? 'fv-text-secondary' : ' fv-hover-text-focus',
            { wrapper: (d) => `d-flex ${d} align-items-center mx-3 fv-pointer ${withClasses}` }
        ),
        children: [,
            {
                class: 'px-2',
                innerText: title
            },
            {
                class: faClass
            }
        ],
        onclick: () => page$.next(page)
    }
}


export function loginView() {

    return {
        class: `d-flex align-items-center w-25 justify-content-around`,
        style: { maxWidth: '250px' },
        children: [new ButtonView('login', 'mx-2 fv-text-primary'), new ButtonView('register', 'mx-2 fv-text-primary')]
    }
}

export interface AppStateInterface {

    selection$: Observable<string>
    unselect()
}


/**
 * Global application state, logic side of [[AppView]]
 */
export class AppState {

    public readonly selection$ = new ReplaySubject<string>(1)

    page$ = new BehaviorSubject<PageType>(PageType.applications)

    constructor() {
    }

    selectAsset(assetId: string) {
        this.selection$.next(assetId)
    }

    unselect() {
        this.selection$.next(undefined)
    }
}


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

export class CardsView {

    class = 'w-100 h-100 flex-grow-1 overflow-auto fv-text-primary d-flex flex-column position-relative'
    style = {
        backgroundColor: 'darkgray'
    }
    children: VirtualDOM[]

    constructor(
        state: AppState,
        assets$: Observable<Asset>,
        backgroundView: VirtualDOM
    ) {


        this.children = [
            backgroundView,
            {
                class: "position-absolute h-100 w-100",
                children: [
                    new AssetsListView(assets$.pipe(map(asset => [asset])), state)
                ]
            }
        ]
    }

}

export class ApplicationsView extends CardsView {


    constructor(state: AppState) {
        let assets$ = merge(...applications.map(({ assetId }) => {
            return AssetsGtwClient.getAsset$(assetId)
        }))
        super(state, assets$, {

            class: "h-100 w-100",
            style: {
                backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7oWwBRmPGqAamHHaepQbxsxrsfOMatdYIcw&usqp=CAU)",
                opacity: "0.1"
            }
        })
    }

}

export class PackagesView extends CardsView {

    constructor(state: AppState) {
        let assets$ = merge(...assets.map(({ assetId }) => {
            return AssetsGtwClient.getAsset$(assetId)
        }))
        super(state, assets$, {

            class: "h-100 w-100",
            style: {
                backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_2VMUwjtfzrRRFSIy9QTd1snq4jdf6ekjoA&usqp=CAU)",
                opacity: "0.1"
            }
        })
    }
}

export class StoriesView extends CardsView {

    constructor(state: AppState) {
        let assets$ = merge(...stories.map(({ assetId }) => {
            return AssetsGtwClient.getAsset$(assetId)
        }))
        super(state, assets$, {

            class: "h-100 w-100",
            style: {
                backgroundImage: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe6EZbq3ttSqGVYR_QLTFt3GJIIFfoUPF3Bw&usqp=CAU)",
                opacity: "0.1"
            }
        })
    }
}

export class AnnouncementsView extends CardsView {

    constructor(state: AppState) {
        let assets$ = merge(...announcements.map(({ assetId }) => {
            return AssetsGtwClient.getAsset$(assetId)
        }))
        super(state, assets$, {

            class: "h-100 w-100",
            style: {
                backgroundImage: "url(https://images.unsplash.com/photo-1527168027773-0cc890c4f42e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHBvc3QlMjBpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80)",
                opacity: "0.1"
            }
        })
    }
}

export class SideBarTitleView implements VirtualDOM {

    class = "fv-text-secondary"
    innerText: string
    style: { fontWeight: 'bolder' }

    constructor({ title }: { title: string }) {
        this.innerText = title
    }
}

export class SideBarSection implements VirtualDOM {

    class = "mb-3"
    children: Array<VirtualDOM>

    constructor({ title, contentView }: { title: string, contentView: VirtualDOM }) {
        this.children = [
            new SideBarTitleView({ title }),
            {
                children: [contentView]
            }
        ]
    }
}
