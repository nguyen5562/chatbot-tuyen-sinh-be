import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../helper/response.helper';
import { ResponseCode, ResponseMessage } from '../../const/response.const';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const ans = await this.authService.login(req.user);
    return ApiResponse(res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS, ans);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req, @Response() res) {
    const id = req.user.id as string;
    const currentUser = await this.userService.getUserById(id);
    return ApiResponse(
      res,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      currentUser,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-id')
  getId(@Request() req, @Response() res) {
    const id = req.user.id;
    return ApiResponse(res, ResponseCode.SUCCESS, ResponseMessage.SUCCESS, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-role')
  getRole(@Request() req, @Response() res) {
    const role = req.user.role;
    return ApiResponse(
      res,
      ResponseCode.SUCCESS,
      ResponseMessage.SUCCESS,
      role,
    );
  }
}
