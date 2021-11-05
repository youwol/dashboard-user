import { VirtualDOM } from "@youwol/flux-view"
import { Button } from "@youwol/fv-button"
import { ButtonView, panelBaseClasses } from "../utils.view"


let announcement = {
    content: {
        class: 'd-flex w-100 justify-content-around m-2 p-3',
        children: [
            {
                tag: 'img',
                width: '50',
                height: '50',
                src: 'https://pbs.twimg.com/media/EdD1gZxXsAA6fKD.png'
            },
            {
                class: 'w-75',
                children: [
                    {
                        class: 'text-justify',
                        innerHTML: `The geo-mechanics group is happy to welcome <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Ftwitter.com%2Ftessael_sas&psig=AOvVaw3OmVikjO236Lg4svVvM_h5&ust=1635973189281000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNCYsJjJ-vMCFQAAAAAdAAAAABAN">Tessael</a> as new collaborator!
                        <br>
                        Tessael is a company that provides cutting edges numerical solutions for remeshing.`
                    },
                    {

                    }]
            }
        ]
    },
    icon: '',
    storyId: ''
}

export class GeneralView {

    class = panelBaseClasses
    children: Array<VirtualDOM>

    constructor() {

        this.children = [{
            class: 'position-relative h-100 w-100 p-3',
            children: [
                {
                    class: 'w-100 h-100',
                    id: 'general'
                },
                {
                    class: 'position-absolute d-flex justify-content-around w-100 py-3 align-items-end',
                    style: { bottom: '10%' },
                    children: [
                        {
                            class: 'w-50 d-flex  justify-content-around align-items-center',
                            children: [
                                new ButtonView('login'),
                                new ButtonView('register')
                            ]
                        },
                        this.announcementView(announcement)
                    ]
                }
            ]
        }]
    }

    announcementView(announcement: { content: any }): VirtualDOM {

        return {
            class: 'w-50 border rounded mx-2 p-3',
            children: [
                {
                    class: 'w-100 text-center',
                    innerText: 'Announcement',
                    style: {
                        fontSize: 'x-large'
                    }
                },
                announcement.content,
                new ButtonView("More in the story 📖")
            ]
        }
    }
}
