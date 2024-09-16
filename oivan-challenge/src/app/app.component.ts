import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HouseDashboardComponent } from './house-dashboard/house-dashboard.component';
import { HeaderComponent } from './header/header/header.component';
import { MaterialModule } from './material/material.module';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HouseDashboardComponent, HeaderComponent, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent {
  title = 'oivan-challenge';
  constructor() {}

}
