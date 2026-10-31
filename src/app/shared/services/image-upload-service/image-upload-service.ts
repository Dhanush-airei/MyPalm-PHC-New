import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Camera } from '@capacitor/camera';
import { firstValueFrom } from 'rxjs';

import { UserContext } from '../user-context-service/user-context';
import { API_ENDPOINTS } from 'src/app/shared/constants/api-endpoints';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    private userContext: UserContext,
  ) {}

  // force to fixed size code like 500 (500 x 500), 600 (600 x 600)
  // async imageUploadCommon(type: string): Promise<any> {
  //   try {
  //     const photo = await Camera.takePhoto({
  //       quality: 65,
  //       saveToGallery: false,
  //       correctOrientation: true,
  //     });

  //     if (!photo.webPath) {
  //       throw new Error('Image not captured');
  //     }

  //     // Print original image information
  //     const originalBlob = await fetch(photo.webPath).then((res) => res.blob());

  //     console.log('==============================');
  //     console.log('Original Image');
  //     console.log('Size (Bytes):', originalBlob.size);
  //     console.log('Size (KB):', (originalBlob.size / 1024).toFixed(2));
  //     console.log('Size (MB):', (originalBlob.size / (1024 * 1024)).toFixed(2));
  //     console.log('==============================');

  //     // Crop to square + compress
  //     const targetSize = 500;
  //     let quality = 0.8;
  //     let blob = await this.cropAndResizeImage(
  //       photo.webPath,
  //       targetSize,
  //       quality,
  //     );

  //     while (blob.size > 2 * 1024 * 1024 && quality > 0.3) {
  //       quality -= 0.1;
  //       blob = await this.cropAndResizeImage(
  //         photo.webPath,
  //         targetSize,
  //         quality,
  //       );
  //     }

  //     console.log('Compressed Image');
  //     console.log('Quality:', quality);
  //     console.log('Size (Bytes):', blob.size);
  //     console.log('Size (KB):', (blob.size / 1024).toFixed(2));
  //     console.log('Size (MB):', (blob.size / (1024 * 1024)).toFixed(2));
  //     console.log('==============================');

  //     const formData = new FormData();
  //     formData.append('upload_filename', blob, `IMG_${Date.now()}.jpg`);
  //     formData.append('request', '');
  //     formData.append('type', type);
  //     formData.append('user_id', this.userContext.userId.toString());
  //     formData.append('millcode', this.userContext.millCode);
  //     formData.append('dept_id', this.userContext.departmentId.toString());

  //     const endpoint = localStorage.getItem('endpoint');
  //     const url = `${endpoint}/${API_ENDPOINTS.generic_image_upload}`;

  //     return await firstValueFrom(this.http.post(url, formData));
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  // /**
  //  * Center-crops the source image into a square, then resizes it to
  //  * exactly `size` x `size` pixels. Guarantees fixed output dimensions
  //  * regardless of the original image's aspect ratio (portrait or landscape).
  //  */
  // private async cropAndResizeImage(
  //   webPath: string,
  //   size: number,
  //   quality: number,
  // ): Promise<Blob> {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();

  //     img.onload = () => {
  //       console.log('Original Width :', img.width);
  //       console.log('Original Height:', img.height);

  //       const canvas = document.createElement('canvas');
  //       canvas.width = size;
  //       canvas.height = size;

  //       const ctx = canvas.getContext('2d');

  //       if (!ctx) {
  //         reject(new Error('Canvas context not available'));
  //         return;
  //       }

  //       // Find the largest centered square within the source image
  //       const sourceSize = Math.min(img.width, img.height);
  //       const sx = (img.width - sourceSize) / 2;
  //       const sy = (img.height - sourceSize) / 2;

  //       console.log('Crop Source Size:', sourceSize, 'sx:', sx, 'sy:', sy);

  //       // Draw that square region scaled to fill the exact target canvas
  //       ctx.drawImage(
  //         img,
  //         sx,
  //         sy,
  //         sourceSize,
  //         sourceSize, // source crop rect (square)
  //         0,
  //         0,
  //         size,
  //         size, // destination rect (exact size x size)
  //       );

  //       console.log('Cropped/Resized Width :', canvas.width);
  //       console.log('Cropped/Resized Height:', canvas.height);

  //       canvas.toBlob(
  //         (blob) => {
  //           if (blob) {
  //             console.log('Compressed Blob Size:', blob.size);
  //             resolve(blob);
  //           } else {
  //             reject(new Error('Canvas toBlob failed'));
  //           }
  //         },
  //         'image/jpeg',
  //         quality,
  //       );
  //     };

  //     img.onerror = () =>
  //       reject(new Error('Failed to load image for cropping'));
  //     img.src = webPath;
  //   });
  // }

  async imageUploadCommon(type: string): Promise<any> {
    try {
      const photo = await Camera.takePhoto({
        quality: 65,
        saveToGallery: false,
        correctOrientation: true,
      });

      if (!photo.webPath) {
        throw new Error('Image not captured');
      }

      // Print original image information
      const originalBlob = await fetch(photo.webPath).then((res) => res.blob());

      console.log('==============================');
      console.log('Original Image');
      console.log('Size (Bytes):', originalBlob.size);
      console.log('Size (KB):', (originalBlob.size / 1024).toFixed(2));
      console.log('Size (MB):', (originalBlob.size / (1024 * 1024)).toFixed(2));
      console.log('==============================');

      // Compress using original dimensions (no square crop/resize)
      let quality = 0.8;
      let blob = await this.resizeImage(photo.webPath, quality);

      while (blob.size > 2 * 1024 * 1024 && quality > 0.3) {
        quality -= 0.1;
        blob = await this.resizeImage(photo.webPath, quality);
      }

      console.log('Compressed Image');
      console.log('Quality:', quality);
      console.log('Size (Bytes):', blob.size);
      console.log('Size (KB):', (blob.size / 1024).toFixed(2));
      console.log('Size (MB):', (blob.size / (1024 * 1024)).toFixed(2));
      console.log('==============================');

      const formData = new FormData();
      formData.append('upload_filename', blob, `IMG_${Date.now()}.jpg`);
      formData.append('request', '');
      formData.append('type', type);
      formData.append('user_id', this.userContext.userId.toString());
      formData.append('millcode', this.userContext.millCode);
      formData.append('dept_id', this.userContext.departmentId.toString());

      const endpoint = localStorage.getItem('endpoint');
      const url = `${endpoint}/${API_ENDPOINTS.generic_image_upload}`;

      return await firstValueFrom(this.http.post(url, formData));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Draws the source image onto a canvas at its own natural width/height
   * (no cropping, no forced square, no resizing) and compresses it via
   * the given JPEG quality.
   */
  private async resizeImage(webPath: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        console.log('Original Width :', img.width);
        console.log('Original Height:', img.height);

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw the full image at its own natural size, no cropping
        ctx.drawImage(img, 0, 0, img.width, img.height);

        console.log('Output Width :', canvas.width);
        console.log('Output Height:', canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('Compressed Blob Size:', blob.size);
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          },
          'image/jpeg',
          quality,
        );
      };

      img.onerror = () =>
        reject(new Error('Failed to load image for resizing'));
      img.src = webPath;
    });
  }
}
