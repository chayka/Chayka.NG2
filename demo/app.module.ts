import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { SpinnersModule } from '../src/spinners/spinners.module'
import { NlsModule } from "../src/nls/nls.module";
import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from "./app.routing";
import { HomePageComponent } from "./home.page/home.page.component";
import { NotFoundPageComponent } from "./not-found.page/not-found.page.component";
import { SpinnersPageComponent } from "./spinners.page/spinners.page.component";
import { NlsPageComponent } from "./nls.page/nls.page.component";
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NlsModule,
        SpinnersModule,

        routing
    ],
    declarations: [
        AppComponent,
        HomePageComponent,
        NotFoundPageComponent,
        NlsPageComponent,
        SpinnersPageComponent,
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }