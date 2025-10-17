import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: Client;
  private bucket: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const endpoint = this.configService.getOrThrow<string>('MINIO_ENDPOINT');
    const accessKey = this.configService.getOrThrow<string>('MINIO_ACCESS_KEY');
    const secretKey = this.configService.getOrThrow<string>('MINIO_SECRET_KEY');
    const bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET_NAME');

    this.minioClient = new Client({
      endPoint: endpoint,
      port: this.configService.get<number>('MINIO_PORT', 443),
      useSSL: this.configService.get<boolean>('MINIO_USE_SSL', true),
      accessKey: accessKey,
      secretKey: secretKey,
    });

    this.bucket = bucketName;

    // Ensure bucket exists
    const bucketExists = await this.minioClient.bucketExists(this.bucket);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucket, this.configService.get('MINIO_REGION', 'us-east-1'));
    }
  }

  async uploadFile(buffer: Buffer, filename: string): Promise<string> {
    await this.minioClient.putObject(this.bucket, filename, buffer);
    return `${this.bucket}/${filename}`;
  }

  async deleteFile(path: string): Promise<void> {
    const [bucket, ...filenameParts] = path.split('/');
    const filename = filenameParts.join('/');
    await this.minioClient.removeObject(bucket, filename);
  }

  async getSignedUrl(path: string, expiryInSeconds: number = 3600): Promise<string> {
    const [bucket, ...filenameParts] = path.split('/');
    const filename = filenameParts.join('/');
    return await this.minioClient.presignedGetObject(bucket, filename, expiryInSeconds);
  }
}