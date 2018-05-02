import { Injectable, Input, EventEmitter, Output } from "@angular/core";
import { TranslateService } from 'ng2-translate';


@Injectable()
export class LangService {
    @Output() langTransmitter: EventEmitter<any> = new EventEmitter();
    public loaded = false;
    public currentLangage;
    constructor(public translateService: TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translateService.setDefaultLang('en');
    }

    //init the langage of the app
    initLangage() {
        if (!this.loaded) {
            this.setLangage('he');
        }
        else {
            this.setLangage(this.currentLangage);
        }
    }

    //set the langage of the app
    setLangage(langage) {
        this.translateService.use(langage);
        this.currentLangage = langage;
        this.loaded = true;
        var config = { direction: 'ltr', textAlign: 'left', floatDirection: 'left' };
        if (langage == 'he') {
            config.direction = 'rtl';
            config.textAlign = 'right';
            config.floatDirection = 'right';
        }
        this.langTransmitter.emit(config);
    }

    //get the langage of the app
    getLangage() {
        return this.translateService.currentLang;
    }

}