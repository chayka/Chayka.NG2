import { Injectable } from '@angular/core';
import { ModalInterface } from './modal.interface';
import { NlsService } from '../nls/nls.service';

/**
 * This service is used to show modal dialogs like alerts, warnings, confirmations.
 * The service utilizes <modals></modals> component that should be present only once on the page.
 */
@Injectable()
export class ModalsService {

    /**
     * Queue of modal popups. Only first one is showed a time.
     * When queue is empty, then no modals are shown.
     * To show modal, we need simply put something to this queue.
     *
     * @type {ModalInterface[]}
     */
    queue: ModalInterface[] = [];

    constructor(private nls: NlsService){}

    /**
     * Add an item to a queue and thus show a modal window.
     *
     * @param {ModalInterface} modal
     */
    show(modal: ModalInterface ): void {
        let defaults: ModalInterface = {
            content: '',
            title: '',
            buttons: [],
            cls: [],
            width: '600px',
            height: 'auto',
        };
        this.queue.push(Object.assign(defaults, modal));
    }

    /**
     * Show alert box - a message with 'Ok' button.
     * Callback is called when Ok is clicked.
     *
     * @param message
     * @param title
     * @param okCallback
     */
    alert(message: string, title: string = '', okCallback: () => void = null): void{
        this.show({
            content: message,
            title: title,
            cls: ['alert'],
            buttons: [{
                text: this.nls._('Ok'),
                click: okCallback
            }]
        });
    }

    /**
     * Show confirm box - a message with 'Yes' & 'No' buttons.
     * Callback is called when 'Yes' is clicked.
     *
     * @param message
     * @param title
     * @param yesCallback
     */
    confirm(message: string, title: string = '', yesCallback: () => void = null): void{
        this.show({
            content: message,
            title: title,
            cls: ['confirm'],
            buttons: [{
                text: this.nls._('No'),
            }, {
                text: this.nls._('Yes'),
                click: yesCallback
            }]
        });
    }

    /**
     * Close current modal popup, by shifting queue
     */
    close(): void {
        this.queue.shift();
    }

    getNgClass(classes: string[]): any {
        let ngClass = {};
        classes.forEach(cls => ngClass[cls] = true);
        return ngClass;
    }

}