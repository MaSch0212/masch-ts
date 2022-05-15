import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { MaSchButtonModule, MaSchIconModule } from '@masch212/angular-controls';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MaSchButtonModule,
    MaSchIconModule.forRoot({}),
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
