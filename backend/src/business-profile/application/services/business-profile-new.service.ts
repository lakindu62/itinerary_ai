import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IBusinessProfileRepository } from '../../domain/repositories/business-profile.repository.interface';
import { CreateBusinessProfileDto, UpdateBusinessProfileDto, BusinessProfileResponseDto } from '../dtos/business-profile.dto';
import { CreateMediaDto, MediaType } from '../dtos/create-media.dto';
import { BusinessProfile, CreateMediaData } from '../../domain/entities/business-profile.entity';

@Injectable()
export class BusinessProfileService {
  constructor(
    @Inject('IBusinessProfileRepository')
    private readonly businessProfileRepository: IBusinessProfileRepository,
  ) {}

  async create(createBusinessProfileDto: CreateBusinessProfileDto): Promise<BusinessProfileResponseDto> {
    const existingProfiles = await this.businessProfileRepository.findByOwnerId(createBusinessProfileDto.ownerId);
    
    if (existingProfiles.length > 0) {
      throw new BadRequestException('User already has a business profile');
    }

    const profile = await this.businessProfileRepository.create({
      businessName: createBusinessProfileDto.businessName,
      ownerId: createBusinessProfileDto.ownerId,
      description: createBusinessProfileDto.description,
      location: createBusinessProfileDto.location,
      phone: createBusinessProfileDto.phone,
      email: createBusinessProfileDto.email,
      website: createBusinessProfileDto.website,
      categories: createBusinessProfileDto.categories || [],
    });

    return this.mapToResponseDto(profile);
  }

  async update(id: string, updateBusinessProfileDto: UpdateBusinessProfileDto, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    const updatedProfile = await this.businessProfileRepository.update(id, updateBusinessProfileDto);
    if (!updatedProfile) {
      throw new NotFoundException('Business profile not found after update');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async findById(id: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }
    return this.mapToResponseDto(profile);
  }

  async findByOwnerId(ownerId: string): Promise<BusinessProfileResponseDto[]> {
    const profiles = await this.businessProfileRepository.findByOwnerId(ownerId);
    return profiles.map(profile => this.mapToResponseDto(profile));
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const profile = await this.businessProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to delete this profile');
    }

    const deleted = await this.businessProfileRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete business profile');
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ profiles: BusinessProfileResponseDto[], total: number }> {
    const result = await this.businessProfileRepository.findAll(page, limit);
    return {
      profiles: result.profiles.map(profile => this.mapToResponseDto(profile)),
      total: result.total
    };
  }

  // Media management methods
  async addSliderImage(profileId: string, createMediaDto: CreateMediaDto, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    if (createMediaDto.type !== MediaType.IMAGE) {
      throw new BadRequestException('Media type must be image for slider');
    }

    const mediaData: CreateMediaData = {
      type: 'image',
      url: createMediaDto.url,
      filename: createMediaDto.filename,
      order: createMediaDto.order || profile.sliderImages.length,
    };

    const updatedProfile = await this.businessProfileRepository.addSliderImage(profileId, mediaData);
    if (!updatedProfile) {
      throw new BadRequestException('Failed to add slider image');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async removeSliderImage(profileId: string, mediaId: string, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    const updatedProfile = await this.businessProfileRepository.removeSliderImage(profileId, mediaId);
    if (!updatedProfile) {
      throw new BadRequestException('Failed to remove slider image');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async addVideo(profileId: string, createMediaDto: CreateMediaDto, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    if (createMediaDto.type !== MediaType.VIDEO) {
      throw new BadRequestException('Media type must be video');
    }

    const mediaData: CreateMediaData = {
      type: 'video',
      url: createMediaDto.url,
      filename: createMediaDto.filename,
      order: createMediaDto.order || profile.videos.length,
    };

    const updatedProfile = await this.businessProfileRepository.addVideo(profileId, mediaData);
    if (!updatedProfile) {
      throw new BadRequestException('Failed to add video');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async removeVideo(profileId: string, mediaId: string, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    const updatedProfile = await this.businessProfileRepository.removeVideo(profileId, mediaId);
    if (!updatedProfile) {
      throw new BadRequestException('Failed to remove video');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async getSliderImages(profileId: string): Promise<any[]> {
    const images = await this.businessProfileRepository.getSliderImages(profileId);
    return images;
  }

  async getVideos(profileId: string): Promise<any[]> {
    const videos = await this.businessProfileRepository.getVideos(profileId);
    return videos;
  }

  private mapToResponseDto(profile: BusinessProfile): BusinessProfileResponseDto {
    return {
      id: profile.id,
      businessName: profile.businessName,
      ownerId: profile.ownerId,
      description: profile.description,
      categories: profile.categories,
      location: profile.location,
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
      sliderImages: profile.sliderImages,
      videos: profile.videos,
      isActive: profile.isActive,
      isVerified: profile.isVerified,
      createdAt: (profile as any).createdAt || new Date(),
      updatedAt: (profile as any).updatedAt || new Date(),
    };
  }
}