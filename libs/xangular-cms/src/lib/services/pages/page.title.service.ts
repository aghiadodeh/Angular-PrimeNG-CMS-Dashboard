import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from "rxjs/operators";
import { TranslationService } from '../../modules/translation/services/translation.service';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  private prefix = "Angular";

  constructor(
    private translationService: TranslationService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private router: Router,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data && child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          } else {
            return null;
          }
        }
        return null;
      })
    ).subscribe((data: any) => {
      this.setTitle(data);
    });
  }

  public setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  public setTitle(title?: string) {
    if (title) {
      this.translationService.get(title).subscribe((string: any) => {
        const title = this.prefix != "" ? `${this.prefix} | ${string}` : string;
        this.titleService.setTitle(title);
      })
    } else {
      this.titleService.setTitle(this.prefix);
    }
  }
}
