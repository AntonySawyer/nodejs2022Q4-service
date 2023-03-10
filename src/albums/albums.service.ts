import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { v4 as uuidV4 } from 'uuid';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';

import { IGenericRepository } from '../shared/db/db.interface';
import { GenericRepository } from '../shared/db/genericRepository';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';
import { IAlbum } from './entities/album.interface';
import { validateIsUUID } from '../shared/utils/validateIsUUID';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumEntity)
    private repository: Repository<AlbumEntity>,
  ) {
    this.storage = new GenericRepository<AlbumEntity>(this.repository);
  }

  private storage: IGenericRepository<AlbumEntity>;

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    const newId = uuidV4();
    const newInstance = plainToClass(AlbumEntity, {
      id: newId,
      ...createAlbumDto,
    });

    const createdInstance = await this.storage.create(newInstance);

    const plainCreatedEntity = instanceToPlain(createdInstance) as IAlbum;

    return plainCreatedEntity;
  }

  async findAll(): Promise<AlbumEntity[]> {
    const instances = await this.storage.find();

    const plainEntities: IAlbum[] = instances.map(
      (instance) => instanceToPlain(instance) as IAlbum,
    );

    return plainEntities;
  }

  async findOne(id: string): Promise<AlbumEntity> {
    try {
      await validateIsUUID(id);

      const entity = await this.storage.findById(id);

      return entity;
    } catch (error) {
      throw error;
    }
  }

  async findManyByIds(ids: string[]): Promise<AlbumEntity[]> {
    const validatedIds = ids.filter((id) => isUUID(id));

    try {
      const entities = await this.storage.findManyByIds(validatedIds);

      return entities;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    try {
      await validateIsUUID(id);

      const originalEntity = await this.storage.findById(id);

      const updatedEntityInstance = plainToClass(
        UpdateAlbumDto,
        updateAlbumDto,
      );

      const entityForUpdate: AlbumEntity = {
        ...originalEntity,
        ...updatedEntityInstance,
      };

      const updatedEntityDbResponse = await this.storage.updateById(
        id,
        entityForUpdate,
      );

      const plainUpdatedEntity = instanceToPlain(
        updatedEntityDbResponse,
      ) as IAlbum;

      return plainUpdatedEntity;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await validateIsUUID(id);

      await this.storage.removeById(id);
    } catch (error) {
      throw error;
    }
  }
}
