import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanitizeDirections'
})
export class SanitizeDirectionsPipe implements PipeTransform {

  transform(value: any): string {
    const bCheck: RegExp = /\<(\/?)b\>/g;
    const divStartCheck = /\<(div.*?)\>/g;
    const divEndCheck: RegExp = /\<\/div\>/;
    const spaceCheck: RegExp = /\&nbsp\;/g;

    value = value.replace(spaceCheck, ' ');
    value = value.replace(bCheck, '');
    value = value.replace(divStartCheck, '.\n');
    value = value.replace(divEndCheck, '');

    return value;
  }
}
