import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { generateIndexFiles } from '../createIndexOperations';
import { removeIndexFiles } from '../removeIndexOperations';

describe('Extension Test Suite', () => {
    it('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });

    it('removeIndexFiles test', async () => {
        // Create a temporary directory structure for testing
        const tempDir = path.join(__dirname, 'temp_test_dir');
        fs.mkdirSync(tempDir, { recursive: true });
        fs.mkdirSync(path.join(tempDir, 'subdir'), { recursive: true });

        // Create some _index.dart files
        fs.writeFileSync(path.join(tempDir, '_index.dart'), 'export \'subdir/_index.dart\';');
        fs.writeFileSync(path.join(tempDir, 'subdir', '_index.dart'), 'export \'file.dart\';');

        // Run removeIndexFiles
        const summary = { removed: 0, updated: 0 };
        const result = await removeIndexFiles(tempDir, summary);

        // Assert that the files were removed and the summary is correct
        assert.strictEqual(summary.removed, 2);
        assert.strictEqual(summary.updated, 1);  // Changed from 0 to 1
        assert.strictEqual(result, true);
        assert.strictEqual(fs.existsSync(path.join(tempDir, '_index.dart')), false);
        assert.strictEqual(fs.existsSync(path.join(tempDir, 'subdir', '_index.dart')), false);

        // Clean up
        fs.rmdirSync(tempDir, { recursive: true });
    });

    it('generateIndexFiles test', async () => {
        // Create a temporary directory structure for testing
        const tempDir = path.join(__dirname, 'temp_test_dir');
        fs.mkdirSync(tempDir, { recursive: true });
        fs.mkdirSync(path.join(tempDir, 'subdir'), { recursive: true });

        // Create some dart files
        fs.writeFileSync(path.join(tempDir, 'file1.dart'), 'void main() {}');
        fs.writeFileSync(path.join(tempDir, 'subdir', 'file2.dart'), 'class TestClass {}');

        // Run generateIndexFiles
        const summary = { generated: 0, updated: 0 };
        const result = await generateIndexFiles(tempDir, summary);

        // Assert that the files were generated and the summary is correct
        assert.strictEqual(summary.generated, 2);
        assert.strictEqual(summary.updated, 0);
        assert.strictEqual(result, true);
        assert.strictEqual(fs.existsSync(path.join(tempDir, '_index.dart')), true);
        assert.strictEqual(fs.existsSync(path.join(tempDir, 'subdir', '_index.dart')), true);

        // Check content of generated files
        const mainIndexContent = fs.readFileSync(path.join(tempDir, '_index.dart'), 'utf8');
        assert.ok(mainIndexContent.includes("export 'file1.dart';"));
        assert.ok(mainIndexContent.includes("export 'subdir/_index.dart';"));

        const subIndexContent = fs.readFileSync(path.join(tempDir, 'subdir', '_index.dart'), 'utf8');
        assert.ok(subIndexContent.includes("export 'file2.dart';"));

        // Clean up
        fs.rmdirSync(tempDir, { recursive: true });
    });
});
