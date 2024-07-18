export class PackageData {
    constructor(
        public readonly name: string,
        public readonly url: string
    ) {}

    public toString(): string {
        return `PackageData(name: ${this.name}, email: ${this.url})`;
    }

    public equals(other: PackageData): boolean {
        return this.name === other.name && this.url === other.url;
    }
}