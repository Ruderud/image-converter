import { ChangeEvent, useEffect, useState } from 'react';
import { convertImg } from './utils/convertImg';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(1);
  const [maxWidth, setMaxWidth] = useState(500);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPreviewURL(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleQualityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuality(parseFloat(event.target.value));
  };

  const handleMaxWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMaxWidth(parseInt(event.target.value));
  };

  const handleConvertAndDownload = async () => {
    if (selectedFile) {
      const convertedBlob = await convertImg(selectedFile, maxWidth, quality);

      const downloadLink = document.createElement('a');
      const webpURL = URL.createObjectURL(convertedBlob);
      downloadLink.href = webpURL;
      downloadLink.download = 'converted.webp';
      downloadLink.click();

      URL.revokeObjectURL(webpURL);
    }
  };

  return (
    <div>
      <h2>Image Converter</h2>
      <h4>to webp</h4>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <input type="number" min="0" max="1" step="0.1" value={quality} onChange={handleQualityChange} />
      <input type="number" min="0" value={maxWidth} onChange={handleMaxWidthChange} />
      {previewURL && <img src={previewURL} alt="Preview" />}
      <button onClick={handleConvertAndDownload}>Convert and Download</button>
    </div>
  );
}

export default App;
