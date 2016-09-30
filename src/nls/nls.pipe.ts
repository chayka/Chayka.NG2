import { Pipe, PipeTransform } from '@angular/core';
import { NlsService } from './nls.service';

/**
 * NlsPipe is used to translate given string
 * using dictionaries of NlsService.
 *
 * Translations should be set beforehand
 * ```
 * NlsService.extendDictionary('ru-RU', {
 *      'Yes': 'Да',
 *      'min_length_message': 'минимальная длина строки составляет {{min}}'
 * })
 * ```
 *
 * Then you can use pipe in templates:
 * ```
 *  <button>{{'Yes' | nls}}</button>
 * ```
 *
 * Some templating can be used:
 * ```
 *  <div class="message">{{'min_length_message' | nls : {min: 8}}</div>
 * ```
 *
 * If translation is not found in current dictionary, default one (en-US) will be used.
 * If translation is not found in default dictionary, string itself will be used.
 */
@Pipe({name: 'nls', pure: false})
export class NlsPipe implements PipeTransform {

    constructor(private nls: NlsService){

    }

    transform(str: string, substituitions: any = {}){
        return this.nls._(str, substituitions);
    }
}