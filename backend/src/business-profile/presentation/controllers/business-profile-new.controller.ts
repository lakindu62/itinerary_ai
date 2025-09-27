import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { BusinessProfileService } from '../../application/services/business-profile-new.service';
import { CreateBusinessProfileDto, UpdateBusinessProfileDto } from '../../application/dtos/business-profile.dto';
import { CreateMediaDto } from '../../application/dtos/create-media.dto';

@Controller('business-profiles')
export class BusinessProfileController {
  constructor(private readonly businessProfileService: BusinessProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBusinessProfileDto: CreateBusinessProfileDto) {
    return await this.businessProfileService.create(createBusinessProfileDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.businessProfileService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.businessProfileService.findById(id);
  }

  @Get('owner/:ownerId')
  async findByOwnerId(@Param('ownerId') ownerId: string) {
    return await this.businessProfileService.findByOwnerId(ownerId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBusinessProfileDto: UpdateBusinessProfileDto,
    @Query('ownerId') ownerId: string,
  ) {
    return await this.businessProfileService.update(id, updateBusinessProfileDto, ownerId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Query('ownerId') ownerId: string,
  ) {
    await this.businessProfileService.delete(id, ownerId);
  }

  // Media management endpoints
  @Post(':id/slider-images')
  @HttpCode(HttpStatus.CREATED)
  async addSliderImage(
    @Param('id') profileId: string,
    @Body() createMediaDto: CreateMediaDto,
    @Query('ownerId') ownerId: string,
  ) {
    return await this.businessProfileService.addSliderImage(profileId, createMediaDto, ownerId);
  }

  @Delete(':id/slider-images/:mediaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSliderImage(
    @Param('id') profileId: string,
    @Param('mediaId') mediaId: string,
    @Query('ownerId') ownerId: string,
  ) {
    return await this.businessProfileService.removeSliderImage(profileId, mediaId, ownerId);
  }

  @Get(':id/slider-images')
  async getSliderImages(@Param('id') profileId: string) {
    return await this.businessProfileService.getSliderImages(profileId);
  }

  @Post(':id/videos')
  @HttpCode(HttpStatus.CREATED)
  async addVideo(
    @Param('id') profileId: string,
    @Body() createMediaDto: CreateMediaDto,
    @Query('ownerId') ownerId: string,
  ) {
    return await this.businessProfileService.addVideo(profileId, createMediaDto, ownerId);
  }

  @Delete(':id/videos/:mediaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVideo(
    @Param('id') profileId: string,
    @Param('mediaId') mediaId: string,
    @Query('ownerId') ownerId: string,
  ) {
    return await this.businessProfileService.removeVideo(profileId, mediaId, ownerId);
  }

  @Get(':id/videos')
  async getVideos(@Param('id') profileId: string) {
    return await this.businessProfileService.getVideos(profileId);
  }
}