export type IImagesService = {
  downloadImage: (url: string, name: string) => Promise<Buffer>;
};
