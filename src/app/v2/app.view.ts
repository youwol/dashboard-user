import { VirtualDOM, child$ } from "@youwol/flux-view";
import { BurgerMenu, BurgerMenuSection, DashboardLink, Preferences, UserSettings, WorkspaceLink, YouwolBannerView } from "@youwol/flux-youwol-essentials";
import { filter } from "rxjs/operators";
;
import { AnnouncementsView, ApplicationsView, AppState, loginView, modalView, PackagesView, pageHeaderView, PageType, StoriesView } from "../utils.view";
import { SideBarView } from "./side-bar.view";




/**
 * Top banner of the application
 */
export class TopBannerView extends YouwolBannerView {

    //page$ = new BehaviorSubject<PageType>(PageType.applications)

    constructor(state: AppState) {

        super({
            customActionsView: {
                class: 'd-flex align-items-center justify-content-around flex-grow-1 flex-wrap',
                children: [loginView()]
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



class SideBarContent implements VirtualDOM {

    children: VirtualDOM[]

    constructor(state: AppState) {
        this.children = Object.values(PageType)
            .map(page => pageHeaderView(page, state.page$, 'my-3') as VirtualDOM)
    }
}
/**
 * Global application's view
 */
export class AppView implements VirtualDOM {

    public readonly state: AppState
    public readonly class = 'fv-bg-background fv-text-primary d-flex flex-column w-100 h-100'

    public readonly children: Array<VirtualDOM>

    constructor(params: { state: AppState }) {

        Object.assign(this, params)


        this.state.selection$.pipe(
            filter(asset => asset != undefined)
        ).subscribe(() => modalView(this.state))

        this.children = [
            new TopBannerView(this.state),
            {
                class: 'd-flex h-100 p-2',
                children: [
                    new SideBarView(this.state, new SideBarContent(this.state)),
                    child$(
                        this.state.page$,
                        (page: PageType) => {
                            return {
                                [PageType.applications]: () => {
                                    return new ApplicationsView(this.state)
                                },
                                [PageType.packages]: () => {
                                    return new PackagesView(this.state)
                                },
                                [PageType.stories]: () => {
                                    return new StoriesView(this.state)
                                },
                                [PageType.announcements]: () => {
                                    return new AnnouncementsView(this.state)
                                }
                            }[page]()
                        }
                    )
                ]
            }
        ]
    }
}
