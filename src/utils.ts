import * as fs from 'fs';
import * as path from 'path';

/**
 * List of folders to ignore during _index.dart generation and removal.
 */
export const listOfIgnoreIndexGenFolder = ['test', 'bin', 'build', 'ios', 'android', 'linux', 'macos', 'web', 'windows'];

/**
 * List of filenames to ignore during _index.dart generation.
 * These files will not be included in the export statements.
 */
export const listOfIgnoreIndexFilenames = ['main.dart'];

/**
 * Determines whether a folder should be ignored based on its name.
 * Skips folders listed in listOfIgnoreIndexGenFolder or those starting with a dot.
 * @param folderName The name of the folder to check.
 * @returns True if the folder should be ignored, false otherwise.
 */
export function isIgnoredFolder(folderName: string): boolean {
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
export function shouldSkip(file: string): boolean {
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
export function hasPubspecYaml(dir: string): boolean {
    return fs.existsSync(path.join(dir, 'pubspec.yaml'));
}

/**
 * Gets all allowed subfolders in a directory.
 * @param dir The directory path.
 * @returns An array of allowed subfolder paths.
 */
export function getAllowedSubfolders(dir: string): string[] {
    return fs.readdirSync(dir)
        .map(file => path.join(dir, file))
        .filter(fullPath => fs.statSync(fullPath).isDirectory() && !isIgnoredFolder(path.basename(fullPath)));
}