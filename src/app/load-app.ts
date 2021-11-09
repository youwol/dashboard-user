import { render } from "@youwol/flux-view";
import { AppView } from "./views/app.view";


let appView = new AppView()
document.getElementById("content").appendChild(render(appView))
