import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name!: string;

  @Column('boolean', { default: false })
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist, {
    cascade: true,
  })
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist, {
    cascade: true,
  })
  tracks: Track[];

  constructor(artist: Partial<Artist>) {
    Object.assign(this, artist);
  }
}
