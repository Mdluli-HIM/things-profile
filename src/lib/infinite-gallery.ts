export type GalleryImage = {
  src: string;
  title: string;
  width: number;
  height: number;
};

export type GalleryCell = {
  key: string;
  photo: GalleryImage;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const modulo = (value: number, period: number) =>
  ((value % period) + period) % period;

export function galleryLayout(
  viewWidth: number,
  viewHeight: number,
  x: number,
  y: number,
  photos: GalleryImage[]
) {
  const mobile = viewWidth < 768;
  const columns = mobile ? 2 : viewWidth < 1200 ? 4 : 6;
  const stepX = viewWidth / columns;
  const width = mobile
    ? Math.min(160, stepX * 0.78)
    : Math.min(220, stepX * 0.56);
  const height = width * 0.75;
  const stepY = mobile ? height + 80 : height + 180;
  const insetX = (stepX - width) / 2;
  const insetY = mobile ? 24 : 32;
  const column = Math.floor(x / stepX);
  const row = Math.floor(y / stepY);
  const cells: GalleryCell[] = [];

  if (photos.length) {
    for (
      let r = row - 1;
      r <= row + Math.ceil(viewHeight / stepY) + 1;
      r++
    ) {
      for (
        let c = column - 1;
        c <= column + Math.ceil(viewWidth / stepX) + 1;
        c++
      ) {
        const index = modulo(r * columns + c, photos.length);
        cells.push({
          key: r + ":" + c,
          photo: photos[index],
          width,
          height,
          x: c * stepX + insetX,
          y: r * stepY + insetY
        });
      }
    }
  }

  return { cells, stepX, stepY, column, row };
}
