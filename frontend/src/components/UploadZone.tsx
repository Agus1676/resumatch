import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const UploadZone = ({ onFileSelect, selectedFile }: UploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0]);
      setDragActive(false);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`upload-zone ${dragActive ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="upload-zone-content">
        <div className="upload-icon-wrap">
          {selectedFile ? "✅" : dragActive ? "📂" : "📄"}
        </div>
        {selectedFile ? (
          <>
            <p className="upload-title">{selectedFile.name}</p>
            <p className="upload-subtitle">{(selectedFile.size / 1024).toFixed(0)} KB · click para cambiar</p>
          </>
        ) : (
          <>
            <p className="upload-title">
              {dragActive ? "Soltá el archivo acá" : "Arrastrá tu CV aquí"}
            </p>
            <p className="upload-subtitle">o click para seleccionar · solo PDF · máx. 10MB</p>
          </>
        )}
      </div>
    </div>
  );
};
