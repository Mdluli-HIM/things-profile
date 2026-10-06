export type GalleryImage = { src: string; title: string; width: number; height: number };
export type GalleryCell = { key: string; photo: GalleryImage; x: number; y: number; width: number; height: number };
export const modulo = (value: number, period: number) => ((value % period) + period) % period;

export function galleryLayout(viewWidth: number, viewHeight: number, x: number, y: number, photos: GalleryImage[]) {
  const mobile = viewWidth < 768;
  const size = mobile ? Math.min(220, viewWidth * .55) : Math.min(420, Math.max(240, viewWidth * .22));
  const gap = mobile ? 32 : 64;
  const stepX = size + gap;
  const stepY = size * 1.5 + gap;
  const column = Math.floor(x / stepX);
  const row = Math.floor(y / stepY);
  const cells: GalleryCell[] = [];
  if (photos.length) {
    for (let r = row - 1; r <= row + Math.ceil(viewHeight / stepY) + 1; r++) {
      for (let c = column - 1; c <= column + Math.ceil(viewWidth / stepX) + 1; c++) {
        const index = modulo(r * 7 + c, photos.length);
        const photo = photos[index];
        let width = size * [1, .82, .94, .88][index % 4];
        let height = width * photo.height / photo.width;
        if (height > size * 1.5) { width *= size * 1.5 / height; height = size * 1.5; }
        cells.push({ key: r + ":" + c, photo, width, height,
          x: c * stepX + gap / 2 + (size - width) / 2,
          y: r * stepY + gap * .25 + (index % 3) * gap * .12 });
      }
    }
  }
  return { cells, stepX, stepY, column, row };
}
