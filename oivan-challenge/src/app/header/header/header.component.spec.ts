import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let matSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = jasmine.createSpyObj('AuthService', ['login', 'setToken']);
    matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    window.localStorage = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getInfoUser if localStorage has a value', () => {
      spyOn(component, 'getInfoUser');
      const localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue('someData');
      component.ngOnInit();
      expect(component.getInfoUser).toHaveBeenCalled();
    });
  
    it('should not call getInfoUser if localStorage is empty', () => {
      spyOn(component, 'getInfoUser');
  
      const localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
      component.ngOnInit();
      expect(component.getInfoUser).not.toHaveBeenCalled();
    });
  });
  
  describe('valid', () => {
    it('should return true if username and password are not empty', () => {
      component.username = 'admin';
      component.passWord = 'p@ssword';
      expect(component.valid()).toBeTrue();
    });

    it('should return false if either username or password is empty', () => {
      component.username = '';
      component.passWord = 'testpass';
      expect(component.valid()).toBeFalse();
    });
  });

  describe('login', () => {
    beforeEach(() => {
      // Mock dependencies
      spyOn(component, 'valid').and.returnValue(true); // Assume valid form by default
      spyOn(component, 'getInfoUser');
      spyOn(authService, 'login');
      spyOn(authService, 'setToken');
      spyOn(matSnackBar, 'open');
      spyOn(localStorage, 'setItem');
    });
  
    it('should not proceed if valid returns false', () => {
      spyOn(component, 'valid').and.returnValue(false);
      component.login();
      expect(authService.login).not.toHaveBeenCalled();
    });
  
    it('should call authService.login and handle response', () => {
      authService.login.and.returnValue(of({ data: { attributes: { token: 'fake-token' }}}));
      component.login();
      expect(authService.login).toHaveBeenCalled();
      expect(matSnackBar.open).toHaveBeenCalledWith('Login successful! Welcome my website .');
      expect(authService.setToken).toHaveBeenCalledWith('fake-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
      expect(component.getInfoUser).toHaveBeenCalled();
    });
  
    it('should handle login error', () => {
      const errorResponse = { error: { errors: [{ detail: 'Login failed due to server error' }] } };
      authService.login.and.returnValue(throwError(() => errorResponse));
      component.login();
  
      expect(matSnackBar.open).toHaveBeenCalledWith('Login failed');
      expect(matSnackBar.open).toHaveBeenCalledWith('Login failed due to server error');
    });
  });
  

  describe('logout', () => {
    beforeEach(() => {
      spyOn(component, 'getInfoUser');
    });

    it('should clear user data and call getInfoUser', () => {
      component.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('userInfo');
      expect(component.username).toBe('');
      expect(component.passWord).toBe('');
      expect(component.getInfoUser).toHaveBeenCalled();
    });
  });

  describe('getInfoUser', () => {
    it('should set userInfo from localStorage if present', () => {
      const userInfo = { username: 'test', password: 'pass' };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(userInfo));

      component.getInfoUser();

      expect(component.userInfo).toEqual(userInfo);
    });

    it('should set userInfo as empty object if nothing in localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(null));
      component.getInfoUser();

      expect(component.userInfo).toEqual({});
    });
  });
});
