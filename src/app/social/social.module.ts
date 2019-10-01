import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {PeopleComponent} from "./people/people.component";
import {PendingConnectionsComponent} from "./pending-connections/pending-connections.component";
import {MyConnectionsComponent} from "./my-connections/my-connections.component";

const routes: Routes = [
    {
        path: 'people',
        component: PeopleComponent
    },
    {
        path: 'pending-connections',
        component: PendingConnectionsComponent
    },
    {
        path: 'my-connections',
        component: MyConnectionsComponent
    }
];

@NgModule({
    declarations: [
        PeopleComponent,
        PendingConnectionsComponent,
        MyConnectionsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ]
})
export class SocialModule {
}
