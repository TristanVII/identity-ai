import sharp from "sharp"

const CELL_SIZE = 512
const GRID_COLS = 3
const GRID_ROWS = 3

export async function compositeNineGrid(images: Buffer[]): Promise<Buffer> {
  if (images.length !== 9) {
    throw new Error(`Expected 9 images, got ${images.length}`)
  }

  const resized = await Promise.all(
    images.map((img) =>
      sharp(img)
        .resize(CELL_SIZE, CELL_SIZE, { fit: "cover" })
        .png()
        .toBuffer()
    )
  )

  const composites = resized.map((buf, i) => ({
    input: buf,
    left: (i % GRID_COLS) * CELL_SIZE,
    top: Math.floor(i / GRID_COLS) * CELL_SIZE,
  }))

  return sharp({
    create: {
      width: CELL_SIZE * GRID_COLS,
      height: CELL_SIZE * GRID_ROWS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer()
}
