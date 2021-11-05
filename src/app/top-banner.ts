
import { VirtualDOM } from "@youwol/flux-view"

import {
    BurgerMenu, BurgerMenuSection, DashboardLink,
    Preferences, UserSettings, WorkspaceLink, YouwolBannerView
} from "@youwol/flux-youwol-essentials"



/**
 * Top banner of the application
 */
export class TopBannerView extends YouwolBannerView {

    constructor() {
        super({
            customActionsView: {},
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
