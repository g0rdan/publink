import { JSDOM } from "jsdom";
import { PackageData } from "./data";
import * as vscode from "vscode";
import axios from "axios";

export class PubLinkModule {
  fileName: string = "pubspec.yaml";
  regex: RegExp =
    /^[\t ]+\b(?!sdk\b|git\b|url\b|ref\b|path\b|assets\b)[\w_]+\b:/gm;

  public async extractPackageInfo(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<PackageData | null> {
    // Check if the current opened file in vscode is pubspec.yaml.
    if (!document.fileName.endsWith(this.fileName)) {
      return null;
    }

    // Check if substring falls into a category of strings that starts with a white space,
    // than has a word that might contain "_", than ":" follows
    if (!document.getWordRangeAtPosition(position, this.regex)) {
      return null;
    }

    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    const startPosition = range.start.character;
    const lineText = document.lineAt(position.line).text;
    if (startPosition === 0 || lineText.charAt(startPosition - 1) !== " ") {
      return null;
    }

    const packageName = document.getText(range);
    // Define the URL based on the word or any specific logic
    const url = `https://pub.dev/packages/${packageName}`;

    // We want to make sure the URL is valid. There could be situations where
    // we have a git or local dependency, we don't want to mislead users with
    // these URLs.
    const isUrlValid = await this.checkURL(url);
    if (!isUrlValid) {
      return null;
    }

    const data = (await this.fetchAndParse(url)).copyWith({
      name: packageName,
      url: url,
    });

    return data;
  }

  // Check if given URL is valid by sending a HEAD request and
  // awaiting for 200 OK
  async checkURL(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: "HEAD",
      });
      return response.ok;
    } catch (error) {
      console.error("Error during the HEAD request", error);
      return false;
    }
  }

  async fetchAndParse(url: string): Promise<PackageData> {
    var data = new PackageData();
    try {
      // Fetch the HTML content from the web
      const response = await axios.get(url);
      const html = response.data;

      // Parse the HTML content using jsdom
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Example: Extract the content of the <title> tag
      const publisherURL =
        document.querySelector("a.-pub-publisher")?.textContent;
      if (typeof publisherURL === "string") {
        data = data.copyWith({ publisherUrl: publisherURL });
      }

      const updated = document.querySelector("a.-x-ago")?.textContent;
      if (typeof updated === "string") {
        data = data.copyWith({ updated: updated });
      }

      const likes = document.querySelector(
        "span.packages-score-value-number"
      )?.textContent;
      if (typeof likes === "string") {
        data = data.copyWith({ likes: likes });
      }

      const pubPoints = document.querySelector(
        ".packages-score-health .packages-score-value-number"
      )?.textContent;
      if (typeof pubPoints === "string") {
        data = data.copyWith({ points: pubPoints });
      }

      const popularity = document.querySelector(
        ".packages-score-popularity .packages-score-value-number"
      )?.textContent;
      if (typeof popularity === "string") {
        data = data.copyWith({ popularity: popularity });
      }
    } catch (error) {
      console.error(`Error fetching or parsing the URL: ${error}`);
    }

    return data;
  }
}
