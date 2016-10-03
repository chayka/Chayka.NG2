import { Component } from '@angular/core';
import { ModalsService } from './modals.service';
import { ModalInterface } from './modal.interface';

/**
 * This component is used to show modal popups generated using ModalsService.
 * You need to put a single <modals></modals> element on the page in order for
 * ModalService to work.
 * As well you need to import ModalsService to main AppComponent.
 */
@Component({
    selector: 'modals',
    template: require('./modals.component.html'),
    styles: [ require('./modals.component.less') ],
})
export class ModalsComponent {
    constructor(public modals: ModalsService){

    }

    getModal(): ModalInterface {
        return this.modals.queue.length ? this.modals.queue[0] : {content: ''};
    }

    close(){
        this.modals.close()
    }
}