import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaSchIconComponent } from './icon.component';

export const MASCH_ICON_CLASS_PREFIX = new InjectionToken<string | undefined>(
  'MaSchIconClassPrefix'
);
export const MASCH_ICON_CLASS_SUFFIX = new InjectionToken<string | undefined>(
  'MaSchIconClassSuffix'
);

export interface MaSchIconModuleOptions {
  iconClassPrefix?: string;
  iconClassSuffix?: string;
}

@NgModule({
  declarations: [MaSchIconComponent],
  imports: [CommonModule],
  exports: [MaSchIconComponent],
})
export class MaSchIconModule {
  static forRoot(
    options: MaSchIconModuleOptions
  ): ModuleWithProviders<MaSchIconModule> {
    return {
      ngModule: MaSchIconModule,
      providers: [
        { provide: MASCH_ICON_CLASS_PREFIX, useValue: options.iconClassPrefix },
        { provide: MASCH_ICON_CLASS_SUFFIX, useValue: options.iconClassSuffix },
      ],
    };
  }
}
