import { Injectable, Inject } from '@angular/core';
import { DOCUMENT }           from '@angular/common';

import * as Color             from 'color';


interface IColor {
  [color: string]: string;
}

export const DEFAULTS: IColor = {
  primary: '#643001', //'#488aff',//'#3880ff',
  secondary: '#C55F01', //'#32db64',//'#0cd1e8',
  tertiary: '#bc833d', //'#f4a942',//'#7044ff',
  success: '#7D9871', //'#10dc60',//'#10dc60',
  warning: '#F7D447', //'#ffce00',//'#ffce00',
  danger: '#980609', //'#f53d3d',//'#f04141',
  dark: '#160B00', //'#222',//'#222428',
  medium: '#989aa2', //'#989aa2',//'#989aa2',
  light: '#ffddb4', //'#f4f4f4'//'#f4f5f8'
};

const DARK: IColor = {
  primary: '#643001', //'#488aff',//'#3880ff',
  secondary: '#C55F01', //'#32db64',//'#0cd1e8',
  tertiary: '#bc833d', //'#f4a942',//'#7044ff',
  success: '#7D9871', //'#10dc60',//'#10dc60',
  warning: '#F7D447', //'#ffce00',//'#ffce00',
  danger: '#980609', //'#f53d3d',//'#f04141',
  dark: '#ffddb4', //'#222',//'#222428',
  medium: '#989aa2', //'#989aa2',//'#989aa2',
  light: '#160B00', //'#f4f4f4'//'#f4f5f8'
}
  
const default_css = (() => {
  return `
  /** primary **/
  --ion-color-primary: #643001; //#3880ff;
  --ion-color-primary-rgb: 100,48,1;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255,255,255;
  --ion-color-primary-shade: #3171e0;
  --ion-color-primary-tint: #4c8dff;

  /** secondary **/
  --ion-color-secondary: #C55F01; //#0cd1e8;
  --ion-color-secondary-rgb: 197,95,1;
  --ion-color-secondary-contrast: #ffffff;
  --ion-color-secondary-contrast-rgb: 255,255,255;
  --ion-color-secondary-shade: #0bb8cc;
  --ion-color-secondary-tint: #24d6ea;

  /** tertiary **/
  --ion-color-tertiary: #bc833d; //#7044ff;
  --ion-color-tertiary-rgb: 188,131,61;
  --ion-color-tertiary-contrast: #ffffff;
  --ion-color-tertiary-contrast-rgb: 255,255,255;
  --ion-color-tertiary-shade: #633ce0;
  --ion-color-tertiary-tint: #7e57ff;

  /** success **/
  --ion-color-success: #7D9871; //#10dc60;
  --ion-color-success-rgb: 125,152,113;
  --ion-color-success-contrast: #ffffff;
  --ion-color-success-contrast-rgb: 255,255,255;
  --ion-color-success-shade: #0ec254;
  --ion-color-success-tint: #28e070;

  /** warning **/
  --ion-color-warning: #F7D447; //#ffce00;
  --ion-color-warning-rgb: 247,212,71;
  --ion-color-warning-contrast: #ffffff;
  --ion-color-warning-contrast-rgb: 255,255,255;
  --ion-color-warning-shade: #e0b500;
  --ion-color-warning-tint: #ffd31a;

  /** danger **/
  --ion-color-danger: #980609; //#f04141;
  --ion-color-danger-rgb: 152,6,9;
  --ion-color-danger-contrast: #ffffff;
  --ion-color-danger-contrast-rgb: 255,255,255;
  --ion-color-danger-shade: #d33939;
  --ion-color-danger-tint: #f25454;

  /** dark **/
  --ion-color-dark: #160B00; //#3d1d01; //#222428;
  --ion-color-dark-rgb: 22,11,0;
  --ion-color-dark-contrast: #ffffff;
  --ion-color-dark-contrast-rgb: 255,255,255;
  --ion-color-dark-shade: #1e2023;
  --ion-color-dark-tint: #383a3e;

  /** medium **/
  --ion-color-medium: #989aa2;
  --ion-color-medium-rgb: 152,154,162;
  --ion-color-medium-contrast: #ffffff;
  --ion-color-medium-contrast-rgb: 255,255,255;
  --ion-color-medium-shade: #86888f;
  --ion-color-medium-tint: #a2a4ab;

  /** light **/
  --ion-color-light: #ffddb4; //#f4f5f8;
  --ion-color-light-rgb: 255,221,180;
  --ion-color-light-contrast: #000000;
  --ion-color-light-contrast-rgb: 0,0,0;
  --ion-color-light-shade: #d7d8da;
  --ion-color-light-tint: #f5f6f9;

  --ion-color-transparent: transparent;
  `;
});



@Injectable({ 
  providedIn: 'root' 
})
export class ThemeService {

  private _nextTheme: string = 'LIGHT';

  constructor(@Inject(DOCUMENT) private document: Document) { }

  public toggleNextTheme() {
    const cssText: string = (this._nextTheme === 'LIGHT') ?  CSSTextGenerator(DEFAULTS) : CSSTextGenerator(DARK);

    console.log((this._nextTheme === 'LIGHT') ? 'Changing to light theme...' : 'Changing to dark theme...');
      
    this.setGlobalCSS(cssText);    

    this._nextTheme = this._nextTheme === 'LIGHT' ? 'DARK' : 'LIGHT';
  }

  public setVariable(name, value) { this.document.documentElement.style.setProperty(name, value) }

  private setGlobalCSS(css: string) { this.document.documentElement.style.cssText = css }
}  





function contrast(color, ratio = 0.5) {
  color = Color(color);
  return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
}

function CSSTextGenerator(colors: IColor) {
  colors = { ...DEFAULTS, ...colors };

  const { primary, secondary, tertiary, success, 
          warning, danger, dark, medium, light } = colors;

  const shadeRatio = 0.1;
  const tintRatio = 0.1;

  console.log(`theme: ${dark === DARK.dark ? 'dark' : 'light'}`);
  console.log(dark === DARK.dark);
  return `
    --ion-color-primary: ${primary};
    --ion-color-primary-rgb: 56,128,255;
    --ion-color-primary-contrast: ${dark === DARK.dark ? dark : light};
    --ion-color-primary-contrast-rgb: 255,255,255;
    --ion-color-primary-shade:  ${Color(primary).darken(shadeRatio)};
    --ion-color-primary-tint:  ${Color(primary).lighten(tintRatio)};

    --ion-color-secondary: ${secondary};
    --ion-color-secondary-rgb: 12,209,232;
    --ion-color-secondary-contrast: ${dark === DARK.dark ? dark : light};
    --ion-color-secondary-contrast-rgb: 255,255,255;
    --ion-color-secondary-shade:  ${Color(secondary).darken(shadeRatio)};
    --ion-color-secondary-tint: ${Color(secondary).lighten(tintRatio)};

    --ion-color-tertiary:  ${tertiary};
    --ion-color-tertiary-rgb: 112,68,255;
    --ion-color-tertiary-contrast: ${dark === DARK.dark ? dark : light};
    --ion-color-tertiary-contrast-rgb: 255,255,255;
    --ion-color-tertiary-shade: ${Color(tertiary).darken(shadeRatio)};
    --ion-color-tertiary-tint:  ${Color(tertiary).lighten(tintRatio)};

    --ion-color-success: ${success};
    --ion-color-success-rgb: 16,220,96;
    --ion-color-success-contrast: ${dark === DARK.dark ? dark : light};
    --ion-color-success-contrast-rgb: 255,255,255;
    --ion-color-success-shade: ${Color(success).darken(shadeRatio)};
    --ion-color-success-tint: ${Color(success).lighten(tintRatio)};

    --ion-color-warning: ${warning};
    --ion-color-warning-rgb: 255,206,0;
    --ion-color-warning-contrast: ${dark === DARK.dark ? light: dark};
    --ion-color-warning-contrast-rgb: 255,255,255;
    --ion-color-warning-shade: ${Color(warning).darken(shadeRatio)};
    --ion-color-warning-tint: ${Color(warning).lighten(tintRatio)};

    --ion-color-danger: ${danger};
    --ion-color-danger-rgb: 245,61,61;
    --ion-color-danger-contrast: ${dark === DARK.dark ? dark : light};
    --ion-color-danger-contrast-rgb: 255,255,255;
    --ion-color-danger-shade: ${Color(danger).darken(shadeRatio)};
    --ion-color-danger-tint: ${Color(danger).lighten(tintRatio)};

    --ion-color-dark: ${dark};
    --ion-color-dark-rgb: 34,34,34;
    --ion-color-dark-contrast: ${light};
    --ion-color-dark-contrast-rgb: 255,255,255;
    --ion-color-dark-shade: ${Color(dark).darken(shadeRatio)};
    --ion-color-dark-tint: ${Color(dark).lighten(tintRatio)};

    --ion-color-medium: ${medium};
    --ion-color-medium-rgb: 152,154,162;
    --ion-color-medium-contrast: ${dark === DARK.dark ? dark : light};
    --ion-color-medium-contrast-rgb: 255,255,255;
    --ion-color-medium-shade: ${Color(medium).darken(shadeRatio)};
    --ion-color-medium-tint: ${Color(medium).lighten(tintRatio)};

    --ion-color-light: ${light};
    --ion-color-light-rgb: 244,244,244;
    --ion-color-light-contrast: ${dark};
    --ion-color-light-contrast-rgb: 0,0,0;
    --ion-color-light-shade: ${Color(light).darken(shadeRatio)};
    --ion-color-light-tint: ${Color(light).lighten(tintRatio)};

    /** CUSTOM APP VARS **/
    //Custom transparent reference
    --ion-color-transparent: transparent;

    //app base and contrast
    --ion-color-base: ${primary};
    --ion-color-contrast: ${dark};

    //main background and text colors
    --ion-background-color: ${light};
    --ion-text-color: ${dark === DARK.dark ? dark : primary};

    --ion-toolbar-background: ${primary};
    --ion-toolbar-color: ${dark === DARK.dark ? dark : light};
    
    --ion-tab-bar-color: ${dark === DARK.dark ? light : secondary};

    --ion-tab-bar-color-activated: ${dark === DARK.dark ? dark : light};
    --ion-tab-bar-background: ${primary}; 

    //main item background colors
    --ion-item-background: ${light};
    --ion-item-color: ${dark};
    --ion-item-border-color: ${dark === DARK.dark ? dark : medium};
  `;
}




