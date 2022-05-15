import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MASCH_ICON_CLASS_PREFIX,
  MASCH_ICON_CLASS_SUFFIX,
} from './icon.module';

@Component({
  selector: 'masch-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaSchIconComponent {
  private _className$: BehaviorSubject<string | undefined>;

  constructor(
    @Inject(MASCH_ICON_CLASS_PREFIX) private _classPrefix: string | undefined,
    @Inject(MASCH_ICON_CLASS_SUFFIX) private _classSuffix: string | undefined
  ) {
    this._className$ = new BehaviorSubject<string | undefined>(undefined);
  }

  @Input()
  public set name(value: string | undefined) {
    if (value) {
      this._className$.next(`${this._classPrefix}${value}${this._classSuffix}`);
    }
  }

  @Input()
  public svgData?: string = 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z';

  @Input()
  public svgViewBox: string = '0 0 24 24';

  public get className$(): Observable<string | undefined> {
    return this._className$.asObservable();
  }
}
