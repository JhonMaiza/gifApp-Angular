import { Component, input } from '@angular/core';
import { GifListComponentComponent } from "./gif-list-item/gif-list-item.component";
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gifs-gif-list',
  imports: [GifListComponentComponent],
  templateUrl: './gif-list.component.html',
})
export class GifListComponent {
  gifs = input.required<Gif[]>();
}
