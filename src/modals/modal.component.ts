import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalButtonInterface } from './modal.interface';

/**
 * Modal Popup
 *
 * ```
 * <modal #modal1 [title]="'Cool modal box'" [visible]="false">
 *      <div>User Content</div>
 *      <button (click)="modal1.hide()">Ok</button>
 * </modal>
 *
 *
 * <button (click)="modal1.show()">Show cool modal box</button>
 *
 * <modal #modal2 [title]="'Cool box with buttons'" [buttons]="[{title:'Ok'}, {title: 'Cancel'}]" (close)="modalClosed($event)">
 *      <div>User Content</div>
 * </modal>
 *
 * <button (click)="modal2.show()">Show cool modal box with buttons</button>
 *
 *
 * <modal #modal3 [title]="'Url box'" [url]="'/agreement.html'" [buttons]="[{title:'Ok'}]" (close)="modalClosed($event)">
 *      <div>User Content</div>
 * </modal>
 *
 * <button (click)="modal3.show()">Show cool modal box with content fetched from url</button>
 *
 * ```
 *
 */
@Component({
    selector: 'modal',
    template: require('./modal.component.html'),
    styles: [ require('./modal.component.less') ],
})
export class ModalComponent {
    /**
     * Modal box title (header)
     *
     * @type {string}
     */
    @Input() title: string = '';

    /**
     * Set of buttons to be rendered
     *
     * @type {Array}
     */
    @Input() buttons: ModalButtonInterface[] = [];

    /**
     * Classes for modal box (ngClass style)
     *
     * @type {{}}
     */
    @Input() cls: any = {};

    /**
     * Css width property value
     *
     * @type {string}
     */
    @Input() width: string = '600px';

    /**
     * Css height property value
     *
     * @type {string}
     */
    @Input() height: string = 'auto';

    /**
     * Modal box is shown or hidden depending on this flag value
     *
     * @type {boolean}
     */
    @Input() visible: boolean = false;

    /**
     * Event emitter that emits 'close' event with button name as payload
     *
     * @type {EventEmitter<string>}
     */
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Show modal box
     */
    show(): void {
        this.visible = true;
    }

    /**
     * Hide modal box, emit 'close' event with payload.
     * @param payload
     */
    hide(payload: any): void {
        this.close.emit(payload);
        this.visible = false;
    }
}