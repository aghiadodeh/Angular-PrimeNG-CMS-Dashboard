import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from './services/users.service';
import { CmsService } from '@xangular/cms';
import { User } from '../../../models/user.model';

@Component({
  selector: 'angular-core-users',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [
    DatePipe,
    UserService,
    {
      provide: CmsService<User>,
      useExisting: UserService,
    },
  ]
})
export class UsersComponent { }
