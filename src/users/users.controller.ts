import { Controller, Get, Body, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async createUser(@Query('code') code: string, @Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const response = await this.usersService.create(code, createUserDto);
    if(response.error)
      return res.render('error', response);
    return res.render('createRepo', response);
  }

  @Get('/createRepo')
  async createRepo(@Query('access_token') access_token: string, @Res() res: Response) {
    const response = await this.usersService.createRepo(access_token);
    if(response.error)
      return res.render('error', response);
    return res.render('success', response);
  }
}
