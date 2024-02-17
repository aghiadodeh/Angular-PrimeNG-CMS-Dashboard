import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { FileConfiguration } from '../../../models/configurations/forms/file.configuration';
import { TranslateModule } from '@ngx-translate/core';

export interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'cms-upload-file',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FileUploadModule,
  ],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
})
export class UploadFileComponent {
  @Input() mode: FileUpload['mode'] = 'advanced';
  @Input() configuration!: FileConfiguration;
  @Input() styleClass?: FileUpload['styleClass'];
  @Input() chooseIcon?: string;
  @Input() auto: boolean = false;
  @Input() loading: boolean | null = false;
  @ViewChild(FileUpload) fileUpload!: FileUpload;
  @Output() filesChanged: EventEmitter<File | File[] | null> = new EventEmitter();

  public onSelect() {
    this.emitChanges();
  }

  public onRemove() {
    this.emitChanges();
  }

  private emitChanges() {
    const { files } = this.fileUpload;
    if (this.configuration.multiple != true) {
      this.filesChanged.emit(files.length > 0 ? files[0] : null);
    } else {
      this.filesChanged.emit(files);
    }
    if (this.configuration.auto || this.auto) {
      this.fileUpload?.clear();
    }
  }
}
