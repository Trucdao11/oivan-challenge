import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { HouseServicesService } from '../services/house-services.service';
import { forkJoin  } from 'rxjs';
import _ from 'lodash';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-house-dashboard',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterLinkActive],
  templateUrl: './house-dashboard.component.html',
  styleUrl: './house-dashboard.component.scss',
  providers: [HouseServicesService]
})

export class HouseDashboardComponent {
  userInfo: any = {};
  displayedColumns = ['house_number', 'block_number', 'land_number', 'price', 'status', 'action'];
  dataSource: any;
  defaultImg = 'https://xaydunganthienphat.com.vn/upload/filemanager/mau%20nha/mau%20nha%20cap%204%20mai%20thai%203%20phong%20ngu/mau-nha-cap-4-mai-thai-3-phong-ngu-1-phong-tho-mau-so-2.jpg';
  public isEmpty = (obj: any) => JSON.stringify(obj) === '{}' || undefined;
  public houseList: any = [];
  public houseModelList: any = [];
  public filterSelectedList = [];
  public blockNumberList: any = [];
  public landNumberList:any = [];
  public priceList:any = [];
  public priceDecrease:any = [];
  public priceIncrease:any = [];
  constructor(private houseServices: HouseServicesService, private router: Router){
  }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
  
    forkJoin({
      houseModelList: this.houseServices.getHouseModelList(),
      houseList: this.houseServices.getHouseList()
    }).subscribe(
      ({ houseModelList, houseList }) => {
        this.houseModelList = houseModelList.data;
        this.houseList = houseList.data;
        console.log("🚀 ~ HouseDashboardComponent ~ ngOnInit ~ this.houseList:", this.houseList)
  
        // Generate lists
        this.generateDataHouseModelList();
        console.log("🚀 ~ HouseDashboardComponent ~ ngOnInit ~ this.houseModelList:", this.houseModelList)
  
        const houseAttributes = houseList.data.map((house: { attributes: any; }) => house.attributes);
        console.log("🚀 ~ HouseDashboardComponent ~ ngOnInit ~ houseAttributes:", houseAttributes)
  
        this.blockNumberList = _.uniq(houseAttributes.map((attr: { block_number: any; }) => {
          if(this.isAvailableHouse(attr) && attr.block_number && attr.block_number != undefined) {
            console.log(typeof attr.block_number);
            
            return attr.block_number;
          }
        }));
          console.log("🚀 ~ HouseDashboardComponent ~ this.blockNumberList=_.uniq ~ this.blockNumberList:", this.blockNumberList)

        this.landNumberList = _.uniq(houseAttributes.map((attr: { land_number: any; }) => {
            if(this.isAvailableHouse(attr) && attr.land_number && attr.land_number != undefined) {
              return attr.land_number;
            }
          }));
        this.priceList = _.uniq(houseAttributes.map((attr: { price: any; }) => {
          if(this.isAvailableHouse(attr) && attr.price && attr.price != undefined) {
            return attr.price;
          }
        }));
  
        this.priceIncrease = _.sortBy(this.priceList);
        this.priceDecrease = _.orderBy(this.priceList, [], ['desc']);
      },
      (error) => {
        console.error("Error occurred:", error);
      }
    );
  }
  
  ngAfterContentChecked(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const storedUserInfo = localStorage.getItem('userInfo');
      this.userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};
    }
    
  }

  getHouseList(){
    this.houseServices.getHouseList().subscribe({
      next: (res): any => {
        this.houseList = res.data;
      }, 
      error: () => {}
    })
  }

  getHouseModelList(){
    this.houseServices.getHouseModelList().subscribe({
      next: (res): any => {
        this.houseModelList = res.data;
      }, 
      error: () => {}
    })
  }

  createHouse(){
    this.router.navigate(['/new-house']);
  }

  filter(value: any, type: string) {
    console.log("🚀 ~ HouseDashboardComponent ~ _.map ~ (this.houseModelList:", (this.houseModelList))
    _.each(this.houseModelList, (houseModel) => {
      console.log("🚀 ~ HouseDashboardComponent ~ houseModel.houseList=_.filter ~  houseModel.houseLis:",  houseModel.houseList)
      // houseModel.houseList 
      let test = _.filter(houseModel.houseList, (house) => {
        console.log("🚀 ~ HouseDashboardComponent ~ houseModel.houseList=_.filter ~ house:", house)
        const price = house.attributes.price;
        console.log("🚀 ~ HouseDashboardComponent ~ houseModel.houseList=_.filter ~ price:", price)
  
        if (type === 'min_price') {
          console.log('111', _.filter(this.houseList, house => { house.attributes.price >= value}) )
          return price >= value;
        }
        if (type === 'max_price') {
          console.log('222', _.filter(this.houseList, () => { price <= value}) )
          return price <= value;
        }
        console.log("🚀 ~ HouseDashboardComponent ~ houseModel.houseList=_.filter ~ house.attributes[type]:", house.attributes[type])  
        return house.attributes[type] === value;
      });
      console.log("🚀 ~ HouseDashboardComponent ~ test ~ test:", test)
      console.log("🚀 ~ HouseDashboardComponent ~ houseModel.houseList=_.filter ~ houseModel.houseList:", houseModel.houseList)

    });
  }
  

  generateDataHouseModelList() {
    _.forEach(this.houseModelList, (houseModel) => {
      const { model: modelType, house_type: houseType } = houseModel.attributes;
  
      houseModel.houseList = _.filter(this.houseList, (house) => {
        const { model, status, house_type } = house.attributes;
        return model && status === 'available' && house_type === houseType && model === modelType;
      });
    });
  }

  isAvailableHouse(house: any){
    return house.model && house.status === 'available';
  }
  
}

