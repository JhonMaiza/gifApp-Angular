import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs'
const loadFromLocalStorage = () => {
    const gifsfromLocalStorage = localStorage.getItem( GIF_KEY ) ?? '{}';
    const gifs = JSON.parse( gifsfromLocalStorage );
    return gifs;
};

@Injectable({providedIn: 'root'})
export class GifeService {
    private http = inject(HttpClient);

    trendingGifs = signal<Gif[]>([]);
    trendingGifsLoading = signal( true );

    searchHistory = signal<Record<string, Gif[]>>( loadFromLocalStorage() );
    searchHistorykeys = computed( () => Object.keys( this.searchHistory() ));

    constructor(){
        this.loadTrendinGifs();
    };

    saveGifsToLocalStorage = effect( () => {
        localStorage.setItem (GIF_KEY, JSON.stringify( this.searchHistory()));
    });

    
    loadTrendinGifs(){
        this.http
            .get<GiphyResponse>(`${ environment.giphyUrl }/gifs/trending`,{
            params: {
                api_key: environment.giphyApiKey,
                limit: 20,
            },
        }).subscribe( (resp) => {
            const gifs = GifMapper.mapGiphyItemsToGifArray( resp.data );
            this.trendingGifs.set( gifs );
            this.trendingGifsLoading.set( false );
            console.log({ gifs });
        });
    };

    searchGifs( query:string ): Observable<Gif[]> {
        return this.http
        .get<GiphyResponse>(`${ environment.giphyUrl }/gifs/search`, {
            params:{
                api_key: environment.giphyApiKey,
                limit: 20,
                q: query,
            }
        }).pipe(
            map( ({ data }) => data ),
            map( ( items ) => GifMapper.mapGiphyItemsToGifArray( items )),
            tap( items => {
                this.searchHistory.update( history => ({
                    ...history,
                    [ query.toLowerCase() ]: items,
                }));

            }),
        );
        
        // subscribe( (resp) => {
        //     const gifs = GifMapper.mapGiphyItemsToGifArray( resp.data );
        //     this.trendingGifs.set( gifs );
        //     this.trendingGifsLoading.set( false );
        //     console.log({ gifs });
        // })
    };

    getHistoryGifs( query: string ): Gif[] {
        return this.searchHistory()[ query ] ?? [];
    }
}