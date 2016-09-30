import { Component } from '@angular/core';
import { SpinnersService, SpinnerItemInterface } from './spinners.service';

/**
 * General Spinner, should be accessed via SpinnersService:
 * ```
 *  let postsSpinnerId = SpinnersService.show('Loading posts...');
 *  let usersSpinnerId = SpinnersService.show('Loading users...');
 *  ...
 *  SpinnersService.hide(postsSpinnerId);
 *  SpinnersService.hide(userSpinnerId);
 * ```
 *
 * In application there should be present one and only <general-spinner>
 * ```
 * <general-spinner></general-spinner>
 * ```
 */
@Component({
    selector: 'general-spinner',
    template: require('./general-spinner.component.html'),
    styles: [ require('./general-spinner.component.less') ]
})
export class GeneralSpinnerComponent {

    /**
     * Messages container
     *
     * @type {{id: string, message: string}[]}
     */
    private spinners: SpinnerItemInterface[] = [];

    /**
     * Spinner counter, used for id generation.
     *
     * @type {number}
     */
    private counter: number = 0;

    /**
     * Constructor subscribes to SpinnerService events and this way can be controlled only via service.
     *
     * @param {SpinnersService} service
     */
    constructor(
        private service: SpinnersService
    ){
        service.show$.subscribe(({id, message}: SpinnerItemInterface) => {
            this.show(message, id)
        });

        service.hide$.subscribe( (id: string) => {
            this.hide(id);
        })
    }

    /**
     * Adds message to a queue, returns spinner id.
     * When queue is non empty, the top item is shown.
     * On mouse over, whole stack is shown.
     *
     * @param {string} message
     * @param {string} id
     * @return {string}
     */
    private show(message: string = 'Loading...', id: string = ''): string {
        let spinner = {
            id: id || `gs_${++this.counter}`,
            message
        };
        this.spinners.push(spinner);
        return spinner.id;
    }

    /**
     * Removes message from stack.
     * When stack is empty, general spinner is hidden
     * @param id
     */
    protected hide(id: string): void {
        let index = this.spinners.findIndex(value => id === value.id);
        if(index >= 0){
            this.spinners.splice(index, 1);
        }
    }

}