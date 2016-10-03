import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { SpinnersModule } from '../src/spinners/spinners.module'
import { NlsModule } from '../src/nls/nls.module';
import { ModalsModule } from '../src/modals/modals.module';
import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from "./app.routing";
import { HomePageComponent } from './home.page/home.page.component';
import { NotFoundPageComponent } from './not-found.page/not-found.page.component';
import { SpinnersPageComponent } from './spinners.page/spinners.page.component';
import { NlsPageComponent } from './nls.page/nls.page.component';
import { ModalsPageComponent } from './modals.page/modals.page.component';
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NlsModule,
        SpinnersModule,
        ModalsModule,

        routing
    ],
    declarations: [
        AppComponent,
        HomePageComponent,
        NotFoundPageComponent,
        NlsPageComponent,
        SpinnersPageComponent,
        ModalsPageComponent
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }