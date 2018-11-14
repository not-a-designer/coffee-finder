import { Component }      from '@angular/core';
import { Router }         from '@angular/router';

import { Platform, 
         LoadingController, 
         ModalController, 
         AlertController, 
         ToastController, 
         ActionSheetController, 
         PopoverController, 
         MenuController}  from '@ionic/angular';
import { HeaderColor }    from '@ionic-native/header-color/ngx';
import { SplashScreen }   from '@ionic-native/splash-screen/ngx';
import { StatusBar }      from '@ionic-native/status-bar/ngx';


declare const navigator: any;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

  finalUrl: string;

  constructor(private platform: Platform,
              private actionsheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private menuCtrl: MenuController,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private router: Router,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private headerColor: HeaderColor) {
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    try {
      await this.platform.ready();

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.headerColor.tint('#3880ff');
      this.registerBackButtonAction();

    }
    catch(e) { console.error('initializeApp() error: ', e) }
  }

  private registerBackButtonAction(): void {
    this.platform.backButton.subscribe(async () => {
      // close action sheet
      try {
        const actionsheet = await this.actionsheetCtrl.getTop();
        if (actionsheet) actionsheet.dismiss();
        return;
      }
      catch (e) {console.error('actionsheetCtrl error: ', e)}
      // close popover
      try {
        const popover = await this.popoverCtrl.getTop();
        if (popover) popover.dismiss();
        return;
      }
      catch (e) { console.error('popoverCtrl error: ', e) }
      // close modal
      try {
          const modal = await this.modalCtrl.getTop();
          if (modal) modal.dismiss();
          return;
      }
      catch (e) {console.error('modalCtrl error: ', e) }
      // closes loading
      try {
        const loader = await this.loadingCtrl.getTop();
        if (loader) loader.dismiss();
        return;
      } 
      catch (e) { console.error('loadingCtrl error: ', e) }
      //closes toast
      try {
        const toast = await this.toastCtrl.getTop();
        if (toast) toast.dismiss();
        return;
      } 
      catch (e) { console.error('menuCtrl error: ', e) }
      // close side menus
      try {
          const sideMenu = await this.menuCtrl.getOpen();
          if (sideMenu !== null) sideMenu.close();
          return;
      } 
      catch (e) { console.error('menuCtrl error: ', e) }
    });
  }

  private async showExitAlert() {
    try {
      const exitAlert = await this.alertCtrl.create({
        header: 'Coffee Finder',
        message: 'Are you sure you would Like to quit?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => console.log('cancel quit')
          }, {
            text: 'Exit',
            handler: () => console.log('TODO Exit')
          }
        ]
      })
    }
    catch(e) { console.error('showExitAlert() error: ', e) }
  }


}
