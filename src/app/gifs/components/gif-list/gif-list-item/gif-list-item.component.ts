import { Component, input } from '@angular/core';

@Component({
  selector: 'gifs-gif-list-item',
  imports: [],
  templateUrl: './gif-list-item.component.html',

})
export class GifListComponentComponent { 
  imageUrl = input.required<string>();
}
