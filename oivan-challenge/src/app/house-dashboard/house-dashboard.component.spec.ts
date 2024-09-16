import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'
import { HouseDashboardComponent } from './house-dashboard.component';
import { HouseServicesService } from '../services/house-services.service';
import { of, throwError } from 'rxjs';

describe('HouseDashboardComponent', () => {
  let component: HouseDashboardComponent;
  let fixture: ComponentFixture<HouseDashboardComponent>;
  let houseServicesService: jasmine.SpyObj<HouseServicesService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HouseServicesService', ['getHouseList', 'getHouseModelList']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HouseDashboardComponent],
      providers: [
        { provide: HouseServicesService, useValue: spy }
      ]
    });
    await TestBed.configureTestingModule({
      imports: [HouseDashboardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HouseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    houseServicesService = TestBed.inject(HouseServicesService) as jasmine.SpyObj<HouseServicesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data correctly on ngOnInit', () => {
    const mockHouseModelList = { data: [{ id: 1, attributes: { model: 'Model A', house_type: 'Type A' } }] };
    const mockHouseList = { data: [
        { attributes: { block_number: 101, land_number: 201, price: 120000, model: 'Model A', status: 'available', house_type: 'Type A' } }
      ] };
    houseServicesService.getHouseModelList.and.returnValue(of(mockHouseModelList));
    houseServicesService.getHouseList.and.returnValue(of(mockHouseList));

    component.ngOnInit();
    expect(houseServicesService.getHouseModelList).toHaveBeenCalled();
    expect(houseServicesService.getHouseList).toHaveBeenCalled();
    expect(component.houseModelList).toEqual(mockHouseModelList.data);
    expect(component.houseList).toEqual(mockHouseList.data);
    expect(component.blockNumberList).toEqual([101]);
    expect(component.landNumberList).toEqual([201]);
    expect(component.priceList).toEqual([120000]);
  });

  it('should handle errors during initialization', () => {
    houseServicesService.getHouseModelList.and.returnValue(throwError(() => new Error('Failed to load')));
    houseServicesService.getHouseList.and.returnValue(throwError(() => new Error('Failed to load')));
    
    spyOn(console, 'error');
    component.ngOnInit();

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith("Error occurred:", jasmine.any(Object));
  });

  it('should retrieve user info from localStorage on ngAfterContentChecked', () => {
    const userInfo = { name: "John" };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(userInfo));

    component.ngAfterContentChecked();

    expect(component.userInfo).toEqual(userInfo);
  });

  it('should have empty userInfo if no localStorage data', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    component.ngAfterContentChecked();

    expect(component.userInfo).toEqual({});
  });

  describe('createHouse', () => {
    it('should navigate to new-house route', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      component.createHouse();
      expect(routerSpy).toHaveBeenCalledWith(['/new-house']);
    });
  });

  describe('filter', () => {
    beforeEach(() => {
      component.houseModelList = [
        { houseList: [{ attributes: { price: 100, block_number: 'A' } }], attributes: {} },
      ];
    });

    it('should filter by minimum price', () => {
      component.filter(50, 'min_price');
      expect(component.houseModelList[0].houseList.length).toBe(1);

      component.filter(150, 'min_price');
      expect(component.houseModelList[0].houseList.length).toBe(0);
    });

    it('should filter by maximum price', () => {
      component.filter(150, 'max_price');
      expect(component.houseModelList[0].houseList.length).toBe(1);

      component.filter(50, 'max_price');
      expect(component.houseModelList[0].houseList.length).toBe(0);
    });

  });

});
