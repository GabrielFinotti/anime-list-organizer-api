class About {
  private readonly _value: string;

  private constructor(about: string) {
    this._value = about;
  }

  get value() {
    return this._value;
  }

  static create(about: string, isAnimeAbout = false) {
    const normalizedAbout = about.trim();

    this.validateAbout(normalizedAbout, isAnimeAbout);

    return new About(normalizedAbout);
  }

  private static validateAbout(about: string, isAnimeAbout: boolean) {
    if (isAnimeAbout && (about.length < 20 || about.length > 1500)) {
      throw new Error("About must be between 20 and 1500 characters");
    } else if (!isAnimeAbout && (about.length < 10 || about.length > 500)) {
      throw new Error("About must be between 10 and 500 characters");
    }
  }

  equals(other: About) {
    return this._value === other.value;
  }
}

export default About;
