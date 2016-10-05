import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SpinnersModule } from '../spinners/spinners.module';
import { ModalsModule } from '../modals/modals.module';
import { AjaxService } from './ajax.service';
import { NlsModule } from '../nls/nls.module';

/**
 * Module that handles http requests, does response parsing, shows spinners and errors
 */
@NgModule({
    imports: [ HttpModule, SpinnersModule, ModalsModule, NlsModule ],
    providers: [ AjaxService ]
})
export class AjaxModule {

}