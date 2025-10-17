import { Inject, Injectable, Logger } from '@nestjs/common';
import { StorageService } from '../../application/interfaces/storage.interface';
import { MINIO_CLIENT } from '../providers/minio.provider';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService implements StorageService {
  private readonly logger = new Logger(MinioService.name);
  private readonly defaultBucket: string;

  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Minio.Client,
    private readonly configService: ConfigService,
  ) {
    this.defaultBucket =
      this.configService.get<string>('minio.bucketName') || 'app-storage';
    this.initializeBucket();
    console.log(
      'MINIO PORT number from config:',
      configService.get<string>('minio.port'),
    );
  }

  private async initializeBucket(): Promise<void> {
    try {
      const exists = await this.bucketExists(this.defaultBucket);
      if (!exists) {
        await this.createBucket(this.defaultBucket);
        this.logger.log(`Created default bucket: ${this.defaultBucket}`);
      }
    } catch (error) {
      this.logger.error('Failed to initialize bucket', error);
      throw error;
    }
  }

  async getSignedUploadUrl(
    fileName: string,
    bucketName?: string,
    expiry: number = 60 * 30, // 30 minutes
  ): Promise<string> {
    const bucket = bucketName || this.defaultBucket;
    try {
      // Auto-create bucket if it doesn't exist
      // const pathName = `social-media/posts/${fileName}`;
      const exists = await this.bucketExists(bucket);
      if (!exists) {
        await this.createBucket(bucket);
        this.logger.log(`Bucket created on demand: ${bucket}`);
      } // End of bucket autocreation code
      return await this.minioClient.presignedPutObject(
        bucket,
        fileName,
        expiry,
      );
    } catch (error) {
      this.logger.error(
        `Failed to generate signed upload URL: ${fileName}`,
        error,
      );
      throw error;
    }
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    bucketName?: string,
  ): Promise<string> {
    const bucket = bucketName || this.defaultBucket;

    try {
      // Auto-create bucket if it doesn't exist
      const exists = await this.bucketExists(bucket);
      if (!exists) {
        await this.createBucket(bucket);
        this.logger.log(`Bucket created on demand: ${bucket}`);
      } //End of bucket autocreation code
      const result = await this.minioClient.putObject(
        bucket,
        fileName,
        file,
        file.length,
      );

      this.logger.log(`File uploaded successfully: ${fileName}`);
      return `${bucket}/${fileName}`;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${fileName}`, error);
      throw error;
    }
  }

  async downloadFile(fileName: string, bucketName?: string): Promise<Buffer> {
    const bucket = bucketName || this.defaultBucket;

    try {
      const stream = await this.minioClient.getObject(bucket, fileName);
      const chunks: Buffer[] = [];

      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Failed to download file: ${fileName}`, error);
      throw error;
    }
  }

  async deleteFile(fileName: string, bucketName?: string): Promise<void> {
    const bucket = bucketName || this.defaultBucket;

    try {
      await this.minioClient.removeObject(bucket, fileName);
      this.logger.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${fileName}`, error);
      throw error;
    }
  }

  async getFileUrl(
    fileName: string,
    bucketName?: string,
    expiry: number = 24 * 60 * 60, // 24 hours
  ): Promise<string> {
    const bucket = bucketName || this.defaultBucket;

    try {
      return await this.minioClient.presignedGetObject(
        bucket,
        fileName,
        expiry,
      );
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL: ${fileName}`, error);
      throw error;
    }
  }

  async createBucket(bucketName: string): Promise<void> {
    try {
      await this.minioClient.makeBucket(bucketName);
      this.logger.log(`Bucket created: ${bucketName}`);
    } catch (error) {
      this.logger.error(`Failed to create bucket: ${bucketName}`, error);
      console.error('Minio bucket creation error details:', error);
      throw error;
    }
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    try {
      return await this.minioClient.bucketExists(bucketName);
    } catch (error) {
      this.logger.error(
        `Failed to check bucket existence: ${bucketName}`,
        error,
      );
      throw error;
      // return false;
    }
  }
}
