import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { EntityManager, Repository } from 'typeorm';
import { Favorites } from './entities/favorites.entity';
import { FavoritesResponse } from './interfaces/favoritesResponse.interface';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favRepository: Repository<Favorites>,
    private readonly entityManager: EntityManager,
  ) {}

  async findFavorites() {
    const favorites = await this.getFavorites();

    const mapFavorites: FavoritesResponse = {
      albums: favorites.albums,
      artists: favorites.artists,
      tracks: favorites.tracks,
    };

    return mapFavorites;
  }

  async addItem(id: string, item: 'album' | 'track' | 'artist') {
    const entity = await this.checkAndGetEntity(id, item);
    const favorites = await this.getFavorites();

    favorites[`${item}s`].push(entity as any);

    await this.favRepository.save(favorites);
  }

  async removeItem(id: string, item: 'album' | 'track' | 'artist') {
    const entity = await this.checkAndGetEntity(id, item);
    const favorites = await this.getFavorites();

    const entityIndex = favorites[`${item}s`].findIndex(
      (item) => item.id === entity.id,
    );

    favorites[`${item}s`].splice(entityIndex, 1);
    await this.favRepository.save(favorites);
  }

  private async getFavorites() {
    let favorites = await this.favRepository.findOne({
      where: {},
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });

    if (!favorites) {
      favorites = {
        albums: [],
        artists: [],
        tracks: [],
      } as Favorites;
    }

    return favorites;
  }

  private async checkAndGetEntity(
    id: string,
    item: 'album' | 'track' | 'artist',
  ) {
    let entity: Artist | Album | Track;

    switch (item) {
      case 'album':
        entity = await this.entityManager.findOneBy(Album, { id });
        break;
      case 'track':
        entity = await this.entityManager.findOneBy(Track, { id });
        break;
      case 'artist':
        entity = await this.entityManager.findOneBy(Artist, { id });
    }

    if (!entity) {
      throw new UnprocessableEntityException(
        `${item.charAt(0).toUpperCase() + item.slice(1)} not found`,
      );
    }

    return entity;
  }
}
