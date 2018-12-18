import { Component }     from '@angular/core';
import { Router }        from '@angular/router';

import { Platform, 
         LoadingController, 
         ModalController, 
         AlertController, 
         ToastController, 
         ActionSheetController, 
         PopoverController, 
         MenuController} from '@ionic/angular';
import { HeaderColor }   from '@ionic-native/header-color/ngx';
import { SplashScreen }  from '@ionic-native/splash-screen/ngx';
import { StatusBar }     from '@ionic-native/status-bar/ngx';


declare const navigator: any;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

  constructor(private actionsheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private headerColor: HeaderColor,
              private modalCtrl: ModalController,
              private menuCtrl: MenuController,
              private platform: Platform,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              private router: Router,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private toastCtrl: ToastController) { 
                
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    try {
      await this.platform.ready();
      //prevent errors if not cordova
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.headerColor.tint('#3880ff');
        this.registerBackButtonAction();
      }
    }
    catch(e) { console.error('initializeApp() error: ', e) }
  }

  private registerBackButtonAction(): void {
    this.platform.backButton.subscribe(async () => {
      try {
        //check for overlays
        const overlay: any = await (this.loadingCtrl.getTop() ||
          this.toastCtrl.getTop() ||
          this.actionsheetCtrl.getTop() ||
          this.alertCtrl.getTop() ||
          this.popoverCtrl.getTop() ||
          this.modalCtrl.getTop());

        if (overlay) overlay.dismiss();
        else {
          //check for sideMenu
          const menu = await this.menuCtrl.getOpen();
          if (menu !== null) menu.close();
          else {
            //redirect urls
            if (this.router.url.includes('login') || 
              this.router.url.includes('register') || 
              this.router.url.includes('tos') || 
              this.router.url.includes('privacy')) this.router.navigateByUrl('/tabs/settings');
            if (this.router.url.includes('settings')) this.router.navigateByUrl('/tabs/map');
            if (this.router.url.includes('map')) this.router.navigateByUrl('/tabs/home');
            //show quitAlert
            else this.showExitAlert;
          }
        }
      }
      catch(e) { console.log(e) }
    });
  }

  private async showExitAlert(): Promise<void> {
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
            handler: () => {
              console.log('TODO Exit');
              navigator['app]'].exitApp();
            }
          }
        ]
      });
      await exitAlert.present();
    }
    catch(e) { console.error('showExitAlert() error: ', e) }
  }
}
