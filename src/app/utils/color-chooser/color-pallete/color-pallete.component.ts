import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
    selector: 'app-color-pallete',
    templateUrl: './color-pallete.component.html',
    styleUrls: ['./color-pallete.component.scss'],
})
export class ColorPalleteComponent implements OnInit {

    constructor(private popoverController: PopoverController) {
    }

    ngOnInit() {
    }


    setColor(s: string) {
        this.popoverController.dismiss({color: s});
    }
}
