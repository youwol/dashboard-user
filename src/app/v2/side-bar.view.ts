import { VirtualDOM } from "@youwol/flux-view";
import { AppState, pageHeaderView, PageType } from "../utils.view";




export class SideBarView implements VirtualDOM {

    class = "fv-bg-background"

    children: VirtualDOM[]

    constructor(state: AppState, contentView: VirtualDOM) {

        this.children = [contentView]
    }
}
