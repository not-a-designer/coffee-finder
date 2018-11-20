import { Component, Input, OnInit } from '@angular/core';


export const TOTAL_STARS: number = 5;

interface Star {
  icon: string;
}


@Component({
  selector: 'star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  @Input('rating') 
  public rating: any;

  public starColor: string;
  public starsArray: Array<Star> = [];

  constructor() {  }

  public ngOnInit(): void {
    this.getColor();
    let ratingSplit: Array<string> = [];
    
    //correct for type input
    const rateString: string = (typeof this.rating === 'number' || this.rating instanceof Number || !isNaN(this.rating)) ?
      this.rating.toString() : 
      <string>this.rating;

      //slpit rating into whole and decimal
    if (rateString.indexOf('.') < 0) ratingSplit.push(<string>this.rating, '0');
    else ratingSplit = [ ...rateString.split('.') ];

    //if the rating is a whole number
    if (+ratingSplit[1] === 0) {
      const s: number = +ratingSplit[0];
      for (let i = 0; i < s; i++) this.starsArray.push({ icon: 'star' });
      if (s < TOTAL_STARS) {
        const missingStars: number = TOTAL_STARS - s;
        for (let j = 0; j < missingStars; j++) this.starsArray.push({ icon: 'star-outline' });
      }
    }
    else {
      //if rating has a decimal, add a half star
      const s: number = +ratingSplit[0];
      for (let i = 0; i < s; i++) this.starsArray.push({ icon: 'star' });
      this.starsArray.push({ icon: 'star-half' });

      //populate remaining empty stars
      if ((s + 1) <= TOTAL_STARS) {
        const missingStars = TOTAL_STARS - (s + 1);
      for (let j = 0; j < missingStars; j++) this.starsArray.push({ icon: 'star-outline' });
      }
    }
    //this.starsArray.map((star) => star.icon);
  }

  private getColor(): void {
    if (+this.rating < 2) this.starColor = 'danger';
    else if (+this.rating >= 2 && +this.rating < 4) this.starColor = 'warning';
    else this.starColor = 'success';
  }

}
