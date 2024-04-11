import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "functionPipe", standalone: true })
export class FunctionPipe implements PipeTransform {
  transform(func?: Function | undefined, ...params: any) {
    if (func) {
      return func(...params);
    }
    return null;
  }
}
