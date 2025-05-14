import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifeService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/scroll-state.service';


@Component({
  selector: 'app-trending-page',
  imports: [],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if( !scrollDiv ) return;
    scrollDiv.scrollTop = this.scrollService.trendingScrollState();
  }

  gifService = inject( GifeService );
  scrollService = inject( ScrollStateService );
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv')
  
  onScroll( event: Event ){
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if( !scrollDiv ) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;
    
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
    this.scrollService.trendingScrollState.set( scrollTop );

    if( isAtBottom ){
      this.gifService.loadTrendinGifs()
    }
  }
}
