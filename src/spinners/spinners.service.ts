import { Injectable, EventEmitter } from '@angular/core';

export interface SpinnerItemInterface{
    id: string,
    message: string,
}

@Injectable()
export class SpinnersService {

    /**
     * Spinner counter, used for id generation.
     *
     * @type {number}
     */
    private counter: number = 0;

    /**
     * Event emitter to show general spinner
     */
    show$: EventEmitter<SpinnerItemInterface>;

    /**
     * Event emitter to hide general spinner
     */
    hide$: EventEmitter<string>;

    /**
     * Constructor
     */
    constructor(){
        this.show$ = new EventEmitter<SpinnerItemInterface>();
        this.hide$ = new EventEmitter<string>();
    }

    /**
     * Adds spinner with message to a general spinner queue.
     * Returns id that can be used to hide that spinner from general spinner queue.
     *
     * @param message
     * @return {string}
     */
    show(message: string): string {
        let id = `spinners_${++this.counter}`;
        this.show$.emit({id, message});
        return id;
    }

    /**
     * Hide spinner from general spinner queue.
     * Uses id returned by show(message) command.
     *
     * @param id
     */
    hide(id: string): void{
        this.hide$.emit(id);
    }
}