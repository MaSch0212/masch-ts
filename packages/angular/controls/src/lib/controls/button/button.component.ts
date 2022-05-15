import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ButtonType } from './button-type.enum';

@Component({
  selector: 'masch-button',
  templateUrl: './button.component.html',
  styleUrls: ['../../index.scss', './button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MaSchButtonComponent {
  @Input()
  public type: ButtonType = ButtonType.Elevated;
}
