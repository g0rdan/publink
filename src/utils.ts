export class StringBuilder {
  private values: string[];

  constructor(initialValue: string = "") {
    this.values = [initialValue];
  }

  append(value: string): StringBuilder {
    this.values.push(value);
    return this;
  }

  appendLine(value: string = ""): StringBuilder {
    this.values.push(value + "\n");
    return this;
  }

  clear(): StringBuilder {
    this.values = [];
    return this;
  }

  toString(): string {
    return this.values.join("");
  }
}
