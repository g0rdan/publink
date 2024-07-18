import * as vscode from 'vscode';
import { PackageData } from './data';

export class PubLinkModule {
    fileName: string = "pubspec.yaml";
    regex: RegExp = /^[\t ]+\b(?!sdk\b|git\b|url\b|ref\b|path\b|assets\b)[\w_]+\b:/gm;

    public async extractPackageInfo(document: vscode.TextDocument, position: vscode.Position): Promise<PackageData | null> {
        // Check if the current opened file in vscode is pubspec.yaml.
        if (!document.fileName.endsWith(this.fileName)) {
            return null;
        }

        // Check if substring falls into a category of strings that starts with a white space, 
        // than has a word that might contain "_", than ":" follows
        if (!document.getWordRangeAtPosition(position, this.regex)) {
            return null
        }
        
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null
        }

        const startPosition = range.start.character;
        const lineText = document.lineAt(position.line).text;
        if (startPosition == 0 || lineText.charAt(startPosition - 1) !== ' ') {
            return null;
        }

        const packageName = document.getText(range);
            // Define the URL based on the word or any specific logic
        const url = `https://pub.dev/packages/${packageName}`;

        // We want to make sure the URL is valid. There could be situations where
        // we have a git or local dependency, we don't want to mislead users with
        // these URLs.
        const isUrlValid = await this.checkURL(url)
        if (!isUrlValid) {
            return null;
        }

        return new PackageData(packageName, url);
    }

    // Check if given URL is valid by sending a HEAD request and
    // awaiting for 200 OK
    async checkURL(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
        });
        return response.ok
    } catch (error) {
        console.error('Error during the HEAD request', error);
		return false
    }
}
}