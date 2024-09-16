import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatLabel,
    MatSelectModule,
    MatExpansionModule,
    MatAccordion,
    MatExpansionPanelDescription,
    MatTableModule,
    ToastrModule.forRoot(), 
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarLabel,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatLabel,
    MatSelectModule,
    MatExpansionModule,
    MatAccordion,
    MatExpansionPanelDescription,
    MatTableModule,
  ],
})
export class MaterialModule { }
