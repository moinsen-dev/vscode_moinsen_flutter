import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

interface PubspecDependency {
    path?: string;
    git?: {
        url: string;
        ref: string;
    };
}

/**
 * Finds unused packages in the project by scanning all Dart files
 * and comparing with dependencies in pubspec.yaml
 */
export async function findUnusedPackages(pubspecPath: string): Promise<string[]> {
    const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
    const pubspec = yaml.parse(pubspecContent);
    const projectRoot = path.dirname(pubspecPath);
    const libDir = path.join(projectRoot, 'lib');

    // Get all dependencies
    const dependencies = new Set<string>();
    Object.entries(pubspec.dependencies || {}).forEach(([name, value]) => {
        if (name !== 'flutter' && name !== 'flutter_test') {
            dependencies.add(name);
        }
    });

    // Scan all Dart files for imports
    const usedPackages = new Set<string>();
    await scanDartFiles(libDir, usedPackages);

    // Find unused packages
    const unusedPackages = Array.from(dependencies).filter(dep => !usedPackages.has(dep));
    return unusedPackages;
}

/**
 * Removes selected packages from pubspec.yaml
 */
export async function removePackagesFromPubspec(pubspecPath: string, packagesToRemove: string[]): Promise<void> {
    const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
    const pubspec = yaml.parse(pubspecContent);

    // Remove selected packages
    packagesToRemove.forEach(packageName => {
        delete pubspec.dependencies[packageName];
    });

    // Write back to pubspec.yaml
    const updatedContent = yaml.stringify(pubspec);
    fs.writeFileSync(pubspecPath, updatedContent, 'utf8');
}

/**
 * Recursively scans Dart files for package imports
 */
async function scanDartFiles(dir: string, usedPackages: Set<string>): Promise<void> {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await scanDartFiles(fullPath, usedPackages);
        } else if (file.endsWith('.dart')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const importRegex = /import\s+['"]package:([^\/]+)\/[^'"]*/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                usedPackages.add(match[1]);
            }
        }
    }
}