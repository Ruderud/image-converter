export const convertImg = (file: File, maxWidth: number, quality: number): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const canvas = document.createElement('canvas');

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          resolve(blob);
        },
        'image/webp',
        quality
      );
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        img.src = event.target.result;
      }
    };

    reader.readAsDataURL(file);
  });
};
