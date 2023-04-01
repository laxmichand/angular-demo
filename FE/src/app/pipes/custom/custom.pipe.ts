import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {
  nvalue: string ='';
  transform(value: string, ...args: string[]): unknown {
    this.nvalue = value.split('').reverse().join('');
    console.log(args)
    return this.nvalue;
  }

}
