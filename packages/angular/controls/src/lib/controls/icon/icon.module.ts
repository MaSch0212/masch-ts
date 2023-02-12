import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MaSchIconComponent } from './icon.component';
import { IconMode, ModuleOptions } from './icon.models';

@NgModule({
  declarations: [MaSchIconComponent],
  imports: [CommonModule],
  exports: [MaSchIconComponent],
  providers: [],
})
export class MaSchIconModule {
  public static forRoot(
    options: ModuleOptions
  ): ModuleWithProviders<MaSchIconModule> {
    return {
      ngModule: MaSchIconModule,
      providers: [
        {
          provide: 'MASCH_ICON_MODULEOPTIONS',
          useValue: {
            defaultMode: IconMode.SvgData,
            ...options,
          } as ModuleOptions,
        },
      ],
    };
  }
}
