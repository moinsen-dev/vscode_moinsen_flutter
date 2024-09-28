import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * List of folders to ignore during _index.dart generation and removal.
 */
const listOfIgnoreIndexGenFolder = ['test', 'bin', 'build', 'ios', 'android', 'linux', 'macos', 'web', 'windows'];

/**
 * List of filenames to ignore during _index.dart generation.
 * These files will not be included in the export statements.
 */
const listOfIgnoreIndexFilenames = ['main.dart'];

/**
 * Determines whether a folder should be ignored based on its name.
 * Skips folders listed in listOfIgnoreIndexGenFolder or those starting with a dot.
 * @param folderName The name of the folder to check.
 * @returns True if the folder should be ignored, false otherwise.
 */
function isIgnoredFolder(folderName: string): boolean {
    return (
        listOfIgnoreIndexGenFolder.includes(folderName) ||
        folderName.startsWith('.')
    );
}

/**
 * Determines whether a Dart file should be skipped based on its filename.
 * Skips files listed in listOfIgnoreIndexFilenames or files with multiple dots before the .dart extension.
 * @param file The filename to check.
 * @returns True if the file should be skipped, false otherwise.
 */
function shouldSkip(file: string): boolean {
    const baseName = path.basename(file, '.dart');
    return (
        listOfIgnoreIndexFilenames.includes(file) ||
        baseName.includes('.')
    );
}

/**
 * Checks if the given directory contains a pubspec.yaml file.
 * @param dir The directory path to check.
 * @returns True if pubspec.yaml is present, false otherwise.
 */
function hasPubspecYaml(dir: string): boolean {
    return fs.existsSync(path.join(dir, 'pubspec.yaml'));
}

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

/**
 * Recursively generates or updates _index.dart files for the given directory.
 * If a subdirectory has an _index.dart, it includes it in the parent _index.dart.
 * Skips generating _index.dart in directories containing pubspec.yaml, but still processes subfolders.
 * @param dir The directory path.
 * @param summary Object to keep track of generated and updated files.
 * @returns A boolean indicating whether any Dart files were found or processed in this directory or its subdirectories.
 */
async function generateIndexFiles(dir: string, summary: { generated: number; updated: number; }): Promise<boolean> {
    const files = fs.readdirSync(dir);
    const dartFiles: string[] = [];
    const subDirs: string[] = [];
    const subIndexExports: string[] = [];

    // Separate Dart files and subdirectories, skipping ignored folders
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        if (stats.isFile() && path.extname(file) === '.dart') {
            if (!shouldSkip(file)) {
                dartFiles.push(file);
            }
        } else if (stats.isDirectory()) {
            const folderName = path.basename(fullPath);
            if (!isIgnoredFolder(folderName)) {
                subDirs.push(fullPath);
            }
        }
    });

    let hasProcessedDartFiles = false;

    // Process subdirectories
    for (const subDir of subDirs) {
        const hasSubDirContent = await generateIndexFiles(subDir, summary);
        if (hasSubDirContent) {
            hasProcessedDartFiles = true;
            const subDirName = path.basename(subDir);
            // Add export statement for subdirectory's _index.dart
            subIndexExports.push(`export '${subDirName}/_index.dart';`);
        }
    }

    // Check if pubspec.yaml is present
    if (hasPubspecYaml(dir)) {
        // If pubspec.yaml is present, don't generate _index.dart for this folder
        // but return true if there are subIndexExports (to include in parent _index.dart)
        return subIndexExports.length > 0;
    }

    // Check if there are any .dart files excluding _index.dart
    const dartFilesExcludingIndex = dartFiles.filter(file => file !== '_index.dart');
    let indexPath = path.join(dir, '_index.dart');
    let exportLines = dartFilesExcludingIndex.map(file => `export '${file}';`).join('\n');

    // Include exports for subdirectories' _index.dart
    if (subIndexExports.length > 0) {
        exportLines += (exportLines ? '\n' : '') + subIndexExports.join('\n');
    }

    // If there are exports to write, generate or update the _index.dart file
    if (dartFilesExcludingIndex.length > 0 || subIndexExports.length > 0) {
        hasProcessedDartFiles = true;
        // Prepare the comment block with timestamp
        const timestamp = new Date().toLocaleString();
        const commentBlock = `/*
** Generated by Moinsen Flutter (www.moinsen.dev) at ${timestamp}
*/\n`;

        // Combine comment block and export lines, ensuring a newline at the end
        const content = commentBlock + exportLines + '\n';

        if (fs.existsSync(indexPath)) {
            fs.writeFileSync(indexPath, content, { encoding: 'utf8' });
            summary.updated += 1;
        } else {
            fs.writeFileSync(indexPath, content, { encoding: 'utf8' });
            summary.generated += 1;
        }
    }

    return hasProcessedDartFiles;
}

/**
 * Recursively removes _index.dart files from the given directory.
 * Also updates parent _index.dart files to exclude the removed exports.
 * @param dir The directory path.
 * @param summary Object to keep track of removed and updated files.
 */
async function removeIndexFiles(dir: string, summary: { removed: number; updated: number; }): Promise<void> {
    const files = fs.readdirSync(dir);
    const subDirs: string[] = [];

    // Separate subdirectories, skipping ignored folders
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            const folderName = path.basename(fullPath);
            if (!isIgnoredFolder(folderName)) {
                subDirs.push(fullPath);
            }
        }
    });

    // Process subdirectories first
    for (const subDir of subDirs) {
        await removeIndexFiles(subDir, summary);
    }

    // Remove _index.dart if it exists
    const indexPath = path.join(dir, '_index.dart');
    if (fs.existsSync(indexPath)) {
        fs.unlinkSync(indexPath);
        summary.removed += 1;
    }

    // After removal, update the parent _index.dart to exclude this _index.dart
    // This requires locating the parent directory's _index.dart and removing the export statement
    const parentDir = path.dirname(dir);
    if (parentDir !== dir) { // Prevent infinite loop at root
        const parentIndexPath = path.join(parentDir, '_index.dart');
        if (fs.existsSync(parentIndexPath)) {
            let parentContent = fs.readFileSync(parentIndexPath, 'utf8');
            const subDirName = path.basename(dir);
            const exportStatement = `export '${subDirName}/_index.dart';`;

            if (parentContent.includes(exportStatement)) {
                parentContent = parentContent.split('\n').filter(line => line.trim() !== exportStatement).join('\n');
                fs.writeFileSync(parentIndexPath, parentContent, { encoding: 'utf8' });
                summary.updated += 1;
            }
        }
    }
}