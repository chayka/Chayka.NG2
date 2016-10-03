import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NlsModule } from '../nls/nls.module';
import { ModalsService } from './modals.service';
import { ModalComponent } from './modal.component';
import { ModalsComponent } from './modals.component';

/**
 * Module, responsible for modal windows
 */
@NgModule({
    imports: [ CommonModule, NlsModule ],
    declarations: [ ModalComponent, ModalsComponent ],
    exports: [ ModalComponent, ModalsComponent],
    providers: [ ModalsService ],
})
export class ModalsModule {

}