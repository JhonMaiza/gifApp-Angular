import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifeService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  gifService = inject( GifeService );
  gifs = signal<Gif[]>([]);

  onSearch( query: string){
    this.gifService.searchGifs( query ).subscribe((resp) => {
      this.gifs.set( resp );
    });
    
  }
}
