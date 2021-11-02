import { createObservableFromFetch } from "@youwol/flux-core"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"



export class Asset {

    public readonly assetId: string
    public readonly rawId: string
    public readonly kind: string
    public readonly name: string
    public readonly groupId: string
    public readonly description: string
    public readonly images: Array<string>
    public readonly thumbnails: Array<string>
    public readonly tags: Array<string>
    constructor(params:
        {
            treeId: string, assetId: string, rawId: string, kind: string, name: string, groupId: string,
            description: string, images: Array<string>, thumbnails: Array<string>, tags: Array<string>
        }) {

        Object.assign(this, params)
    }
}

export class AssetsGtwClient {


    static urlBaseAssets = '/api/assets-gateway/assets'

    static getAsset$(assetId: string): Observable<Asset> {
        let url = AssetsGtwClient.urlBaseAssets + `/${assetId}`
        let request = new Request(url)
        return createObservableFromFetch(request).pipe(
            map((asset: any) => new Asset(asset))
        )
    }
}
