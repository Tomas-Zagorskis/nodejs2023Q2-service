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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOkResponse({ description: 'Favorites were returned successfully' })
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @ApiCreatedResponse({ description: 'Track added successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({
    description: "Track with this id doesn't exist",
  })
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    try {
      this.favoritesService.addItem(id, 'track');
      return {
        statusCode: StatusCodes.CREATED,
        message: 'Track successfully added',
        error: null,
      };
    } catch {
      throw new UnprocessableEntityException(
        "Track with this id doesn't exist",
      );
    }
  }

  @Delete('track/:id')
  @ApiNoContentResponse({ description: 'Successfully removed' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @HttpCode(204)
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeItem(id, 'track');
  }

  @Post('album/:id')
  @ApiCreatedResponse({ description: 'Album added successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({
    description: "Album with this id doesn't exist",
  })
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    try {
      this.favoritesService.addItem(id, 'album');
      return {
        statusCode: StatusCodes.CREATED,
        message: 'Album successfully added',
        error: null,
      };
    } catch {
      throw new UnprocessableEntityException(
        "Album with this id doesn't exist",
      );
    }
  }

  @Delete('album/:id')
  @ApiNoContentResponse({ description: 'Successfully removed' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  @HttpCode(204)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeItem(id, 'album');
  }

  @Post('artist/:id')
  @ApiCreatedResponse({ description: 'Artist added successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({
    description: "Artist with this id doesn't exist",
  })
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    try {
      this.favoritesService.addItem(id, 'artist');
      return {
        statusCode: StatusCodes.CREATED,
        message: 'Artist successfully added',
        error: null,
      };
    } catch {
      throw new UnprocessableEntityException(
        "Artist with this id doesn't exist",
      );
    }
  }

  @Delete('artist/:id')
  @ApiNoContentResponse({ description: 'Successfully removed' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  @HttpCode(204)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    this.favoritesService.removeItem(id, 'artist');
  }
}
