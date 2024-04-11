import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { Subject } from "rxjs";

@Component({ template: "" })
export abstract class DestroyedComponent implements OnInit {
  protected destroyRef = inject(DestroyRef);
  protected destroyed = new Subject();

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      this.destroyed.next({});
      this.destroyed.complete();
    });
  }
}
