import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'beautifyCode'
})
export class BeautifyCodePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
