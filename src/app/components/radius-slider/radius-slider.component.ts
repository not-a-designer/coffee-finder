import { Component, OnInit }            from '@angular/core';

import { NavParams, PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-radius-slider',
  templateUrl: './radius-slider.component.html',
  styleUrls: ['./radius-slider.component.scss']
})
export class RadiusSliderComponent implements OnInit {

  public radius: number;

  constructor(private navParams: NavParams, private popoverCtrl: PopoverController) { }

  public ngOnInit(): void {
    this.radius = this.navParams.get('currentRadius');
    console.log('radius received: ', this.radius);
  }

  public updateRadius(event): void {
    this.radius = event.detail.value;
    this.dismiss();
  }

  public async dismiss(): Promise<void> {
    try {
      const data = { radius: this.radius }
      await this.popoverCtrl.dismiss(data);
    }
    catch(e) { console.log('dismiss error: ', e) }
  }

}
