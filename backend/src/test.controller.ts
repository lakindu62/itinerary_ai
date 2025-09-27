import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller()
export class TestController {
  @Get('test/hello')
  getHello(): { message: string; timestamp: string } {
    return {
      message: 'Backend API is working!',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('business/media')
  getBusinessMedia(): { status: string; message: string; data: any[] } {
    return {
      status: 'success',
      message: 'Business media endpoint reachable',
      data: [],
    };
  }

  @Post('business/media')
  createBusinessMedia(@Body() data: any): { status: string; message: string; data: any } {
    console.log('Mock business media creation:', data);
    return {
      status: 'success',
      message: 'Mock business media created successfully',
      data: {
        id: `mock_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      },
    };
  }
}