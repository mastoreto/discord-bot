import { Jimp } from 'jimp';

/**
 * Merge multiple images into a single image.
 *
 * @param imageUrls - Array of URLs of the images to merge.
 * @param bgImageUrl - URL of the background image.
 * @param foilFlags - Array of booleans indicating which
 *   images are foil.
 * @param foilEmblemUrl - URL of the foil emblem image.
 * @param margin - Margin between images.
 * @returns - The merged image as a buffer.
 */
export const mergeImages = async (
  imageUrls: Array<string>,
  foilFlags: Array<boolean>,
  foilEmblemUrl?: string,
  bgImageUrl?: string,
  margin = 20,
): Promise<Buffer> => {
  // Load all images in the array
  const images = await Promise.all(imageUrls.map((url) => Jimp.read(url)));

  // Load the foil emblem if provided
  let foilEmblem;
  if (foilEmblemUrl) foilEmblem = await Jimp.read(foilEmblemUrl);

  // Calculate the final width and height, considering the margins
  const finalWidth = images.reduce((width, img) => width + img.bitmap.width, 0) + margin * (images.length + 1);
  const finalHeight = Math.max(...images.map((img) => img.bitmap.height)) + margin * 2;

  // If backgroundUrl is provided, load and resize the background, otherwise create a blank background
  let background;
  if (bgImageUrl) {
    background = await Jimp.read(bgImageUrl);
    background.resize({ w: finalWidth, h: finalHeight });
  } else {
    // Transparent background
    background = new Jimp({ width: finalWidth, height: finalHeight, color: 0x00000000 });
  }

  // Create a new blank image for the final composite
  const finalImage = new Jimp({ width: finalWidth, height: finalHeight });

  // Composite the background first
  finalImage.composite(background, 0, 0);

  // Composite each image with margin
  let xPosition = margin;
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    finalImage.composite(img, xPosition, margin);

    // If the image is foil, add the emblem to the top-left corner
    if (foilFlags[i] && foilEmblem) {
      const emblemXPosition = xPosition + img!.bitmap.width - foilEmblem.bitmap.width - 20;
      const emblemYPosition = margin + 50;
      finalImage.composite(foilEmblem, emblemXPosition, emblemYPosition); // Position emblem slightly offset
    }

    xPosition += img!.bitmap.width + margin;
  }

  // Convert the final image to buffer
  return await finalImage.getBuffer('image/png');
};
