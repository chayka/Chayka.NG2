import { Injectable } from "@angular/core";
import { ModalInterface } from "./modal.interface";

/**
 * This service is used to show modal dialogs like alerts, warnings, confirmations
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

    /**
     * Add an item to a queue and thus show a modal window.
     *
     * @param {ModalInterface} modal
     */
    show(modal: ModalInterface ): void {
        this.queue.push(modal);
    }


}