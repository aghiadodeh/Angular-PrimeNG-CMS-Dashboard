import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericFormCreateComponent } from '@xangular/cms';

@Component({
  selector: 'angular-core-user-create',
  standalone: true,
  imports: [
    CommonModule,
    GenericFormCreateComponent,
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent {}
