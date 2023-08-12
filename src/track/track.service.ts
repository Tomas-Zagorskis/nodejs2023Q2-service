import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly tracksRepository: Repository<Track>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    await this.checkArtistAndAlbumId(
      createTrackDto.artistId,
      createTrackDto.albumId,
    );

    const newTrack = new Track({
      ...createTrackDto,
    });

    await this.entityManager.save(newTrack);
    return newTrack;
  }

  async findAll() {
    return await this.tracksRepository.find();
  }

  async findOne(id: string) {
    const track = await this.tracksRepository.findOneBy({ id });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);
    await this.checkArtistAndAlbumId(
      updateTrackDto.artistId,
      updateTrackDto.albumId,
    );

    const updTrack: Track = { ...track, ...updateTrackDto };
    this.entityManager.save(Track, updTrack);
    return updTrack;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.tracksRepository.delete(id);
  }

  private async checkArtistAndAlbumId(
    artistId: string | null,
    albumId: string | null,
  ) {
    if (artistId) {
      if (!isUUID(artistId, '4'))
        throw new BadRequestException('Id is invalid');
      const artist = await this.entityManager.findOneBy(Artist, {
        id: artistId,
      });
      if (!artist) throw new NotFoundException('Artist not found');
    }
    if (albumId) {
      if (!isUUID(albumId, '4')) throw new BadRequestException('Id is invalid');
      const album = await this.entityManager.findOneBy(Album, { id: albumId });
      if (!album) throw new NotFoundException('Album not found');
    }
  }
}
