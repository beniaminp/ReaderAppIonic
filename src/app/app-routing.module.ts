import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'auth', pathMatch: 'full'},
    {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
    {path: 'reader', loadChildren: './reader/reader.module#ReaderPageModule'},
    {path: 'shelf', loadChildren: './shelf/shelf.module#ShelfPageModule'},
    {path: '**', redirectTo: 'auth'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
