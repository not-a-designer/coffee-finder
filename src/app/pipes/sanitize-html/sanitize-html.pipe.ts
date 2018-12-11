import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'sanitizeHtml' })
export class SanitizeHtmlPipe implements PipeTransform {

  oldHtml: string;

  transform(value: string): string {

    const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
    const tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');
    //const reg: RegExp = /<(?:!--(?:(?:-*[^->])*--+|-?)|script\\b(?:[^"\'>]|"[^"]*"|\'[^\']*\')*>[\\s\\S]*?</script\\s*|style\\b(?:[^"\'>]|"[^"]*"|\'[^\']*\')*>[\\s\\S]*?</style\\s*|/?[a-z](?:[^"\'>]|"[^"]*"|\'[^\']*\')*)>gi
    do {
      this.oldHtml = value;
      value = value.replace(tagOrComment, ' ');
    } while (value !== this.oldHtml);

  return value.replace(/</g, '&lt;');
  }

}
