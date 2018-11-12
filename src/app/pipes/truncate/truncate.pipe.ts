import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number): string {
    //const limit: number = args.length < 2 ? +args[0] : 15;
    const trail: string = '...';

    return value.length > limit ? 
      value.substring(0, limit) + trail : 
      value;
  }

}
