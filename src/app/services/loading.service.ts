import {Injectable} from '@angular/core';
import {LoadingController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loading;
    private isLoaderPresent = false;

    constructor(private loadingController: LoadingController) {

    }

    public async showLoader() {
        if (!this.isLoaderPresent) {
            this.isLoaderPresent = true;
            this.loading = await this.loadingController.create();
            this.loading.present();
        }
    }

    public dismissLoader() {
        this.loading.dismiss();
        this.isLoaderPresent = false;
    }
}
