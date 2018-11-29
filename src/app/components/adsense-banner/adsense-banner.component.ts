import { Component, OnInit } from '@angular/core';

import { environment }       from '@environments/environment';


@Component({
  selector: 'adsense-banner',
  templateUrl: './adsense-banner.component.html',
  styleUrls: ['./adsense-banner.component.scss']
})
export class AdsenseBannerComponent implements OnInit {

  public adClient: string = environment.adSenseConfig.google_ad_client;
  public adSlot: string = environment.adSenseConfig.google_ad_slot;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      try{ (window['adsbygoogle'] = window['adsbygoogle'] || []).push({
        google_ad_client: this.adClient,
        google_ad_slot: this.adSlot,
        enable_page_level_ads: environment.adSenseConfig.enable_page_level_ads
      }) }
      catch(e){ console.error("error", e) }
    }, 2000);
  }
}
