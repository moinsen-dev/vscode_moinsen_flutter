import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { generateIndexFiles } from './createIndexOperations';
import { removeIndexFiles } from './removeIndexOperations';

/**
 * Activates the Moinsen Flutter extension.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Moinsen Flutter extension is now active!');

    // Register Manage Index Command
    let manageDisposable = vscode.commands.registerCommand('moinsenFlutter.manageIndex', async (resource: vscode.Uri) => {
        const targetPath = resource ? resource.fsPath : vscode.workspace.rootPath;

        if (!targetPath) {
            vscode.window.showErrorMessage('No folder or file selected.');
            return;
        }

        const stats = fs.statSync(targetPath);
        const directory = stats.isDirectory() ? targetPath : path.dirname(targetPath);

        // Present Quick Pick menu
        const action = await vscode.window.showQuickPick(['Generate _index.dart', 'Remove _index.dart'], {
            placeHolder: 'Select an action for Moinsen Flutter'
        });

        if (!action) {
            // User canceled the Quick Pick
            return;
        }

        try {
            if (action === 'Generate _index.dart') {
                const summary = { generated: 0, updated: 0 };
                await generateIndexFiles(directory, summary);
                vscode.window.showInformationMessage(
                    `Moinsen Flutter: ${summary.generated} _index.dart generated, ${summary.updated} _index.dart updated.`
                );
            } else if (action === 'Remove _index.dart') {
                const summary = { removed: 0, updated: 0 };
                await removeIndexFiles(directory, summary);
                vscode.window.showInformationMessage(
                    `Moinsen Flutter: ${summary.removed} _index.dart removed, ${summary.updated} parent _index.dart updated.`
                );
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    context.subscriptions.push(manageDisposable);
}

/**
 * Deactivates the extension.
 */
export function deactivate() {}