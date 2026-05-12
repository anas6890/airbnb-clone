import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import type { RequestWithUser } from '../Auth/types/request-with-user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /users/register
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  // POST /users/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }

  // GET /users/me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: RequestWithUser) {
    return this.userService.getProfile(req.user.sub);
  }

  // PATCH /users/me
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Request() req: RequestWithUser,
    @Body() dto: Partial<CreateUserDto>,
  ) {
    return this.userService.updateProfile(req.user.sub, dto);
  }

  // DELETE /users/me
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  deleteAccount(@Request() req: RequestWithUser) {
    return this.userService.deleteAccount(req.user.sub);
  }

  // GET /users/me/wishlist
  @Get('me/wishlist')
  @UseGuards(JwtAuthGuard)
  getWishlist(@Request() req: RequestWithUser) {
    return this.userService.getWishlist(req.user.sub);
  }
  // POST /users/me/wishlist/:listingId
  @Post('me/wishlist/:listingId')
  @UseGuards(JwtAuthGuard)
  addToWishlist(
    @Param('listingId') listingId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.addToWishlist(req.user.sub, listingId);
  }

  // DELETE /users/me/wishlist/:listingId
  @Delete('me/wishlist/:listingId')
  @UseGuards(JwtAuthGuard)
  removeFromWishlist(
    @Param('listingId') listingId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.removeFromWishlist(req.user.sub, listingId);
  }
}
