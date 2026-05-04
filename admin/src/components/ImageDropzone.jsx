import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

export default function ImageDropzone({ previewUrl, progress = 0, uploading = false, onFileSelect }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        onFileSelect?.(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border border-dashed bg-slate-50 transition ${
        isDragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-400 hover:bg-slate-100'
      }`}
    >
      <input {...getInputProps()} />

      {previewUrl ? (
        <div className="relative h-44 w-full">
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-3 text-xs font-medium text-white">
            {uploading ? `Uploading... ${progress}%` : 'Click or drop to replace image'}
          </div>
        </div>
      ) : (
        <div className="grid min-h-44 place-items-center p-5 text-center">
          <div className="grid gap-2">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
              <UploadCloud size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Drag and drop an image here</p>
              <p className="mt-1 text-xs text-slate-500">or click to browse files</p>
            </div>
          </div>
        </div>
      )}

      {uploading ? (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-200">
          <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
    </div>
  );
}