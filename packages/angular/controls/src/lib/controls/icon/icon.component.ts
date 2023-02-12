import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IconMode, ModuleOptions } from './icon.models';

@Component({
  selector: 'masch-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaSchIconComponent {
  private readonly _data$: BehaviorSubject<string | undefined>;
  private readonly _mode$: BehaviorSubject<IconMode>;
  private _icon?: string;

  public Mode = IconMode;

  constructor(
    @Inject('MASCH_ICON_MODULEOPTIONS')
    private readonly _config: ModuleOptions
  ) {
    console.log(_config);
    this._mode$ = new BehaviorSubject<IconMode>(
      _config.defaultMode || IconMode.SvgData
    );
    this._data$ = new BehaviorSubject<string | undefined>(undefined);
  }

  @Input()
  public set icon(value: string | undefined) {
    this._icon = value;
    this.refreshData();
  }

  @Input()
  public set mode(value: IconMode) {
    this._mode$.next(value);
    this.refreshData();
  }
  public get mode$(): Observable<IconMode> {
    return this._mode$.asObservable();
  }

  @Input()
  public size: number = 24;

  public get data$(): Observable<string | undefined> {
    return this._data$.asObservable();
  }

  private refreshData(): void {
    let nextData: string | undefined;

    if (!this._icon) {
      nextData = undefined;
    } else {
      switch (this._mode$.value) {
        case IconMode.IconFont:
          nextData = '';
          if (this._config.additionalClasses) {
            nextData += `${this._config.additionalClasses} `;
          }
          if (this._config.classPrefix) {
            nextData += this._config.classPrefix;
          }
          nextData += this._icon;
          if (this._config.classSuffix) {
            nextData += this._config.classSuffix;
          }
          break;
        case IconMode.SvgData:
        case IconMode.SvgUrl:
          nextData = this._icon;
          break;
        default:
          throw Error(`Invalid icon mode: ${this._mode$.value}.`);
      }
    }

    this._data$.next(nextData);
  }
}
