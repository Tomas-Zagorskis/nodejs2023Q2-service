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
  create(@Body(new ValidationPipe()) createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Tracks were returned successfully' })
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Track was returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.trackService.remove(id);
  }
}
