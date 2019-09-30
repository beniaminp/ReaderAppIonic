import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {ColorPalleteComponent} from "./color-pallete/color-pallete.component";
import {AppStorageService} from "../../er-local-storage/app-storage.service";
import {UserDTO} from "../../models/UserDTO";

@Component({
    selector: 'app-color-chooser',
    templateUrl: './color-chooser.component.html',
    styleUrls: ['./color-chooser.component.scss'],
})
export class ColorChooserComponent implements OnInit {
    @Output('colorChoosed')
    public colorChoosed: EventEmitter<string> = new EventEmitter();

    @Input('selectedColor')
    public selectedColor;

    constructor(private popoverController: PopoverController,
                public appStorageService: AppStorageService) {
    }

    ngOnInit() {
    }

    setColor(s: string) {
        this.colorChoosed.next(s);
    }

    async openPallete(ev) {
        const popover = await this.popoverController.create({
            component: ColorPalleteComponent,
            translucent: true,
            event: ev,
        });
        await popover.present();
        popover.onDidDismiss().then(
            (res) => {
                if (res.data != null) {
                    this.selectedColor = res.data.color;
                    this.setColor(res.data.color);
                }
            }
        )
    }
}
