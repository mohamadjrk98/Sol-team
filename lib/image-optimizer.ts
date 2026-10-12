/** Browser-side image compression before uploading to the existing admin API. */
export const MAX_ORIGINAL_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 1_850_000; // comfortably below Vercel request limits
const SUPPORTED = ['image/jpeg', 'image/png', 'image/webp'];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('تعذر قراءة الصورة. جرّب صورة أخرى.')); };
    img.src = url;
  });
}
function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob(
    blob => blob ? resolve(blob) : reject(new Error('فشل ضغط الصورة.')),
    'image/webp', quality
  ));
}
export async function optimizeImage(file: File): Promise<File> {
  if (!SUPPORTED.includes(file.type)) throw new Error('الصور المقبولة JPG أو PNG أو WEBP فقط.');
  if (file.size > MAX_ORIGINAL_IMAGE_BYTES) throw new Error('الحد الأقصى للصورة الأصلية 10MB.');
  if (file.size === 0) throw new Error('الصورة فارغة.');
  const image = await loadImage(file);
  if (!image.naturalWidth || !image.naturalHeight) throw new Error('أبعاد الصورة غير صالحة.');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('المتصفح لا يدعم ضغط الصور.');
  // Preserve transparency for logos and PNGs; never crop.
  let scale = Math.min(1, 2200 / Math.max(image.naturalWidth, image.naturalHeight));
  let best: Blob | null = null;
  for (let round = 0; round < 7; round++) {
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.86, 0.76, 0.64, 0.52]) {
      const candidate = await encode(canvas, quality);
      if (!best || candidate.size < best.size) best = candidate;
      if (candidate.size <= MAX_UPLOAD_BYTES) {
        return new File([candidate], (file.name.replace(/\.[^.]+$/, '') || 'image') + '.webp', {type:'image/webp'});
      }
    }
    scale *= 0.78;
  }
  if (!best || best.size > MAX_UPLOAD_BYTES) throw new Error('تعذر ضغط الصورة للحجم المناسب. جرّب صورة أصغر.');
  return new File([best], (file.name.replace(/\.[^.]+$/, '') || 'image') + '.webp', {type:'image/webp'});
}

/** Same signature as fetch, for existing upload handlers. */
export async function uploadOptimizedImage(input: string, init: RequestInit): Promise<Response> {
  const form = init.body;
  if (input !== '/api/admin/upload' || !(form instanceof FormData)) return fetch(input, init);
  const original = form.get('file');
  if (!(original instanceof File)) throw new Error('لم يتم اختيار صورة.');
  const optimized = await optimizeImage(original);
  const body = new FormData();
  form.forEach((value, key) => body.append(key, key === 'file' ? optimized : value));
  return fetch(input, {...init, body});
}
