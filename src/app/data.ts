import { PageType } from "./utils.view"


export let applications = [

    {
        // remeshing & smoothing
        assetId: "ZTRhN2UyMGYtNzBkMy00ZDg5LWJhZjItZWYzZDVlMDRkYzA3"
    },
    {
        // plotly simple example
        assetId: "YjZmN2FlNGItYzEwNi00NTdjLTlkZTEtMmM5NGFlZWE1OTg2"
    },
    {
        // nested components
        assetId: "ODQ0ZGIzMjAtYWUwYy00ZWFjLTg3N2EtN2RmYTBiNDY4MDEw"
    }
]


export let assets = [
    {
        // PMP
        assetId: "UUhsdmRYZHZiQzltYkhWNExYQnRjQT09"
    },/*
    {
        // CodeMirror
        assetId: "UUhsdmRYZHZiQzltYkhWNExXTnZaR1V0YldseWNtOXk="
    },
    {
        // FluxFiles
        assetId: "UUhsdmRYZHZiQzltYkhWNExXWnBiR1Z6"
    },
    {
        // FluxRxjs
        assetId: "UUhsdmRYZHZiQzltYkhWNExYSjRhbk09"
    },
    {
        // FluxThree
        assetId: "UUhsdmRYZHZiQzltYkhWNExYUm9jbVZs"
    },
    {
        // FluxFvWidgets
        assetId: "UUhsdmRYZHZiQzltYkhWNExXWjJMWGRwWkdkbGRITT0="
    },*/

]

export let stories = [
    {
        assetId: "NTI2ZGUwNDItMGQxMS00YWI1LTk4NDQtNmJkNGIxZWI1NmZl"
    }
]

export let data = [
    {
        // skull
        assetId: "NWJkMDEwMGItNjhlMi00MTNjLWFmMTAtNzJmYTBiZGY1NjAz"
    },
    {
        // mandibula
        assetId: "MjM5YzdjZGEtNTI4Ny00YzkzLTljNGQtNDE4N2FjZGI4YWI5"
    },
    {
        // bunny
        assetId: "ZjRlNzNlMWMtMGNlZS00NmE4LTlkYTMtOWEwNDc5ZmJkYTMy"
    }
]



export let announcements = [
    {
        assetId: "announcement_0",
        rawId: "announcement_0",
        kind: "announcement",
        name: "Tessael",
        groupId: "L3lvdXdvbC11c2Vycy95b3V3b2wtZGV2cy95b3V3b2wtYWRtaW5z",
        description: `The geo-mechanics group is happy to welcome <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Ftwitter.com%2Ftessael_sas&psig=AOvVaw3OmVikjO236Lg4svVvM_h5&ust=1635973189281000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNCYsJjJ-vMCFQAAAAAdAAAAABAN">Tessael</a> as new collaborator!
        <br>Tessael is a company that provides cutting edges numerical solutions for remeshing.`,
        images: [
            './tessael.jpg',
            "GeO2_maillage_geologique.jpg"
        ],
        thumbnails: ['./tessael.jpg'],
        tags: []
    }
]

export let assetsByPage = {
    [PageType.applications]: applications,
    [PageType.packages]: assets,
    [PageType.data]: data,
    [PageType.stories]: stories,
    [PageType.announcements]: announcements,
}
