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
			const fileName = document.fileName;

			if (fileName.endsWith('pubspec.yaml')) {
				const range = document.getWordRangeAtPosition(position);
            	const packageName = document.getText(range);

            	// Define the URL based on the packageName or any specific logic
            	const url = `https://pub.dev/packages/${packageName}`;

            	// Create the hover content
            	const markdownString = new vscode.MarkdownString(`[Learn more about ${packageName}](${url})`);
            	markdownString.isTrusted = true;

            	return new vscode.Hover(markdownString);
			}
        }
    });

	context.subscriptions.push(hoverProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
