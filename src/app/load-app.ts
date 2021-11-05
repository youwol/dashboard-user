import { render } from "@youwol/flux-view";
import { AppView as AppViewV0 } from "./v0/app.view";
import { AppView as AppViewV1 } from "./v1/app.view";
import { AppView as AppViewV2 } from "./v2/app.view";
import { AppView as AppViewV3 } from "./v3/app.view";
import { AppState } from "./utils.view";


function getView(appState: AppState) {

    if (window.location.pathname.endsWith('/v0'))
        return new AppViewV0({ state: appState })

    if (window.location.pathname.endsWith('/v1'))
        return new AppViewV1({ state: appState })

    if (window.location.pathname.endsWith('/v2'))
        return new AppViewV2({ state: appState })

    if (window.location.pathname.endsWith('/v3'))
        return new AppViewV3()
    return new AppViewV0({ state: appState })
}

let appState = new AppState()
let appView = getView(appState)
document.getElementById("content").appendChild(render(appView))
