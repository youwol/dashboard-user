import { child$, VirtualDOM } from "@youwol/flux-view";
import { Tabs } from "@youwol/fv-tabs";
import { combineLatest } from "rxjs";
import { AppState } from "../app.state";
import { ButtonView, PageType } from "../utils.view";
import { AssetsView } from "./assets.view";


let headerViewFactory = {
    [PageType.applications]: () => {
        return {
            class: 'd-flex justify-content-center my-2',
            children: [
                new ButtonView({ name: 'New application', withClass: 'fv-text-primary', enabled: true })
            ]
        }
    },
    [PageType.stories]: () => {
        return {
            class: 'd-flex justify-content-center my-2',
            children: [
                new ButtonView({ name: 'New story', withClass: 'fv-text-primary', enabled: true })
            ]
        }
    }
}
class MySpaceTab extends Tabs.TabData {

    constructor() {
        super('my-space', 'My space')
    }

    headerView() {
        return {
            class: 'px-3 fv-color-primary rounded',
            innerText: this.name
        }
    }

    contentView(state: AppState) {

        return {
            class: 'w-100 h-100',
            children: [
                child$(
                    combineLatest([
                        state.assetIds$,
                        state.tags$
                    ]),
                    ([assetIds, tags]) => {
                        let page = state.selectedPage$.getValue()
                        let headerView = headerViewFactory[page]?.()
                        return new AssetsView({ state, assetIds, tags, headerView: headerView })
                    }
                )
            ]
        }
    }
}

class YouWolTab extends Tabs.TabData {

    constructor() {
        super('showroom', 'Showroom')
    }

    headerView() {
        return {
            class: 'px-3 fv-color-primary rounded',
            innerText: this.name
        }
    }

    contentView(state) {
        return {
            class: 'w-100 h-100',
            children: [
                child$(
                    combineLatest([
                        state.assetIds$,
                        state.tags$
                    ]),
                    ([assetIds, tags]) => new AssetsView({ state, assetIds, tags })
                )
            ]
        }
    }
}

export class ContentView implements VirtualDOM {

    class = "w-100 h-100"
    children: VirtualDOM[]

    static tabsData = [
        new YouWolTab(),
        new MySpaceTab()
    ]
    constructor(state: AppState) {

        let tabState = new Tabs.State(ContentView.tabsData)
        let view = new Tabs.View({
            state: tabState,
            contentView: (tabState, tabData) => tabData.contentView(state),
            headerView: (tabState, tabData) => tabData.headerView(),
            class: 'd-flex h-100 flex-column'
        } as any)
        this.children = [
            view
        ]
    }
}
