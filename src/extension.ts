// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { PubLinkModule } from "./module";
import { StringBuilder } from "./utils";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "publink" is now active!');

  // Create an instance of the module
  const module = new PubLinkModule();

  // Register hover provider
  const hoverProvider = vscode.languages.registerHoverProvider("*", {
    async provideHover(document, position, token) {
      const publinkData = await module.extractPackageInfo(document, position);
      if (publinkData !== null) {
        // Create the hover content
        const sBuilder = new StringBuilder();
        if (publinkData.name !== undefined) {
          sBuilder.append(`#### [${publinkData.name}]`);
        }
        if (publinkData.url !== undefined) {
          sBuilder.append(`(${publinkData.url})`);
        }
        if (publinkData.name !== undefined) {
          sBuilder.append(`\n\n`);
        }
        if (publinkData.updated !== undefined) {
          sBuilder.appendLine(`- Updated ${publinkData.updated}`);
        }
        if (publinkData.likes !== undefined) {
          sBuilder.appendLine(`- ${publinkData.likes} likes`);
        }
        if (publinkData.points !== undefined) {
          sBuilder.appendLine(`- ${publinkData.points} pub points`);
        }
        if (publinkData.popularity !== undefined) {
          sBuilder.appendLine(`- ${publinkData.popularity}% popularity`);
        }
        if (publinkData.publisherUrl !== undefined) {
          sBuilder.appendLine(
            `- [Publisher](https://${publinkData.publisherUrl})`
          );
        }
        const markdownString = new vscode.MarkdownString(sBuilder.toString());
        markdownString.isTrusted = true;
        return new vscode.Hover(markdownString);
      }
    },
  });

  context.subscriptions.push(hoverProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
