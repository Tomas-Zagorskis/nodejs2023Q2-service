import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOkResponse({ description: 'Favorites were returned successfully' })
  async findAll() {
    return await this.favoritesService.findFavorites();
  }

  @Post('track/:id')
  @ApiCreatedResponse({ description: 'Track added successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({
    description: "Track with this id doesn't exist",
  })
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.addItem(id, 'track');
    return {
      statusCode: StatusCodes.CREATED,
      message: 'Track successfully added',
      error: null,
    };
  }

  @Delete('track/:id')
  @ApiNoContentResponse({ description: 'Successfully removed' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @HttpCode(204)
  async removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.removeItem(id, 'track');
  }

  @Post('album/:id')
  @ApiCreatedResponse({ description: 'Album added successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({
    description: "Album with this id doesn't exist",
  })
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.addItem(id, 'album');
    return {
      statusCode: StatusCodes.CREATED,
      message: 'Album successfully added',
      error: null,
    };
  }

  @Delete('album/:id')
  @ApiNoContentResponse({ description: 'Successfully removed' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  @HttpCode(204)
  async removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.removeItem(id, 'album');
  }

  @Post('artist/:id')
  @ApiCreatedResponse({ description: 'Artist added successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({
    description: "Artist with this id doesn't exist",
  })
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.addItem(id, 'artist');
    return {
      statusCode: StatusCodes.CREATED,
      message: 'Artist successfully added',
      error: null,
    };
  }

  @Delete('artist/:id')
  @ApiNoContentResponse({ description: 'Successfully removed' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Artist not found' })
  @HttpCode(204)
  async removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    await this.favoritesService.removeItem(id, 'artist');
  }
}
