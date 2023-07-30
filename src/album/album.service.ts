import { Injectable, NotFoundException } from '@nestjs/common';
import { TrackService } from 'src/track/track.service';
import { v4 as uuid } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  private albums = new Map<string, Album>();

  constructor(private readonly trackService: TrackService) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum: Album = {
      id: uuid(),
      ...createAlbumDto,
    };
    this.albums.set(newAlbum.id, newAlbum);
    return newAlbum;
  }

  findAll() {
    const albums = Array.from(this.albums.values());
    return albums;
  }

  findOne(id: string) {
    const album = this.albums.get(id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOne(id);

    const updAlbum: Album = {
      ...album,
      ...updateAlbumDto,
    };

    this.albums.set(id, updAlbum);
    return updAlbum;
  }

  remove(id: string) {
    this.findOne(id);
    this.trackService.removeIdReference(id, 'albumId');
    this.albums.delete(id);
  }

  removeArtistId(id: string) {
    const albums = this.findAll();
    albums.forEach((album) => {
      if (album.artistId === id) {
        this.albums.set(album.id, { ...album, artistId: null });
      }
    });
  }
}
