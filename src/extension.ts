// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "publink" is now active!');

	// Register hover provider
    const hoverProvider = vscode.languages.registerHoverProvider('*', {
        provideHover(document, position, token) {
			// Check if the current opened file in vscode is pubspec.yaml.
			if (!document.fileName.endsWith('pubspec.yaml')) {
				return null;
			}

			// Check if substring falls into a category of strings that starts with a white space, 
			// than has a word that might contain "_", than ":" follows
			if (!document.getWordRangeAtPosition(position, /^[\t ]+\b(?!sdk\b|assets\b)[\w_]+\b:/gm)) {
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
			// Create the hover content
			const markdownString = new vscode.MarkdownString(`Learn more about [${packageName}](${url})`);
			markdownString.isTrusted = true;

			return new vscode.Hover(markdownString);
        }
    });

	context.subscriptions.push(hoverProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
