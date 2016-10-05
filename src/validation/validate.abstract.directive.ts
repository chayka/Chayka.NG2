import { ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NlsService } from '../nls/nls.service';

/**
 * Base directive configuration
 */
export interface ValidateConfigInterface {
    /**
     * Message that is shown on error
     */
    message?: string,

    /**
     * Message that is shown during async validation
     */
    asyncMessage?: string,

    /**
     * If validation is active
     */
    isActive?: boolean,
}

/**
 * Base validation directive class
 */
export abstract class ValidateAbstractDirective {

    /**
     * User config
     *
     * @type {{}}
     */
    userConfig: any = {

    };

    /**
     * Default directive config
     *
     * @type {{}}
     */
    defaultConfig: any = {
        message: 'Need to define a default validation message inside implementation class!',
        isActive: true,
    };

    /**
     * Config getter
     *
     * @return {{}}
     */
    get config(): any {
        return Object.assign({}, this.defaultConfig, this.userConfig);
    }

    /**
     * NgModel which value is being assessed
     */
    @ContentChild(NgModel) ngModel: NgModel;

    /**
     * Get current input value, from [(ngModel)]
     *
     * @return {any|string}
     */
    getValue(): any {
        return this.ngModel.value;
    }

    constructor(protected nls: NlsService){

    }

    /**
     * Respond with
     *  true - when valid,
     *  false - when invalid,
     *  null - when async validation in progress
     *
     * Check if validation passes
     */
    abstract validate(): boolean | null ;

    /**
     * Get validation message
     */
    getMessage(messageConfigId: string = 'message'): string {
        return this.nls._(this.config[messageConfigId] || '', this.config);
    }
}