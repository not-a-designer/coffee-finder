import { Component }   from '@angular/core';
import { Router }       from '@angular/router';

import { ThemeService } from '@app-services/theme/theme.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public router: Router, public themes: ThemeService) {}
}
