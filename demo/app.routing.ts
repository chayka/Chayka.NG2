import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NlsPageComponent } from "./nls.page/nls.page.component";
import { SpinnersPageComponent } from "./spinners.page/spinners.page.component";
import { HomePageComponent } from "./home.page/home.page.component";
import { NotFoundPageComponent } from "./not-found.page/not-found.page.component";
import { ModalsPageComponent } from './modals.page/modals.page.component';
import { AjaxPageComponent } from './ajax.page/ajax.page.component';
import { ValidationPageComponent } from './validation.page/validation.page.component';

const appRoutes: Routes = [
    { path: 'nls', component: NlsPageComponent },
    { path: 'spinners', component: SpinnersPageComponent },
    { path: 'modals', component: ModalsPageComponent },
    { path: 'ajax', component: AjaxPageComponent },
    { path: 'validation', component: ValidationPageComponent },
    { path: '', component: HomePageComponent },
    { path: '**', component: NotFoundPageComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);