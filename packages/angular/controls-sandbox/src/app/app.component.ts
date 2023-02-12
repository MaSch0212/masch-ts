import { Component } from '@angular/core';
import { IconMode } from '@masch212/angular-controls';
import { mdiHome } from '@mdi/js';

@Component({
  selector: 'masch212-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public IconMode = IconMode;
  public testIcon = mdiHome;
}
