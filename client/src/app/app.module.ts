import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LanguageSelectorComponent } from './navbar/language-selector/language-selector.component';
import { LanguageEnComponent } from './navbar/language-selector/language-en/language-en.component';
import { LanguageDeComponent } from './navbar/language-selector/language-de/language-de.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TbUiModule } from './taskbase-ui/tb-ui.module';
import { UiDemoPageComponent } from './ui-demo-page/ui-demo-page.component';
import { LearnPageComponent } from './learn-page/learn-page.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LanguageSelectorComponent,
    LanguageEnComponent,
    LanguageDeComponent,
    LandingPageComponent,
    UiDemoPageComponent,
    LearnPageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, TbUiModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
