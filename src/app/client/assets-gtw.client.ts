import { createObservableFromFetch } from "@youwol/flux-core"
import { userInfo } from "node:os"
import { Observable, of } from "rxjs"
import { delay, filter, map } from "rxjs/operators"
import { announcements } from "../data"


export interface Permissions {
    read: boolean
    write: boolean
}

export interface Group {
    id: string
    path: string
}

export interface UserInfo {
    groups: Group[]
}

export interface Asset {

    readonly assetId: string
    readonly rawId: string
    readonly kind: string
    readonly name: string
    readonly groupId: string
    readonly description: string
    readonly images: Array<string>
    readonly thumbnails: Array<string>
    readonly tags: Array<string>
    readonly permissions: Permissions
}

export class AssetsGtwClient {

    static urlBase = '/api/assets-gateway'
    static urlBaseAssets = `${AssetsGtwClient.urlBase}/assets`

    static getAsset$(assetId: string, tags: string[] = []): Observable<Asset> {

        tags = tags.map(t => t.toLowerCase())
        let filterByTags = filter((asset: Asset) => {
            if (tags.length == 0)
                return true
            return tags
                .map((target) => asset.tags.find(assetTag => assetTag.toLowerCase().includes(target)))
                .filter(d => d).length > 0
        })

        if (assetId.startsWith("announcement_")) {
            return of(announcements.find(asset => asset.assetId == assetId)).pipe(
                filterByTags
            )
        }
        let url = AssetsGtwClient.urlBaseAssets + `/${assetId}`
        let request = new Request(url)
        return createObservableFromFetch(request).pipe(
            filterByTags
        )
    }

    static getUserGroups$(): Observable<Group[]> {

        let url = `${AssetsGtwClient.urlBase}/user-info`
        let request = new Request(url)
        return createObservableFromFetch(request).pipe(
            map((userInfo: UserInfo) => userInfo.groups)
        )
    }
}
