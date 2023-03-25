import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_BUILDER } from '../routes';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(APP_ROUTE_BUILDER.root());
  }
}
