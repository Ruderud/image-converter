import { ChangeEvent, useEffect, useState } from 'react';
import { convertImg } from './utils/convertImg';
import { Box } from '@mui/material';
import { useDragDrop } from './hooks/useDragDrop';
import JSZip from 'jszip';

function App() {
  const [uploadedImgs, setUploadedImgs] = useState<FileList | null>(null);
  const [quality, setQuality] = useState(1);
  const [maxWidth, setMaxWidth] = useState(500);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedImgs) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPreviewURL(event.target.result);
        }
      };
      reader.readAsDataURL(uploadedImgs[0]);
    }
  }, [uploadedImgs]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedImgs(event.target.files);
    }
  };

  const handleQualityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuality(parseFloat(event.target.value));
  };

  const handleMaxWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMaxWidth(parseInt(event.target.value));
  };

  const handleConvertAndDownload = async () => {
    if (uploadedImgs) {
      const zip = new JSZip();

      await Promise.all(
        [...uploadedImgs].map(async (uploadedImg) => {
          const convertedImg = await convertImg(uploadedImg, maxWidth, quality);
          zip.file(`${uploadedImg.name.replace(/\.\w+$/, '')}.webp`, convertedImg);
        })
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' }).then((content) => {
        return new Blob([content], { type: 'application/zip' });
      });

      const downloadLink = document.createElement('a');
      const webpURL = URL.createObjectURL(zipBlob);
      downloadLink.href = webpURL;
      downloadLink.download = 'converted.zip';
      downloadLink.click();

      URL.revokeObjectURL(webpURL);
    }
  };

  const { dragDropRef, isDrag } = useDragDrop({
    postImageCallBack: (files: FileList) => {
      setUploadedImgs(files);
    },
  });

  return (
    <div>
      <h2>Image Converter</h2>
      <h4>to webp</h4>

      <Box
        ref={dragDropRef}
        sx={{
          filter: isDrag ? 'blur(3px)' : 'none',
          width: '100px',
          height: '100px',
        }}
      >
        {isDrag ? '여기에 드레그 드랍' : '드레그 드랍 또는 파일 선택으로 이미지 선택'}
      </Box>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <input type="number" min="0" max="1" step="0.1" value={quality} onChange={handleQualityChange} />
      <input type="number" min="0" value={maxWidth} onChange={handleMaxWidthChange} />
      {previewURL && <img src={previewURL} alt="Preview" />}
      <button onClick={handleConvertAndDownload}>Convert and Download</button>
    </div>
  );
}

export default App;
