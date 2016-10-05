import {Component} from '@angular/core';
import { AjaxService } from '../../src/ajax/ajax.service';
import { SpinnerComponent } from '../../src/spinners/spinner.component';

@Component({
    template: require('./ajax.page.component.html'),
    styles: [ require('./ajax.page.component.less') ]
})
export class AjaxPageComponent {

    items: string[] = [];

    constructor(
        private ajax: AjaxService
    ){

    }

    makeSimpleRequest(){
        this.ajax.get('/api/empty.json').subscribe(
            data => {
                console.dir({data});
            },
            err => console.dir(err)
        );
    }

    makeGetRequest(){
        let url = this.ajax.buildGetQueryUrl('/api/empty.json', {
            myFlag: true,
            pi: Math.PI,
            pkg: 'Chayka',
            fruits: ['pineapple', 'apple'],
            now: new Date(),
            emptiness: null,
            undef: undefined,
            data: {
                one: 'one',
                two: {
                    two: 'two'
                },
            },
            'Full Name': 'Chayka Framework',
        });
        console.log(url);
        this.ajax.get(url).subscribe(
            data => {
                console.dir({data});
            },
            err => console.dir(err)
        );
    }

    requestItems(){
        this.ajax.get<string[]>('/api/ppap.json').subscribe(
            ppap => {
                ppap.forEach(item => this.items.push('I have ' + item));
            },
            err => console.dir(err)
        );
    }

    requestBrokenItems(){
        this.ajax.get<string[]>('/api/gibberish.broken-json').subscribe(
            ppap => {
                (ppap || []).forEach(item => this.items.push('I have ' + item));
            },
            err => console.dir(err)
        );
    }

    requestPostItems(){
        this.ajax.post<string[]>('/api/ppap.json', {test: 'test'}).subscribe(
            ppap => {
                ppap.forEach(item => this.items.push('I have ' + item));
            },
            err => console.dir(err)
        );
    }

    requestPlainPostItems(){
        this.ajax.post<string[]>('/api/ppap.json', this.ajax.buildQuery({test: 'test'}), {
            errorMessage: 'You are stubborn, aren\'t you?'
        }).subscribe(
            ppap => {
                ppap.forEach(item => this.items.push('I have ' + item));
            },
            err => console.dir(err)
        );
    }

    /**
     * Heads up, spinner will appear as soon a 'source' is created,
     * but the real request will be sent only when 'subscribe' is issued.
     *
     * To avoid showing spinner, use 'spinner': false
     */
    requestWithCustomSpinner(spinner: SpinnerComponent){
        let source = this.ajax.get('/api/empty.json', {
            spinner: spinner,
            spinnerMessage: 'Oooh, Shiny!!!',
            successMessage: 'woo hoo!'
        });

        setTimeout(() => {
            source.subscribe(
                data => {
                    console.dir({data});
                },
                err => console.dir(err)
            );
        }, 1000);

    }

}
