import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRowEvent, CmsListComponent, DestroyedComponent, GenericFiltersComponent } from '@x-angular/cms';
import { UserService } from '../../services/users.service';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../../models/user.model';

@Component({
  selector: 'angular-core-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    CardModule,
    InputSwitchModule,
    TranslateModule,
    CmsListComponent,
    GenericFiltersComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent extends DestroyedComponent {
  @ViewChild(GenericFiltersComponent) filterComponent!: GenericFiltersComponent;
  public customViewChecked: boolean = false;

  constructor(public userService: UserService, private cdk: ChangeDetectorRef) {
    super();
    userService.rowAction$
      .pipe(takeUntil(this.destroyed))
      .subscribe((data: BaseRowEvent<User>) => {
        console.log('rowAction', data);
      });

    userService.resetFilters$
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.resetFilters();
      });
  }

  public applyFilters(): void {
    const filters = this.filterComponent.getFilters();
    this.userService.queryParams$.next(filters);
  }

  public resetFilters(): void {
    this.filterComponent.resetFilters();
    this.userService.queryParams$.next({});
  }

  public customViewChanged() {
    this.cdk.detectChanges();
  }

  public togglePaginator(): void {
    const { viewCmsPaginator$ } = this.userService;
    const { value } = viewCmsPaginator$;
    this.userService.viewCmsPaginator$.next(!value);
  }
}