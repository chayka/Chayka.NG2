import {Component, Input} from '@angular/core';

/**
 * Component Spinner, shows progress indicator for long async operations
 *
 * ```
 * <spinner>Loading...</spinner>
 *
 * <spinner [visible]="true" [mode]="visibility" [message]="Loading"></spinner>
 * ```
 *
 * TODO: implement multi messages for long requests
 * ```
 * <spinner [messages]="{'Loading...': 5, 'Request is taking a little longer than expected...': 10, 'Just a little longer...': 0}"></spinner>
 * ```
 */
@Component({
    selector: 'spinner',
    template: require('./spinner.component.html'),
    styles: [ require('./spinner.component.less') ]
})
export class SpinnerComponent {

    @Input() public message: string = '';
    @Input() public messages: any;
    @Input() public visible: boolean = false;
    @Input() public mode: string = 'display';

    public show(message: string = ''): void {
        if(message){
            this.message = message;
        }
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }
}