import { Component }    from '@angular/core';

import { Platform }     from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar }    from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar) {
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    try {
      await this.platform.ready();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }
    catch(e) { console.error('initializeApp() error: ', e) }

    /*this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });*/
  }
}
