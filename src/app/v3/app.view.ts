import { VirtualDOM, child$, attr$ } from "@youwol/flux-view";
import { BurgerMenu, BurgerMenuSection, DashboardLink, Preferences, UserSettings, WorkspaceLink, YouwolBannerView } from "@youwol/flux-youwol-essentials";
import { BehaviorSubject, combineLatest, merge, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AssetsGtwClient } from "../client/assets-gtw.client";
import { announcements, applications, assets, data, stories } from "../data";
;
import { AppState as AppStateBase, CardsView, loginView, modalView, pageHeaderView, PageType, SideBarSection } from "../utils.view";
import { SideBarView } from "./side-bar.view";



class SearchView implements VirtualDOM {

    class = 'd-flex align-items-center w-25 fv-bg-primary rounded'
    children: VirtualDOM[]
    style = { minWidth: '400px' }
    constructor(search$: Subject<string[]>) {

        this.children = [
            {
                tag: 'input',
                type: 'text',
                class: 'w-100',
                placeholder: 'search assets by tags',
                onkeydown: (ev: KeyboardEvent) => {
                    if (ev.key == "Enter") {
                        search$.next(ev.target['value'].split(" ").filter(d => d != "").map(keyword => keyword))
                    }
                    console.log(ev)
                }
            },
            {
                tag: 'i',
                class: 'fas fa-search px-2 fv-text-on-primary',

            }
        ]
    }
}
/**
 * Top banner of the application
 */
export class TopBannerView extends YouwolBannerView {

    constructor(state: AppState) {

        super({
            customActionsView: {
                class: 'd-flex align-items-center justify-content-around flex-grow-1 flex-wrap',
                children: [
                    new SearchView(state.tags$),
                    loginView()
                ]
            },
            burgerMenuView: new BurgerMenu({
                sections: [
                    new BurgerMenuSection({
                        items: [
                            new DashboardLink(),
                            new WorkspaceLink()
                        ]
                    }),
                    new BurgerMenuSection({
                        items: [
                            new UserSettings(),
                            new Preferences()
                        ]
                    }),
                ]
            })
        })
    }
}


class CheckableAssetTypeView implements VirtualDOM {

    class = 'd-flex align-items-center'
    children: VirtualDOM[]

    constructor(page: PageType, selection$: BehaviorSubject<boolean>) {

        this.children = [
            {
                class: 'rounded fv-pointer fv-color-primary fv-text-background fv-hover-text-background-alt',
                style: { width: '25px', height: '25px' },
                children: [{
                    tag: 'i',
                    class: attr$(
                        selection$,
                        (selected) => selected ? 'fv-text-secondary' : '',
                        { wrapper: (d) => `${d} fas fa-check w-100 text-center` }
                    )
                }],
                onclick: () => selection$.next(!selection$.getValue())
            },
            pageHeaderView(page, new BehaviorSubject(PageType.none), 'my-3 float:right')
        ]
    }
}


class SortingView implements VirtualDOM {

    tag = "select"
    children: Array<VirtualDOM>

    constructor() {
        this.children = [
            {
                tag: 'option',
                innerText: 'Popularity'
            },
            {
                tag: 'option',
                innerText: 'Publication date'
            },
            {
                tag: 'option',
                innerText: 'Name'
            }
        ]
    }
}

class SideBarContentView implements VirtualDOM {

    children: VirtualDOM[]

    applications$ = new BehaviorSubject(true)
    packages$ = new BehaviorSubject(false)
    stories$ = new BehaviorSubject(false)
    data$ = new BehaviorSubject(false)
    announcements$ = new BehaviorSubject(false)

    selectionAssetType$ = {
        [PageType.applications]: this.applications$,
        [PageType.packages]: this.packages$,
        [PageType.stories]: this.stories$,
        [PageType.data]: this.data$,
        [PageType.announcements]: this.announcements$
    }
    assetIds$ = combineLatest([this.applications$, this.packages$, this.stories$, this.data$, this.announcements$]).pipe(
        map(([appsSelected, packagesSelected, storiesSelected, dataSelected, announcementsSelected]) => {
            let all: { assetId: string }[][] = []
            if (appsSelected)
                all.push(applications)
            if (packagesSelected)
                all.push(assets)
            if (storiesSelected)
                all.push(stories)
            if (dataSelected)
                all.push(data)
            if (announcementsSelected)
                all.push(announcements)
            return all.flat().map(({ assetId }) => assetId)
        })
    )

    constructor() {

        let assetTypeView = {
            children: Object.values(PageType).filter(d => d != PageType.none)
                .map(page => new CheckableAssetTypeView(page, this.selectionAssetType$[page]))
        }

        this.children = [
            new SideBarSection({ title: "What kind of assets?", contentView: assetTypeView }),
            new SideBarSection({ title: "How to sort?", contentView: new SortingView() })
        ]
    }
}


export class AssetsView extends CardsView {


    constructor(state: AppState, assetIds: string[], tags: string[]) {

        console.log("Assets", assetIds)
        let assets$ = merge(...assetIds.map((assetId) => {
            return AssetsGtwClient.getAsset$(assetId, tags)
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

class AppState extends AppStateBase {

    tags$ = new BehaviorSubject([])
}

/**
 * Global application's view
 */
export class AppView implements VirtualDOM {

    public readonly state: AppState
    public readonly class = 'fv-bg-background fv-text-primary d-flex flex-column w-100 h-100'

    public readonly children: Array<VirtualDOM>

    constructor() {

        this.state = new AppState()


        this.state.selection$.pipe(
            filter(asset => asset != undefined)
        ).subscribe(() => modalView(this.state))

        let sideBarContent = new SideBarContentView()
        this.children = [
            new TopBannerView(this.state),
            {
                class: 'd-flex h-100 p-2',
                children: [
                    new SideBarView(this.state, sideBarContent),
                    child$(
                        combineLatest([sideBarContent.assetIds$, this.state.tags$]),
                        ([assetIds, tags]) => new AssetsView(this.state, assetIds, tags)
                    )
                ]
            }
        ]
    }
}
