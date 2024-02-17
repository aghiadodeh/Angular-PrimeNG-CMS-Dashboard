import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'propertyKey', standalone: true })
export class PropertyKeyPipe implements PipeTransform {
  transform(e: any, propKey?: any) {
    let prop = e;
    if (propKey && e) {
      if (propKey.includes('.')) {
        const array = propKey.split('.');
        for (let i = 0; i < array.length; i++) {
          prop = prop[array[i]];
        }
        return prop;
      }
      return e[propKey];
    }
    return e;
  }
}
