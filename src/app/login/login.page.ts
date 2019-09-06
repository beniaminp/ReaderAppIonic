import {Component} from '@angular/core';
import {File} from '@ionic-native/file/ngx';
import {FileChooser} from "@ionic-native/file-chooser/ngx";
import {NavigationExtras, Router} from "@angular/router";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage {

    FB_APP_ID: number = 2392489640796829;

    constructor(
        private file: File,
        private fileChooser: FileChooser,
        private router: Router,
        public storage: Storage
        /* private fb: Facebook,
         private nativeStorage: NativeStorage,
         public loadingController: LoadingController,
         private platform: Platform,
         public alertController: AlertController*/
    ) {
        /*this.file.listDir(this.file.externalRootDirectory, '.')
            .then(_ => console.log('Directory exists'))
            .catch(err => console.log('Directory doesn"t exist'));*/
    }

    /*
        async doFbLogin() {
            const loading = await this.loadingController.create({
                message: 'Please wait...'
            });
            this.presentLoading(loading);

            if (!this.platform.is('cordova')) {
                this.router.navigate(["/user"]);
                loading.dismiss();
                return;
            }

            this.router.navigate(["/user"]);
            loading.dismiss();
            return;

            //the permissions your facebook app needs from the user
            const permissions = ["public_profile", "email"];

            this.fb.login(permissions)
                .then(response => {
                    let userId = response.authResponse.userID;
                    //Getting name and email properties
                    //Learn more about permissions in https://developers.facebook.com/docs/facebook-login/permissions

                    this.fb.api("/me?fields=name,email", permissions)
                        .then(user => {
                            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                            //now we have the users info, let's save it in the NativeStorage
                            this.nativeStorage.setItem('facebook_user',
                                {
                                    name: user.name,
                                    email: user.email,
                                    picture: user.picture
                                })
                                .then(() => {
                                    this.router.navigate(["/user"]);
                                    loading.dismiss();
                                }, error => {
                                    console.log(error);
                                    loading.dismiss();
                                })
                        })
                }, error => {
                    console.log(error);
                    if (!this.platform.is('cordova')) {
                        this.presentAlert();
                    }
                    loading.dismiss();
                });
        }

        async presentAlert() {
            const alert = await this.alertController.create({
                message: 'Cordova is not available on desktop. Please try this in a real device or in an emulator.',
                buttons: ['OK']
            });

            await alert.present();
        }

        async presentLoading(loading) {
            return await loading.present();
        }*/


    openBook() {
        /*this.file.listDir(this.file.dataDirectory, '').then(
            (res) => {
                res.forEach(foundfiles => {
                    console.error(res);
                    if (foundfiles.isDirectory && foundfiles.name.toLowerCase() == 'documents') {
                        this.file.listDir(foundfiles.nativeURL, '').then(
                            (res1) => {
                                console.error(res1);
                            }
                        )
                    }
                })
            }
        )*/
         this.fileChooser.open()
             .then(uri => {
                 console.error(uri);
                 this.storage.set('bookUri', uri).then(
                     (res) => {
                         this.router.navigate(["/user"]);
                     }
                 );
             })
             .catch(e => console.log(e));
    }
}
