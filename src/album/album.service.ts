import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AlbumService {
  private albums = new Map<string, Album>();

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
    this.albums.delete(id);
  }
}
