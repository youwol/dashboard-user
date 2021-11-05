import { VirtualDOM, render } from "@youwol/flux-view";
import { Observable, of, Subject } from "rxjs";
import { ApplicationsView } from "./applications.view";
import { AssetsView } from "./assets.view";;
import { DetailsView } from "../details.view";
import { GeneralView } from "./general.view";
import { TopBannerView } from "../top-banner";
import { AppState } from "../utils.view";


/**
 * Global application's view
 */
export class AppView implements VirtualDOM {

    public readonly state: AppState
    public readonly class = 'fv-bg-background fv-text-primary d-flex flex-column w-100 h-100'

    public readonly children: Array<VirtualDOM>

    constructor(params: { state: AppState }) {

        Object.assign(this, params)

        this.children = [
            new TopBannerView(),
            {
                class: 'flex-grow-1 d-flex flex-wrap',
                style: { minHeight: '0px' },
                children: [
                    new GeneralView(),
                    new ApplicationsView(this.state),
                    new AssetsView(this.state),
                    new DetailsView(this.state)
                ]

            }
        ]
    }

}
