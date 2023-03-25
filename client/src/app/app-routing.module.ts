import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_ROUTE_PATHS } from './routes';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { UiDemoPageComponent } from './ui-demo-page/ui-demo-page.component';
import { LearnPageComponent } from './learn-page/learn-page.component';

const routes: Routes = [
  { path: APP_ROUTE_PATHS.root, component: LandingPageComponent },
  { path: APP_ROUTE_PATHS.uiDemo, component: UiDemoPageComponent },
  { path: APP_ROUTE_PATHS.learn, component: LearnPageComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
