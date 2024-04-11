import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageConfiguration } from "../../../models/configurations/forms/file.configuration";

@Component({
  selector: "cms-upload-image",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./upload-image.component.html",
  styleUrl: "./upload-image.component.scss",
})
export class UploadImageComponent {
  public file?: any;
  @Input() configuration!: ImageConfiguration;
  @Input() disabled: boolean = false;
  @Output() imageChanged: EventEmitter<File> = new EventEmitter();

  public onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageChanged.emit(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.file = reader.result;
      };
    }
  }
}
