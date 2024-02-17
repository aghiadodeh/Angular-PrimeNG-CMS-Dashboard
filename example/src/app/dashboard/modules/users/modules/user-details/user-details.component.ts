import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsViewDetailsComponent, ViewDetailsComponent } from '@x-angular/cms';
import { User } from '../../../../../models/user.model';

@Component({
  selector: 'angular-core-user-details',
  standalone: true,
  imports: [
    CommonModule,
    CmsViewDetailsComponent
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent extends ViewDetailsComponent<User> {
  override title = (item: User) => item.name;
}
