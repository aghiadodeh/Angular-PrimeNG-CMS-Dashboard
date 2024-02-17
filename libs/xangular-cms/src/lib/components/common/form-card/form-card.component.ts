import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-form-card',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="flex flex-column w-full h-screen overflow-y-auto surface-ground align-items-center justify-content-center">
    <!-- form card -->
    <div class="flex flex-column surface-card p-4 shadow-2 border-round w-full h-full lg:w-6 lg:p-6 lg:h-auto">
        <div class="text-center">
            <!-- logo -->
            <img src="assets/images/logo.png" alt="Image" height="125" class="mb-3 fadein animation-duration-1000">
            <div class="text-900 text-3xl font-medium mb-3">{{ title }}</div>
        </div>
        <!-- content -->
        <ng-content select="[content]"></ng-content>
    </div>
</div>
  `,
})
export class FormCardComponent {
  @Input() title: string = '';
  @Input() cssClass: string = 'h-screen';
}
