import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ description: 'Users were returned successfully' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'User was returned successfully' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Wrong old password' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id);
  }
}
