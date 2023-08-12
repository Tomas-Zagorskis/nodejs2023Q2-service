import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = new Artist({
      ...createArtistDto,
    });

    await this.entityManager.save(newArtist);
    return newArtist;
  }

  async findAll() {
    return await this.artistRepository.find();
  }

  async findOne(id: string) {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);
    const updArtist: Artist = {
      ...artist,
      ...updateArtistDto,
    };
    await this.entityManager.save(Artist, updArtist);
    return updArtist;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.artistRepository.delete(id);
  }
}
