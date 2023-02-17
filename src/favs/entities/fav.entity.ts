import { AlbumEntity } from 'src/albums/entities/album.entity';
import { ArtistEntity } from 'src/artists/entities/artist.entity';
import { EntityWithId } from 'src/shared/db/db.interface';
import { TrackEntity } from 'src/tracks/entities/track.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FAV_TYPE, IFavEntity } from './fav.interface';

@Entity()
export class FavEntity implements IFavEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: FAV_TYPE,
  })
  type: FAV_TYPE;

  @PrimaryColumn('uuid', {
    nullable: false,
  })
  entityId: EntityWithId['id'];

  @Column('uuid', { nullable: true })
  @ManyToOne(() => ArtistEntity, (artist) => artist.id, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  artistId: string | null;

  @Column('uuid', { nullable: true })
  @ManyToOne(() => AlbumEntity, (album) => album.id, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'albumId', referencedColumnName: 'id' })
  albumId: string | null;

  @Column('uuid', { nullable: true })
  @ManyToOne(() => TrackEntity, (track) => track.id, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'trackId', referencedColumnName: 'id' })
  trackId: string | null;
}
