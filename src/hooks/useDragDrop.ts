import { useCallback, useEffect, useRef, useState } from 'react';

type UseDragDropParams = {
  postImageCallBack?: (imageFileList: FileList) => void;
};

export const useDragDrop = ({ postImageCallBack }: UseDragDropParams) => {
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const dragDropRef = useRef<HTMLLabelElement>(null);

  const handleDropFile = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer === null) return;
      if (event.dataTransfer.files.length === 0) return;
      const draggedImageFiles = event.dataTransfer.files;
      postImageCallBack && postImageCallBack(draggedImageFiles);
      setIsDrag(false);
    },
    [postImageCallBack, setIsDrag]
  );

  useEffect(() => {
    if (dragDropRef.current === null) return;
    dragDropRef.current.addEventListener('dragleave', () => setIsDrag(false));
    dragDropRef.current.addEventListener('dragover', (event: DragEvent): void => {
      event.preventDefault();
      if (event.dataTransfer!.files) {
        setIsDrag(true);
      }
    });
    dragDropRef.current.addEventListener('drop', handleDropFile);
  }, [handleDropFile, setIsDrag]);

  return { dragDropRef, isDrag };
};
