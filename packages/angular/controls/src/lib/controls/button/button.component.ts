import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonIconPosition, ButtonType } from './button.models';

@Component({
  selector: 'masch-button',
  templateUrl: './button.component.html',
  styleUrls: ['../../index.scss', './button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaSchButtonComponent {
  @Input()
  public type: ButtonType = ButtonType.Elevated;

  @Input()
  public iconPos: ButtonIconPosition = ButtonIconPosition.Left;
}
