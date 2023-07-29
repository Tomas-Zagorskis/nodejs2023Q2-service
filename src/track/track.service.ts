import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TrackService {
  private tracks = new Map<string, Track>();

  create(createTrackDto: CreateTrackDto) {
    const newTrack: Track = {
      id: uuid(),
      ...createTrackDto,
    };

    this.tracks.set(newTrack.id, newTrack);
    return newTrack;
  }

  findAll() {
    const tracks = Array.from(this.tracks.values());
    return tracks;
  }

  findOne(id: string) {
    const track = this.tracks.get(id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);
    const updTrack: Track = { ...track, ...updateTrackDto };
    this.tracks.set(id, updTrack);
    return updTrack;
  }

  remove(id: string) {
    this.findOne(id);
    this.tracks.delete(id);
  }
}
