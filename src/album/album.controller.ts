import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Album created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body(new ValidationPipe()) createAlbumDto: CreateAlbumDto) {
    return await this.albumService.create(createAlbumDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Albums were returned successfully' })
  async findAll() {
    return await this.albumService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Album was returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.albumService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateAlbumDto: UpdateAlbumDto,
  ) {
    return await this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Album not found' })
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.albumService.remove(id);
  }
}
