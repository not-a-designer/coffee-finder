import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'reverseTruncate'
})
export class ReverseTruncatePipe implements PipeTransform {

  transform(value: string, limit: number): any {
    const trail: string = '...';
    
    return (value.length > limit) ?
      trail + value.substring(limit, value.length):
      value;
  }

}
