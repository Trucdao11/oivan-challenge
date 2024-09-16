import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [AuthService, HttpClient]
})
export class HeaderComponent {
  public username: String = '';
  public passWord: String = '';
  public userInfo = {}
  public isEmpty = (obj: any) => JSON.stringify(obj) === '{}' || undefined;
  private _snackBar = inject(MatSnackBar);

  constructor(private toastr: ToastrService, private authService: AuthService) {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (typeof window !== 'undefined' && localStorage) {
      this.getInfoUser()
    }

  }

  valid() {
    if (this.username != '' && this.passWord != '') {
      return true;
    }
    return false;
  }

  login() {
    if (!this.valid()) { return; }
    this.userInfo = {
      username: this.username,
      password: this.passWord
    }
    this.authService.login(this.userInfo).subscribe({
      next: res => {
        this._snackBar.open('Login successful! Welcome my website .');
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        this.authService.setToken(res.data.attributes.token);
        this.getInfoUser();
      },
      error: err => {
        this.userInfo = {}
        this._snackBar.open('Login failed')
        if (err && err.error) {
          _.each(err.error.errors, (err: { detail: string | undefined; }) => {
            this._snackBar.open(err.detail|| '')
          })
        }
      }
    }); return;
  }
  logout() {
    localStorage.removeItem('userInfo');
    this.username = '';
    this.passWord = '';
    this.getInfoUser()

  }

  getInfoUser() {
    const storedUserInfo = localStorage.getItem('userInfo');
    this.userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};
  }


}
