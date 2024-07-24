export class PackageData {
  constructor(
    public readonly name?: string,
    public readonly url?: string,
    public readonly updated?: string,
    public readonly likes?: string,
    public readonly points?: string,
    public readonly popularity?: string,
    public readonly publisherUrl?: string
  ) {}

  public copyWith({
    name,
    url,
    updated,
    likes,
    points,
    popularity,
    publisherUrl,
  }: {
    name?: string;
    url?: string;
    updated?: string;
    likes?: string;
    points?: string;
    popularity?: string;
    publisherUrl?: string;
  }): PackageData {
    return new PackageData(
      name !== undefined ? name : this.name,
      url !== undefined ? url : this.url,
      updated !== undefined ? updated : this.updated,
      likes !== undefined ? likes : this.likes,
      points !== undefined ? points : this.points,
      popularity !== undefined ? popularity : this.popularity,
      publisherUrl !== undefined ? publisherUrl : this.publisherUrl
    );
  }

  public toString(): string {
    return `PackageData(name: ${this.name}, email: ${this.url}), 
    updated ${this.updated}, likes ${this.likes}, points ${this.points}, 
    popularity ${this.popularity}, publisherUrl ${this.publisherUrl}`;
  }

  public equals(other: PackageData): boolean {
    return (
      this.name === other.name &&
      this.url === other.url &&
      this.updated === other.updated &&
      this.likes === other.likes &&
      this.points === other.points &&
      this.popularity === other.popularity &&
      this.publisherUrl === other.publisherUrl
    );
  }
}
