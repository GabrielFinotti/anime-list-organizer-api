export class DuplicateAnimeTitleError extends Error {
  constructor(title: string) {
    super(`Já existe um anime com o título: ${title}`);
    
    this.name = "DuplicateAnimeTitleError";
  }
}
