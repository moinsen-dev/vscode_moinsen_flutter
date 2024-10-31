import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { generateIndexFiles } from './createIndexOperations';
import { findUnusedPackages, removePackagesFromPubspec } from './pubspecOperations';
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
        const filePath = stats.isDirectory() ? targetPath : targetPath;
        const fileName = path.basename(filePath);

        // Different menu for pubspec.yaml
        if (fileName === 'pubspec.yaml') {
            const action = await vscode.window.showQuickPick(['Remove unused packages'], {
                placeHolder: 'Select an action for pubspec.yaml'
            });

            if (action === 'Remove unused packages') {
                try {
                    const unusedPackages = await findUnusedPackages(filePath);
                    if (unusedPackages.length === 0) {
                        vscode.window.showInformationMessage('No unused packages found.');
                        return;
                    }

                    const selectedPackages = await vscode.window.showQuickPick(unusedPackages, {
                        canPickMany: true,
                        placeHolder: 'Select packages to remove'
                    });

                    if (selectedPackages && selectedPackages.length > 0) {
                        // Remove selected packages from pubspec.yaml
                        await removePackagesFromPubspec(filePath, selectedPackages);
                        vscode.window.showInformationMessage(
                            `Removed ${selectedPackages.length} unused packages.`
                        );
                    }
                } catch (error) {
                    vscode.window.showErrorMessage(`Error: ${error}`);
                }
                return;
            }
            return;
        }

        // Original menu for other files
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
                await generateIndexFiles(targetPath, summary);
                vscode.window.showInformationMessage(
                    `Moinsen Flutter: ${summary.generated} _index.dart generated, ${summary.updated} _index.dart updated.`
                );
            } else if (action === 'Remove _index.dart') {
                const summary = { removed: 0, updated: 0 };
                await removeIndexFiles(targetPath, summary);
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