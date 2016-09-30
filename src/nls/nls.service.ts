import { Injectable } from '@angular/core';

@Injectable()
export class NlsService {

    /**
     * Current locale identifier
     *
     * @type {string}
     */
    protected currentLocale: string = 'en-US';

    /**
     * Dictionaries
     *
     * @type {{}}
     */
    protected dictionaries: any = {
        'en-US': {
            'Yes': 'Yes',
            'No': 'No',
            'Ok': 'Ok',
            'Cancel': 'Cancel',
        },
        'ru-RU': {
            'Yes': 'Да',
            'No': 'Нет',
            'Ok': 'Хорошо',
            'Cancel': 'Отмена',
        }
    };

    /**
     * Set current locale identifier (e.g. 'en-US')
     *
     * @param locale
     */
    setLocale(locale: string): void {
        this.currentLocale = locale.replace('_', '-');
    }

    /**
     * Get current locale identifier
     *
     * @return {string}
     */
    getLocale(): string {
        return this.currentLocale;
    }

    /**
     * Get list of supported locales (registered dictionaries)
     * @return {string[]}
     */
    getSupportedLocales(): string[] {
        return Object.keys(this.dictionaries);
    }

    /**
     * Extend locale dictionary with translations
     *
     * @param {string} locale
     * @param {{}} dictionary
     */
    extendDictionary(locale: string, dictionary: any){
        locale = locale.replace('_', '-');
        this.dictionaries[locale] = this.dictionaries[locale] || {};
        Object.assign(this.dictionaries[locale], dictionary);
    }

    /**
     * Translate given string to locale.
     * If map of substitutions given, then translation
     * is treated as template and substitutions are applied.
     *
     * ```
     * nls._('{{a}} loves {{b}}', {a: 'developer', b: 'coding'});
     * --> 'developer loves coding'
     * ```
     *
     * @param {string} str
     * @param {{}} substitutions
     * @return {string}
     * @private
     */
    _(str: string, substitutions: any = {}){
        let locale = this.currentLocale;
        let dic = this.dictionaries[locale] || {};
        let defaultDic = this.dictionaries['en-US'] || {};
        let translation = dic[str] || defaultDic[str] || str;

        if(substitutions){
            Object.keys(substitutions).forEach(key => {
                translation = translation.replace(new RegExp('\{\{\s*'+key+'\s*\}\}', 'g'), ''+substitutions[key])
            });
        }

        return translation;
    }
}