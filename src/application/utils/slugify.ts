const slugify = (input = ''): string => {
  return input
    .normalize('NFD') // split accents from base characters
    .replace(/\p{Diacritic}/gu, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse spaces to dashes
    .replace(/-+/g, '-') // collapse multiple dashes
    .replace(/^-+|-+$/g, ''); // remove leading/trailing dash
};

export default slugify;
