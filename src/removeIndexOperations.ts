import * as fs from 'fs';
import * as path from 'path';
import { getAllowedSubfolders } from './utils';

/**
 * Recursively removes _index.dart files from the given directory.
 * Also updates parent _index.dart files to exclude the removed exports.
 * @param dir The directory path.
 * @param summary Object to keep track of removed and updated files.
 */
export async function removeIndexFiles(dir: string, summary: { removed: number; updated: number; }): Promise<boolean> {
    const subDirs = getAllowedSubfolders(dir);
    let hasRemovedIndexFiles = false;

    // Process subdirectories first
    for (const subDir of subDirs) {
        const hasSubDirRemovals = await removeIndexFiles(subDir, summary);
        if (hasSubDirRemovals) {
            hasRemovedIndexFiles = true;
        }
    }

    // Remove _index.dart if it exists
    const indexPath = path.join(dir, '_index.dart');
    if (fs.existsSync(indexPath)) {
        fs.unlinkSync(indexPath);
        summary.removed += 1;
        hasRemovedIndexFiles = true;
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
                hasRemovedIndexFiles = true;
            }
        }
    }

    return hasRemovedIndexFiles;
}