import { Injectable, NotFoundException } from '@nestjs/common';
import { Favorites } from './entities/favorites.entity';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesResponse } from './interfaces/favoritesResponse.interface';

@Injectable()
export class FavoritesService {
  private favs: Favorites = { albums: [], artists: [], tracks: [] };

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  findAll() {
    const favoritesWithEntities: FavoritesResponse = {
      artists: this.favs.artists.map((id) => this.artistService.findOne(id)),
      albums: this.favs.albums.map((id) => this.albumService.findOne(id)),
      tracks: this.favs.tracks.map((id) => this.trackService.findOne(id)),
    };

    return favoritesWithEntities;
  }

  addItem(id: string, item: 'album' | 'track' | 'artist') {
    const { service, itemList } = this.extractItemInstance(item);

    service.findOne(id);
    itemList.push(id);
  }

  removeItem(id: string, item: 'album' | 'track' | 'artist') {
    let { itemList } = this.extractItemInstance(item);
    const itemId = itemList.find((itemId) => itemId === id);
    if (!itemId) throw new NotFoundException(`The ${item} is not favorited`);
    itemList = itemList.filter((trackId) => trackId !== id);
  }

  private extractItemInstance(item: 'album' | 'track' | 'artist') {
    let service: ArtistService | AlbumService | TrackService;
    let itemList: string[];

    switch (item) {
      case 'album':
        service = this.albumService;
        itemList = this.favs.albums;
        break;
      case 'track':
        service = this.trackService;
        itemList = this.favs.tracks;
        break;
      case 'artist':
        service = this.artistService;
        itemList = this.favs.artists;
    }

    return {
      service,
      itemList,
    };
  }
}
