// src/cloudinary/cloudinary.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

type ResourceType = 'image' | 'video' | 'raw' | 'auto';

@Injectable()
export class CloudinaryService {
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(private readonly config: ConfigService) {
    this.cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME')!;
    this.apiKey = this.config.get<string>('CLOUDINARY_API_KEY')!;
    this.apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET')!;

    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      throw new Error(
        'Missing Cloudinary envs: CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET',
      );
    }

    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
      secure: true,
    });
  }

  uploadImageBuffer(
    buffer: Buffer,
    folder = 'Crowdfunding',
    tags?: string[],
    resourceType: ResourceType = 'image',
    // tuỳ chọn transform cơ bản để tối ưu ảnh
    transform: Record<string, any> = { quality: 'auto', fetch_format: 'auto' },
  ) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType, tags, ...transform },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) return reject(new BadRequestException(error.message));
          resolve(result!);
        },
      );
      stream.end(buffer);
    });
  }

  async uploadMany(
    buffers: Buffer[],
    folder?: string,
    tags?: string[],
    resourceType: ResourceType = 'image',
  ) {
    const results: UploadApiResponse[] = [];
    for (const b of buffers) {
      results.push(await this.uploadImageBuffer(b, folder, tags, resourceType));
    }
    return results;
  }

  async getResource(publicId: string, resourceType: ResourceType = 'image') {
    try {
      return await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
      });
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message ?? 'cloudinary.api.resource failed',
      );
    }
  }

  async listResources(opts: {
    folder?: string;
    prefix?: string;
    next_cursor?: string;
    max_results?: number;
  }) {
    const { folder, prefix, next_cursor, max_results = 20 } = opts || {};
    const parts = ['resource_type:image'];
    if (folder) parts.push(`folder="${folder}"`);
    if (prefix) parts.push(`prefix="${prefix}"`);

    try {
      return await cloudinary.search
        .expression(parts.join(' AND '))
        .max_results(max_results)
        .next_cursor(next_cursor as any)
        .execute();
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message ?? 'cloudinary.search failed',
      );
    }
  }

  async rename(
    publicId: string,
    toPublicId: string,
    resourceType: ResourceType = 'image',
  ) {
    try {
      return await cloudinary.uploader.rename(publicId, toPublicId, {
        resource_type: resourceType,
        overwrite: false,
        invalidate: true,
      });
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message ?? 'cloudinary.uploader.rename failed',
      );
    }
  }

  async deleteOne(publicId: string, resourceType: ResourceType = 'image') {
    try {
      return await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message ?? 'cloudinary.uploader.destroy failed',
      );
    }
  }

  async deleteMany(publicIds: string[], resourceType: ResourceType = 'image') {
    if (!publicIds?.length) throw new BadRequestException('publicIds empty');
    try {
      return await cloudinary.api.delete_resources(publicIds, {
        resource_type: resourceType,
        invalidate: true,
      });
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message ?? 'cloudinary.api.delete_resources failed',
      );
    }
  }
}
