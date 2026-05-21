import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Check, CropIcon, Move, UploadCloud, X, ZoomIn, ZoomOut } from 'lucide-react';

// ─── Canvas-based image position & zoom editor ───────────────────────────────
// No external dependencies — uses browser Canvas API only.
// Lets the admin pan and zoom the image before uploading.

function ImageEditor({ src, onConfirm, onCancel }) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  // Target output dimensions (16:9 landscape, good for project cards)
  const OUTPUT_W = 1280;
  const OUTPUT_H = 720;
  const PREVIEW_W = 560;
  const PREVIEW_H = 315;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, PREVIEW_W, PREVIEW_H);

    // Fill background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, PREVIEW_W, PREVIEW_H);

    // Fit image to canvas maintaining aspect ratio, then apply scale + offset
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = PREVIEW_W / PREVIEW_H;
    let baseW, baseH;
    if (imgAspect > canvasAspect) {
      baseH = PREVIEW_H;
      baseW = baseH * imgAspect;
    } else {
      baseW = PREVIEW_W;
      baseH = baseW / imgAspect;
    }

    const drawW = baseW * scale;
    const drawH = baseH * scale;
    const drawX = (PREVIEW_W - drawW) / 2 + offset.x;
    const drawY = (PREVIEW_H - drawH) / 2 + offset.y;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Grid overlay
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo((PREVIEW_W / 3) * i, 0);
      ctx.lineTo((PREVIEW_W / 3) * i, PREVIEW_H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (PREVIEW_H / 3) * i);
      ctx.lineTo(PREVIEW_W, (PREVIEW_H / 3) * i);
      ctx.stroke();
    }
  }, [scale, offset]);

  const onImgLoad = useCallback(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Redraw whenever scale/offset changes
  const prevScale = useRef(scale);
  const prevOffset = useRef(offset);
  if (prevScale.current !== scale || prevOffset.current !== offset) {
    prevScale.current = scale;
    prevOffset.current = offset;
    requestAnimationFrame(drawCanvas);
  }

  const handleMouseDown = (e) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };
  const handleMouseUp = () => { dragging.current = false; };

  // Touch support
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      dragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  const handleTouchMove = (e) => {
    if (!dragging.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastPos.current.x;
    const dy = e.touches[0].clientY - lastPos.current.y;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };
  const handleTouchEnd = () => { dragging.current = false; };

  const handleConfirm = () => {
    // Render at full output resolution
    const offscreen = document.createElement('canvas');
    offscreen.width = OUTPUT_W;
    offscreen.height = OUTPUT_H;
    const ctx = offscreen.getContext('2d');
    const img = imgRef.current;
    if (!img) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, OUTPUT_W, OUTPUT_H);

    const scaleRatio = OUTPUT_W / PREVIEW_W;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = PREVIEW_W / PREVIEW_H;
    let baseW, baseH;
    if (imgAspect > canvasAspect) {
      baseH = PREVIEW_H;
      baseW = baseH * imgAspect;
    } else {
      baseW = PREVIEW_W;
      baseH = baseW / imgAspect;
    }

    const drawW = baseW * scale * scaleRatio;
    const drawH = baseH * scale * scaleRatio;
    const drawX = (OUTPUT_W - drawW) / 2 + offset.x * scaleRatio;
    const drawY = (OUTPUT_H - drawH) / 2 + offset.y * scaleRatio;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    offscreen.toBlob((blob) => {
      if (blob) onConfirm(blob);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <CropIcon size={16} className="text-brand-600" />
            <span className="text-sm font-semibold text-slate-800">Adjust Image Position & Zoom</span>
          </div>
          <button type="button" onClick={onCancel} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>

        {/* Canvas editor */}
        <div className="bg-slate-900 flex justify-center p-4">
          <canvas
            ref={canvasRef}
            width={PREVIEW_W}
            height={PREVIEW_H}
            className="rounded-lg cursor-grab active:cursor-grabbing select-none"
            style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          {/* Hidden img for drawing */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            className="hidden"
            crossOrigin="anonymous"
            onLoad={onImgLoad}
          />
        </div>

        {/* Controls */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-slate-400 flex-shrink-0" />
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="flex-1 accent-brand-600"
            />
            <ZoomIn size={16} className="text-slate-400 flex-shrink-0" />
            <span className="text-xs font-mono text-slate-500 w-10 text-right">{Math.round(scale * 100)}%</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <Move size={12} />
            Drag to reposition · Scroll to zoom
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-5 py-3">
          <button
            type="button"
            onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <Check size={14} />
              Use This Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ImageDropzone component ────────────────────────────────────────────

export default function ImageDropzone({ previewUrl, progress = 0, uploading = false, onFileSelect }) {
  const [editorSrc, setEditorSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles?.[0];
      if (!file) return;
      // Open editor before uploading
      const objectUrl = URL.createObjectURL(file);
      setEditorSrc(objectUrl);
      setPendingFile(file);
    },
  });

  const handleEditorConfirm = (croppedBlob) => {
    // Convert blob to File so the upload handler receives a proper File object
    const croppedFile = new File([croppedBlob], pendingFile?.name || 'project-image.jpg', {
      type: 'image/jpeg',
    });
    setEditorSrc(null);
    setPendingFile(null);
    onFileSelect?.(croppedFile);
  };

  const handleEditorCancel = () => {
    setEditorSrc(null);
    setPendingFile(null);
  };

  return (
    <>
      {editorSrc && (
        <ImageEditor
          src={editorSrc}
          onConfirm={handleEditorConfirm}
          onCancel={handleEditorCancel}
        />
      )}

      <div
        {...getRootProps()}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border border-dashed bg-slate-50 transition ${
          isDragActive
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-200 hover:border-brand-400 hover:bg-slate-100'
        }`}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative" style={{ aspectRatio: '16/9' }}>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-200">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1 text-white">
                <UploadCloud size={24} />
                <span className="text-xs font-semibold">Click or drop to replace</span>
              </div>
            </div>
            {/* Upload progress bar */}
            {uploading && (
              <div className="absolute inset-x-0 bottom-0">
                <div className="h-1 bg-slate-200">
                  <div
                    className="h-full bg-brand-600 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-white">
                  Uploading... {progress}%
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid place-items-center p-8 text-center" style={{ minHeight: '180px' }}>
            <div className="grid gap-3">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <UploadCloud size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {isDragActive ? 'Drop image here' : 'Drag & drop a project image'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  or click to browse · JPG, PNG, WebP · Auto-cropped to 16:9
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
