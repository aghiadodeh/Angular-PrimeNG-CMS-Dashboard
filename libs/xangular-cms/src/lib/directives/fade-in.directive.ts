import { Directive, ElementRef, Renderer2, OnInit } from "@angular/core";

@Directive({
  selector: "[cmsFadeIn]",
  standalone: true,
})
export class FadeInDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, "opacity", "0");
    this.renderer.setStyle(this.el.nativeElement, "transition", "opacity 1.0s ease");

    this.el.nativeElement.onload = () => {
      this.renderer.setStyle(this.el.nativeElement, "opacity", "1");
    };
  }
}
