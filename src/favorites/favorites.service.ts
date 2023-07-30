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
    const artistsEnt = this.favs.artists
      .map((id) => {
        try {
          return this.artistService.findOne(id);
        } catch {
          return;
        }
      })
      .filter((v) => v);
    const albumsEnt = this.favs.albums
      .map((id) => {
        try {
          return this.albumService.findOne(id);
        } catch {
          return;
        }
      })
      .filter((v) => v);
    const tracksEnt = this.favs.tracks
      .map((id) => {
        try {
          return this.trackService.findOne(id);
        } catch {
          return;
        }
      })
      .filter((v) => v);

    const favoritesWithEntities: FavoritesResponse = {
      artists: artistsEnt,
      albums: albumsEnt,
      tracks: tracksEnt,
    };

    return favoritesWithEntities;
  }

  addItem(id: string, item: 'album' | 'track' | 'artist') {
    const { service } = this.extractItemInstance(item);

    service.findOne(id);
    this.favs[`${item}s`].push(id);
  }

  removeItem(id: string, item: 'album' | 'track' | 'artist') {
    const { itemList } = this.extractItemInstance(item);
    const itemId = itemList.find((itemId) => itemId === id);
    if (!itemId) throw new NotFoundException(`The ${item} is not favorited`);
    this.favs[`${item}s`] = itemList.filter((itemId) => itemId !== id);
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
