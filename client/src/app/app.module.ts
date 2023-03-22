import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LanguageSelectorComponent } from './navbar/language-selector/language-selector.component';
import { LanguageEnComponent } from './navbar/language-selector/language-en/language-en.component';
import { LanguageDeComponent } from './navbar/language-selector/language-de/language-de.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LanguageSelectorComponent,
    LanguageEnComponent,
    LanguageDeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
