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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './track.service';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Track created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body(new ValidationPipe()) createTrackDto: CreateTrackDto) {
    return await this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Tracks were returned successfully' })
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Track was returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateTrackDto: UpdateTrackDto,
  ) {
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.trackService.remove(id);
  }
}
