import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NlsPageComponent } from "./nls.page/nls.page.component";
import { SpinnersPageComponent } from "./spinners.page/spinners.page.component";
import { HomePageComponent } from "./home.page/home.page.component";
import { NotFoundPageComponent } from "./not-found.page/not-found.page.component";

const appRoutes: Routes = [
    { path: 'nls', component: NlsPageComponent },
    { path: 'spinners', component: SpinnersPageComponent },
    { path: '', component: HomePageComponent },
    { path: '**', component: NotFoundPageComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);