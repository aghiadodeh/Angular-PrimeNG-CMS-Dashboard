import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericFormUpdateComponent, ViewDetailsComponent } from '@x-angular/cms';
import { User } from '../../../../../models/user.model';

@Component({
  selector: 'angular-core-user-update',
  standalone: true,
  imports: [
    CommonModule,
    GenericFormUpdateComponent,
  ],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.scss',
})
export class UserUpdateComponent extends ViewDetailsComponent<User> {
  override title = (item: User) => `${item.firstName} ${item.lastName}`;
}
