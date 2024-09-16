import { Routes } from '@angular/router';
import { HouseDetailsComponent } from './house-dashboard/house-details/house-details/house-details.component';
import { HouseDashboardComponent } from './house-dashboard/house-dashboard.component';
import { houseGuard } from './house.guard';

export const routes: Routes = [
    { path: '', component: HouseDashboardComponent },
    { path: 'house-details/:id', component: HouseDetailsComponent, canActivate: [houseGuard], redirectTo: '' },
    { path: 'new-house', component: HouseDetailsComponent, canActivate: [houseGuard], redirectTo: '' },
    {path: '**', redirectTo: ''}
];
