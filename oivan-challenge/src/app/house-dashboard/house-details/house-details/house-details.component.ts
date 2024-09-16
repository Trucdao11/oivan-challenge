import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HouseServicesService } from '../../../services/house-services.service';
import _ from 'lodash';
import { combineLatest } from 'rxjs';
import { MatSnackBar, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-house-details',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterLinkActive],
  templateUrl: './house-details.component.html',
  styleUrl: './house-details.component.scss',
  providers: []
})
export class HouseDetailsComponent {
  public houseId: any;
  public houseInfo: any = {
    attributes: {
      block_number: '',
      house_number: '',
      land_number: '',
      house_type: '',
      model: '',
      price: '',
      status: ''
    }
  };
  public houseNumber: any;
  public houseList: any;
  public houseModelList: any;
  public houseModelNameList: any;
  private _snackBar = inject(MatSnackBar);
  public message:any;
  
  constructor(private route: ActivatedRoute, private router: Router, private houseServices: HouseServicesService){}

  ngOnInit(): void {
    this.houseId = this.route.snapshot.paramMap.get('id');
    combineLatest({
      houseModelList: this.houseServices.getHouseModelList(),
      houseList: this.houseServices.getHouseList()
    }).subscribe(({ houseModelList, houseList }) => {
      
      const { data: houseModels } = houseModelList;
      const { data: houses } = houseList;
      
      this.houseList = houses;
  
      // Get list of house models
      this.houseModelNameList = houseModels.map((houseModel: { attributes: { model: any; }; }) => houseModel.attributes.model);
      
      // If houseId exists, find houseInfo and houseNumber
      if (this.houseId) {
        this.houseInfo = _.find(houses, house => house.id === this.houseId);
        this.houseNumber = this.houseInfo?.attributes.house_number;
      }
    });
  }
  
  save(){
    if(this.houseId){
      this.houseServices.updateHouse(this.houseInfo).subscribe({
        complete: () => {
          this._snackBar.open('Update house successful!');
        }
      })
    } else {
      this.houseInfo.type = 'houses',
      this.houseServices.createHouse(this.houseInfo).subscribe({
        complete: () => {
          this._snackBar.open('Create house successful!');

        }
      })
    }

  }

  isCheckExistHouseNumber(houseNumber: any){
    const houseNumberExistArr = this.houseList.map((house: { attributes: { house_number: any; }; }) => {return house.attributes.house_number});
    return houseNumberExistArr.includes(houseNumber);
  }



}
