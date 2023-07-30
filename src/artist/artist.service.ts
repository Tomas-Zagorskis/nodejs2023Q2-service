import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuid } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  private artists = new Map<string, Artist>();

  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const newArtist: Artist = {
      id: uuid(),
      ...createArtistDto,
    };

    this.artists.set(newArtist.id, newArtist);
    return newArtist;
  }

  findAll() {
    const artists = Array.from(this.artists.values());
    return artists;
  }

  findOne(id: string) {
    const artist = this.artists.get(id);
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.findOne(id);
    const updArtist: Artist = {
      ...artist,
      ...updateArtistDto,
    };
    this.artists.set(id, updArtist);
    return updArtist;
  }

  remove(id: string) {
    this.findOne(id);
    this.trackService.removeIdReference(id, 'artistId');
    this.albumService.removeArtistId(id);
    this.artists.delete(id);
  }
}
