# Moinsen Flutter

![Version](https://img.shields.io/visual-studio-marketplace/v/MoinsenDevelopment.moinsen-flutter)
![Installs](https://img.shields.io/visual-studio-marketplace/i/MoinsenDevelopment.moinsen-flutter)
![Rating](https://img.shields.io/visual-studio-marketplace/r/MoinsenDevelopment.moinsen-flutter)
![License](https://img.shields.io/github/license/moinsen-dev/vscode_moinsen_flutter)
![Coverage](https://img.shields.io/badge/coverage-53.84%25-yellow)

Moinsen Flutter is a VSCode extension that simplifies the management of import statements in your Flutter projects by automating the creation and maintenance of `_index.dart` files.

## Features

- **Automated _index.dart Generation**: Automatically creates and updates `_index.dart` files to maintain clean and efficient import structures.
- **Customizable Ignore Lists**: Exclude specific folders (e.g., build, ios, .dart_tool) and filenames (e.g., main.dart) from import generation to suit your project's needs.
- **Simplified File Management**: Easily move or rename files without worrying about broken import statements, as the extension handles exports seamlessly.
- **User-Friendly Interface**: Access all functionalities through an organized context menu in VSCode, enhancing your development workflow.

## Requirements

- Visual Studio Code v1.93.0 or higher
- Flutter SDK

## Extension Settings

This extension contributes the following settings:

* `moinsenFlutter.ignoreFolders`: An array of folder names to ignore when generating index files.
* `moinsenFlutter.ignoreFiles`: An array of file names to ignore when generating index files.

## Logic Behind generateIndexFiles

The `generateIndexFiles` function is the core of this extension, responsible for creating and updating `_index.dart` files. Here's an overview of its logic and the rules applied:

1. **Bottom-up Approach**: The function processes directories recursively, starting from the deepest subdirectories and moving up to the parent directories. This ensures that all necessary exports are included in parent `_index.dart` files.

2. **Ignore Rules**:
   - Certain folders are ignored (e.g., 'test', 'bin', 'build', 'ios', 'android', etc.) to avoid generating unnecessary index files.
   - Files starting with a dot (.) are ignored.
   - Specific filenames (e.g., 'main.dart') are excluded from the export statements.
   - Files with multiple dots before the .dart extension are skipped.

3. **pubspec.yaml Check**: If a `pubspec.yaml` file is found in a directory, the function doesn't generate an `_index.dart` file for that directory but still processes its subdirectories.

4. **Export Generation**:
   - The function creates export statements for all Dart files in the current directory, except for those matching the ignore rules.
   - It also includes export statements for `_index.dart` files in subdirectories.

5. **File Naming**: The generated file is always named `_index.dart`.

6. **Timestamp**: Each generated `_index.dart` file includes a comment block with a timestamp indicating when it was created or last updated.

7. **Update Mechanism**: If an `_index.dart` file already exists, it's updated with the new content rather than creating a new file.

## High-Level Implementation Description

The Moinsen Flutter extension is implemented with the following key components:

1. **Extension Activation**: The `activate` function sets up the extension and registers the main command (`moinsenFlutter.manageIndex`).

2. **Command Execution**: When triggered, the extension presents a Quick Pick menu allowing users to choose between generating or removing `_index.dart` files.

3. **Core Functions**:
   - `generateIndexFiles`: Recursively creates or updates `_index.dart` files in the selected directory and its subdirectories.
   - `removeIndexFiles`: Recursively removes `_index.dart` files and updates parent index files accordingly.

4. **Helper Functions**:
   - `isIgnoredFolder` and `shouldSkip`: Implement the ignore rules for folders and files.
   - `hasPubspecYaml`: Checks for the presence of a `pubspec.yaml` file.
   - `getAllowedSubfolders`: Retrieves subdirectories that are not ignored.

5. **File System Operations**: The extension uses Node.js `fs` module for file reading, writing, and directory traversal.

6. **VSCode Integration**: It utilizes VSCode's extension API for user interface interactions, command registration, and workspace operations.

7. **Error Handling**: The extension includes try-catch blocks to handle potential errors and display appropriate messages to the user.

8. **Summary Reporting**: After execution, it provides a summary of the operations performed (e.g., number of files generated, updated, or removed).

This implementation ensures efficient management of import statements in Flutter projects while providing users with flexibility and control over the process.

## Running Tests with Coverage

To run the tests with coverage for this extension, follow these steps:

1. Ensure you have all dependencies installed by running:
   ```
   npm install
   ```

2. Run the tests with coverage using the following command:
   ```
   npm run test:coverage
   ```

3. After the tests complete, you can find the coverage report in the `coverage` directory. Open `coverage/lcov-report/index.html` in a web browser to view a detailed coverage report.

4. The coverage percentage is also displayed in the console output and updated in the README badge automatically.

## Enhancing the Test Fixture Structure

To improve the test fixture structure for this extension, consider the following guidelines:

1. **Organize Fixtures by Feature**: Create subdirectories within the `src/test/fixture` directory for each major feature or component being tested. This helps in maintaining a clear separation of test cases.

2. **Use Descriptive Names**: Name your fixture files and directories clearly to indicate their purpose. For example, `validProjectStructure`, `invalidImports`, or `nestedDirectories`.

3. **Mock Complex Structures**: For testing complex project structures, create mock directory trees that simulate real-world Flutter projects. Include various levels of nesting, ignored folders, and edge cases.

4. **Include Edge Cases**: Prepare fixtures that cover edge cases such as empty directories, files with special characters, or deeply nested structures to ensure robust testing.

5. **Separate Input and Expected Output**: For each test scenario, consider having an "input" directory structure and a corresponding "expected" directory structure. This makes it easier to compare the generated results with the expected outcomes.

6. **Version Control**: Include your test fixtures in version control to ensure consistency across different development environments and to track changes over time.

7. **README for Fixtures**: Consider adding a README.md file in the `src/test/fixture` directory explaining the purpose and structure of your test fixtures. This helps other contributors understand and maintain the test suite.

8. **Realistic Content**: Where applicable, include realistic content in your fixture files. For Dart files, this might mean including basic class or function definitions that reflect typical usage.

9. **Consistency**: Maintain a consistent structure across your fixtures to make it easier for developers to understand and extend the test suite.

By following these guidelines, you can create a more robust and maintainable test fixture structure, which in turn leads to more reliable and comprehensive testing of the Moinsen Flutter extension.

## Deployment

This extension uses GitHub Actions for automated deployment to the VSCode Marketplace. When changes are pushed to the main branch, the following steps are automatically executed:

1. Code checkout
2. Node.js setup
3. Dependency installation
4. Running tests with coverage
5. Creating a release tag
6. Publishing to the VSCode Marketplace

To deploy a new version:

1. Update the version number in `package.json`.
2. Commit your changes and push to the main branch.
3. The GitHub Actions workflow will automatically run tests, create a new release, and publish the extension to the VSCode Marketplace.

This ensures that every release is thoroughly tested and automatically made available to users.

## Known Issues

Please report any issues on the [GitHub repository](https://github.com/moinsen-dev/vscode_moinsen_flutter/issues).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Enjoy using Moinsen Flutter!**
