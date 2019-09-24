import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-color-chooser',
    templateUrl: './color-chooser.component.html',
    styleUrls: ['./color-chooser.component.scss'],
})
export class ColorChooserComponent implements OnInit {
    @Output('colorChoosed')
    public colorChoosed: EventEmitter<string> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    setColor(s: string) {
        this.colorChoosed.next(s);
    }
}
