import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { BusinessProfileService } from '../../application/services/business-profile-new.service';
import { CreateBusinessProfileDto, UpdateBusinessProfileDto } from '../../application/dtos/business-profile.dto';
import { CreateMediaDto } from '../../application/dtos/create-media.dto';
import { ClerkAuthGuard } from '../../../shared/guards/clerk-auth-guard';
import { OptimizedClerkAuthGuard } from '../../../shared/guards/optimized-clerk-auth-guard';

@Controller('business-profiles')
export class BusinessProfileController {
  constructor(private readonly businessProfileService: BusinessProfileService) {}

  // Simple debug endpoint without authentication - must come before parameterized routes
  @Get('debug/:id/reels')
  async debugReelsSimple(@Param('id') id: string) {
    console.log('🔍 Debug reels (no auth) for profile:', id);
    
    try {
      const profile = await this.businessProfileService.findById(id);
      if (!profile) {
        return { error: 'Business profile not found', profileId: id };
      }
      
      console.log('📄 Profile found:', profile.businessName);
      console.log('🎬 Reels in profile:', profile.reels?.length || 0);
      
      // Log detailed reel structure
      if (profile.reels && profile.reels.length > 0) {
        profile.reels.forEach((reel: any, index: number) => {
          console.log(`🎬 Reel ${index}:`, {
            id: reel.id || 'NO ID',
            _id: reel._id || 'NO _ID',
            title: reel.title || 'NO TITLE',
            keys: Object.keys(reel)
          });
        });
      }
      
      return {
        profileId: profile.id,
        businessName: profile.businessName,
        reelsCount: profile.reels?.length || 0,
        reels: profile.reels?.map((reel: any) => ({
          id: reel.id,
          _id: reel._id,
          title: reel.title,
          description: reel.description,
          allKeys: Object.keys(reel)
        })) || []
      };
    } catch (error) {
      console.error('❌ Error in debug endpoint:', error);
      return { 
        error: error.message,
        profileId: id,
        stack: error.stack 
      };
    }
  }

  @Post()
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBusinessProfileDto: CreateBusinessProfileDto,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    // Use authenticated user's ID as ownerId
    createBusinessProfileDto.ownerId = user.clerk_id;
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

  @Get(':id/debug-reels')
  async debugReels(@Param('id') profileId: string) {
    try {
      const profile = await this.businessProfileService.findById(profileId);
      if (!profile) {
        return { message: 'Profile not found' };
      }
      
      const reels = profile.reels || [];
      console.log('🔍 Debug reels for profile', profileId, ':', reels.length, 'reels found');
      
      return {
        profileId,
        reelsCount: reels.length,
        reels: reels.map((reel, index) => ({
          index,
          id: reel.id,
          _id: reel._id,
          title: reel.title,
          hasId: !!reel.id,
          hasMongoId: !!reel._id,
          idString: reel._id ? reel._id.toString() : null,
          allKeys: Object.keys(reel)
        }))
      };
    } catch (error) {
      console.error('❌ Debug reels error:', error);
      return { error: error.message };
    }
  }

  @Get('my-profiles')
  @UseGuards(ClerkAuthGuard)
  async findMyProfiles(@Req() req: Request) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    console.log('🔍 User authentication data:', {
      clerk_id: user.clerk_id,
      role: user.role,
      business_account_id: user.business_account_id,
      branch_id: user.branch_id,
      _id: user._id
    });
    
    try {
      const profiles = await this.businessProfileService.findByOwnerId(user.clerk_id);
      console.log('📋 Found profiles:', profiles.length);
      return profiles;
    } catch (error) {
      console.error('❌ Error finding profiles:', error);
      throw error;
    }
  }

  @Get('auth-test')
  @UseGuards(ClerkAuthGuard)
  async testAuth(@Req() req: Request) {
    const user = req.user;
    return {
      message: 'Authentication successful',
      user: {
        clerk_id: user?.clerk_id,
        role: user?.role,
        business_account_id: user?.business_account_id,
        branch_id: user?.branch_id,
        _id: user?._id
      }
    };
  }

  @Post('create-test-profile')
  @UseGuards(ClerkAuthGuard)
  async createTestProfile(@Req() req: Request) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');

    const testProfileData = {
      businessName: 'Test Business',
      ownerId: user.clerk_id,
      description: 'This is a test business profile',
      location: 'Test Location',
      phone: '+1234567890',
      email: 'test@business.com',
      website: 'https://testbusiness.com',
      categories: ['Restaurant', 'Food']
    };

    try {
      console.log('🔧 Creating test profile with data:', testProfileData);
      const profile = await this.businessProfileService.create(testProfileData);
      console.log('✅ Test profile created:', profile);
      return {
        message: 'Test profile created successfully',
        profile
      };
    } catch (error) {
      console.error('❌ Error creating test profile:', error);
      return {
        message: 'Failed to create test profile',
        error: error.message
      };
    }
  }

  @Get('owner/:ownerId')
  async findByOwnerId(@Param('ownerId') ownerId: string) {
    console.log('🔍 Looking for profiles with ownerId:', ownerId);
    try {
      const profiles = await this.businessProfileService.findByOwnerId(ownerId);
      console.log('📋 Found profiles:', profiles.length);
      return profiles;
    } catch (error) {
      console.error('❌ Error finding profiles by ownerId:', error);
      throw error;
    }
  }

  @Get('debug/all')
  async debugAllProfiles() {
    console.log('🔍 Fetching all profiles for debugging...');
    try {
      const result = await this.businessProfileService.findAll(1, 50);
      console.log('📋 All profiles count:', result.total);
      console.log('📋 Profile ownerIds:', result.profiles.map(p => ({ id: p.id, ownerId: p.ownerId, businessName: p.businessName })));
      return {
        message: 'Debug info retrieved successfully',
        total: result.total,
        profiles: result.profiles.map(p => ({ 
          id: p.id, 
          ownerId: p.ownerId, 
          businessName: p.businessName,
          email: p.email 
        }))
      };
    } catch (error) {
      console.error('❌ Error fetching all profiles:', error);
      return {
        message: 'Failed to fetch debug info',
        error: error.message
      };
    }
  }

  @Get('debug/menu-items/:id')
  async debugMenuItems(@Param('id') profileId: string) {
    console.log('🔍 Debug: Getting menu items for profile:', profileId);
    try {
      const profile = await this.businessProfileService.findById(profileId);
      if (!profile) {
        console.log('❌ Debug: Profile not found');
        return { error: 'Profile not found' };
      }

      const menuItems = profile.menuItems || [];
      console.log('📋 Debug: Menu items raw structure:', JSON.stringify(menuItems, null, 2));
      
      menuItems.forEach((item, index) => {
        console.log(`🍽️ Debug: Menu item ${index}:`, {
          _id: item._id,
          id: item.id,
          name: item.name,
          hasId: !!item._id,
          hasLegacyId: !!item.id,
          keys: Object.keys(item),
        });
      });

      return {
        profileId,
        count: menuItems.length,
        menuItems: menuItems.map(item => ({
          _id: item._id,
          id: item.id,
          name: item.name,
          hasId: !!item._id,
          hasLegacyId: !!item.id,
          keys: Object.keys(item)
        }))
      };
    } catch (error) {
      console.error('❌ Debug: Error getting menu items:', error);
      return { error: error.message };
    }
  }

  @Post('debug/fix-menu-ids/:id')
  async fixMenuItemIds(@Param('id') profileId: string) {
    console.log('🔧 Debug: Fixing menu item IDs for profile:', profileId);
    try {
      const updated = await this.businessProfileService.fixMenuItemIds(profileId);
      console.log('✅ Debug: Fixed menu items:', updated);
      return {
        message: 'Menu item IDs fixed successfully',
        profileId,
        updated
      };
    } catch (error) {
      console.error('❌ Debug: Error fixing menu item IDs:', error);
      return { error: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.businessProfileService.findById(id);
  }

  @Put(':id')
  @UseGuards(ClerkAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBusinessProfileDto: UpdateBusinessProfileDto,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.update(id, updateBusinessProfileDto, user.clerk_id);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    await this.businessProfileService.delete(id, user.clerk_id);
  }

  // Media management endpoints
  @Post(':id/slider-images')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addSliderImage(
    @Param('id') profileId: string,
    @Body() createMediaDto: CreateMediaDto,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.addSliderImage(profileId, createMediaDto, user.clerk_id);
  }

  @Delete(':id/slider-images/:mediaId')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSliderImage(
    @Param('id') profileId: string,
    @Param('mediaId') mediaId: string,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.removeSliderImage(profileId, mediaId, user.clerk_id);
  }

  @Get(':id/slider-images')
  async getSliderImages(@Param('id') profileId: string) {
    return await this.businessProfileService.getSliderImages(profileId);
  }

  @Post(':id/videos')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addVideo(
    @Param('id') profileId: string,
    @Body() createMediaDto: CreateMediaDto,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.addVideo(profileId, createMediaDto, user.clerk_id);
  }

  @Delete(':id/videos/:mediaId')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVideo(
    @Param('id') profileId: string,
    @Param('mediaId') mediaId: string,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.removeVideo(profileId, mediaId, user.clerk_id);
  }

  @Get(':id/videos')
  async getVideos(@Param('id') profileId: string) {
    return await this.businessProfileService.getVideos(profileId);
  }

  // Posts management endpoints
  @Post(':id/posts')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addPost(
    @Param('id') profileId: string,
    @Body() postData: any,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    // Allow base64 images for posts since that's what the frontend is designed to use
    console.log('📝 Adding post with data:', {
      caption: postData.caption,
      hasImage: !!postData.imageUrl,
      imageLength: postData.imageUrl ? postData.imageUrl.length : 0,
      isBase64: postData.imageUrl ? postData.imageUrl.startsWith('data:') : false
    });
    
    // Validate total document size to prevent BSON buffer overflow
    const estimatedSize = JSON.stringify(postData).length;
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB limit for safety (MongoDB max is 16MB)
    
    if (estimatedSize > maxSizeBytes) {
      throw new Error(`Post data is too large (${(estimatedSize / 1024 / 1024).toFixed(2)}MB). Please reduce image sizes and try again.`);
    }
    
    return await this.businessProfileService.addPost(profileId, postData, user.clerk_id);
  }

  @Delete(':id/posts/:postId')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.OK)
  async removePost(
    @Param('id') profileId: string,
    @Param('postId') postId: string,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.removePost(profileId, postId, user.clerk_id);
  }

  @Put(':id/posts/:postId')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updatePost(
    @Param('id') profileId: string,
    @Param('postId') postId: string,
    @Body() updateData: any,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.updatePost(profileId, postId, updateData, user.clerk_id);
  }

  @Get(':id/posts')
  async getPosts(@Param('id') profileId: string) {
    return await this.businessProfileService.getPosts(profileId);
  }

  // Reels management endpoints
  @Post(':id/reels')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addReel(
    @Param('id') profileId: string,
    @Body() reelData: any,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    // Allow base64 videos for reels since that's what the frontend is designed to use
    console.log('🎬 Adding reel with data:', {
      title: reelData.title,
      hasVideo: !!reelData.videoUrl,
      videoLength: reelData.videoUrl ? reelData.videoUrl.length : 0,
      isBase64: reelData.videoUrl ? reelData.videoUrl.startsWith('data:') : false
    });
    
    // Validate total document size to prevent BSON buffer overflow
    const estimatedSize = JSON.stringify(reelData).length;
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB limit for safety
    
    if (estimatedSize > maxSizeBytes) {
      throw new Error(`Reel data is too large (${(estimatedSize / 1024 / 1024).toFixed(2)}MB). Please reduce video size and try again.`);
    }
    
    return await this.businessProfileService.addReel(profileId, reelData, user.clerk_id);
  }

  @Delete(':id/reels/:reelId')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeReel(
    @Param('id') profileId: string,
    @Param('reelId') reelId: string,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.removeReel(profileId, reelId, user.clerk_id);
  }

  @Put(':id/reels/:reelId')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateReel(
    @Param('id') profileId: string,
    @Param('reelId') reelId: string,
    @Body() updateData: any,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.updateReel(profileId, reelId, updateData, user.clerk_id);
  }

  @Get(':id/reels')
  async getReels(@Param('id') profileId: string) {
    return await this.businessProfileService.getReels(profileId);
  }

  // Menu items management endpoints
  @Post(':id/menu-items')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addMenuItem(
    @Param('id') profileId: string,
    @Body() menuItemData: any,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    // Allow base64 images for menu items since that's what the frontend is designed to use
    console.log('🍽️ Adding menu item with data:', {
      name: menuItemData.name,
      hasImage: !!menuItemData.imageUrl,
      imageLength: menuItemData.imageUrl ? menuItemData.imageUrl.length : 0,
      isBase64: menuItemData.imageUrl ? menuItemData.imageUrl.startsWith('data:') : false
    });
    
    // Validate total document size to prevent BSON buffer overflow
    const estimatedSize = JSON.stringify(menuItemData).length;
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB limit for safety
    
    if (estimatedSize > maxSizeBytes) {
      throw new Error(`Menu item data is too large (${(estimatedSize / 1024 / 1024).toFixed(2)}MB). Please reduce image size and try again.`);
    }
    
    return await this.businessProfileService.addMenuItem(profileId, menuItemData, user.clerk_id);
  }

  @Delete(':id/menu-items/:menuItemId')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMenuItem(
    @Param('id') profileId: string,
    @Param('menuItemId') menuItemId: string,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    return await this.businessProfileService.removeMenuItem(profileId, menuItemId, user.clerk_id);
  }

  @Get(':id/menu-items')
  async getMenuItems(@Param('id') profileId: string) {
    return await this.businessProfileService.getMenuItems(profileId);
  }

  @Patch(':id/menu-items/:menuItemId')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateMenuItem(
    @Param('id') profileId: string,
    @Param('menuItemId') menuItemId: string,
    @Body() updateData: any,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    console.log('🍽️ Updating menu item with data:', {
      menuItemId,
      hasImage: !!updateData.imageUrl,
      imageLength: updateData.imageUrl ? updateData.imageUrl.length : 0,
      isBase64: updateData.imageUrl ? updateData.imageUrl.startsWith('data:') : false
    });
    
    // Validate total document size to prevent BSON buffer overflow
    const estimatedSize = JSON.stringify(updateData).length;
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB limit for safety
    
    if (estimatedSize > maxSizeBytes) {
      throw new Error(`Menu item data is too large (${(estimatedSize / 1024 / 1024).toFixed(2)}MB). Please reduce image size and try again.`);
    }
    
    return await this.businessProfileService.updateMenuItem(profileId, menuItemId, updateData, user.clerk_id);
  }

  @Post(':id/menu-items/:menuItemId/like')
  @HttpCode(HttpStatus.OK)
  async toggleMenuItemLike(
    @Param('id') profileId: string,
    @Param('menuItemId') menuItemId: string,
    @Body() body: { userId: string }
  ) {
    console.log('❤️ Controller: toggleMenuItemLike called with:', {
      profileId,
      menuItemId,
      userId: body.userId
    });
    
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    
    return await this.businessProfileService.toggleMenuItemLike(profileId, menuItemId, body.userId);
  }

  @Post(':id/migrate-reel-ids')
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.OK)
  async migrateReelIds(
    @Param('id') profileId: string,
    @Req() req: Request
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    
    console.log('🔄 Migrating reel IDs for profile:', profileId);
    return await this.businessProfileService.migrateReelIds(profileId, user.clerk_id);
  }
}