export type IR2Service = {
  uploadObject: (body: Buffer, key: string) => Promise<URL>;
  updateObject: (body: Buffer, key: string) => Promise<URL>;
  deleteObject: (key: string) => Promise<void>;
};
