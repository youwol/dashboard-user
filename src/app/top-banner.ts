
import { VirtualDOM } from "@youwol/flux-view"

import {
    BurgerMenu, BurgerMenuSection, DashboardLink,
    Preferences, UserSettings, WorkspaceLink, YouwolBannerView
} from "@youwol/flux-youwol-essentials"



export class TopBannerState {

    constructor() { }
}

/**
 * Main actions exposed in the [[TopBannerView]]
 */
export class BannerActionsView implements VirtualDOM {

    public readonly state: TopBannerState

    public readonly class = 'd-flex justify-content-around my-auto custom-actions-view'
    public readonly children: VirtualDOM[]

    constructor() {
    }
}

/**
 * Top banner of the application
 */
export class TopBannerView extends YouwolBannerView {

    constructor() {
        super({
            customActionsView: new BannerActionsView(),
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
