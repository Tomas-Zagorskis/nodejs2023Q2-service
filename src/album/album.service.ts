import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    if (createAlbumDto.artistId) {
      await this.checkArtistId(createAlbumDto.artistId);
    }

    const newAlbum = new Album({
      ...createAlbumDto,
    });
    await this.entityManager.save(newAlbum);
    return newAlbum;
  }

  async findAll() {
    return await this.albumRepository.find();
  }

  async findOne(id: string) {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id);

    if (updateAlbumDto.artistId) {
      await this.checkArtistId(updateAlbumDto.artistId);
    }

    const updAlbum: Album = {
      ...album,
      ...updateAlbumDto,
    };

    await this.entityManager.save(Album, updAlbum);
    return updAlbum;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.albumRepository.delete(id);
  }

  private async checkArtistId(id: string) {
    if (!isUUID(id, '4')) throw new BadRequestException('Id is invalid');
    const artist = this.entityManager.findOneBy(Artist, { id });
    if (!artist) throw new NotFoundException('Artist not found');
  }
}
