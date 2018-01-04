import * as cheerio from 'cheerio';

export class CheerioManager{
    //更改cheerioStatic
    changeCheerioStatic(text:string):CheerioStatic{
        return cheerio.load(text);
    }
}