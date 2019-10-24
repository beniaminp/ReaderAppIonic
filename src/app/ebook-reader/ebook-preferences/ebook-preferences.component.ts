import {Component, OnInit} from '@angular/core';
import {ModalController, PopoverController} from "@ionic/angular";
import {EbookVisualSettingsComponent} from "../ebook-visual-settings/ebook-visual-settings.component";
import {EbookControlSettingsComponent} from "../ebook-control-settings/ebook-control-settings.component";

@Component({
    selector: 'app-ebook-preferences',
    templateUrl: './ebook-preferences.component.html',
    styleUrls: ['./ebook-preferences.component.scss'],
})
export class EbookPreferencesComponent implements OnInit {

    constructor(private popoverController: PopoverController,
                public modalController: ModalController) {
    }

    ngOnInit() {
    }

    public async openVisualSettings() {
        const modal = await this.modalController.create({
            component: EbookVisualSettingsComponent,
            showBackdrop: true,
            backdropDismiss: true,
            cssClass: 'modal'
        });
        modal.present();

        this.popoverController.dismiss();
    }

    public async openControlSettings() {
        const modal = await this.modalController.create({
            component: EbookControlSettingsComponent,
            showBackdrop: true,
            backdropDismiss: true,
            cssClass: 'modal'
        });
        modal.present();

        this.popoverController.dismiss();
    }
}
