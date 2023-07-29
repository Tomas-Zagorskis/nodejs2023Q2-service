import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    try {
      this.favoritesService.addItem(id, 'track');
      return {
        statusCode: StatusCodes.CREATED,
        message: 'Track successfully added',
        error: null,
      };
    } catch (error) {
      throw new UnprocessableEntityException(
        "Track with this id doesn't exist",
      );
    }
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeItem(id, 'track');
  }

  @Post('album/:id')
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    try {
      this.favoritesService.addItem(id, 'album');
      return {
        statusCode: StatusCodes.CREATED,
        message: 'Album successfully added',
        error: null,
      };
    } catch (error) {
      throw new UnprocessableEntityException(
        "Album with this id doesn't exist",
      );
    }
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeItem(id, 'album');
  }

  @Post('artist/:id')
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    try {
      this.favoritesService.addItem(id, 'artist');
      return {
        statusCode: StatusCodes.CREATED,
        message: 'Artist successfully added',
        error: null,
      };
    } catch (error) {
      throw new UnprocessableEntityException(
        "Artist with this id doesn't exist",
      );
    }
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeItem(id, 'artist');
  }
}
