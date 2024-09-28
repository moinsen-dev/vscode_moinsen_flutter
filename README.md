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

## Known Issues

Please report any issues on the [GitHub repository](https://github.com/moinsen-dev/vscode_moinsen_flutter/issues).

## Automated Deployment (not yet implemented)

This extension uses GitHub Actions for automated deployment to the VSCode Marketplace. When changes are pushed to the main branch, the following steps are automatically executed:

1. Code checkout
2. Node.js setup
3. Dependency installation
4. Running tests
5. Creating a release tag
6. Publishing to the VSCode Marketplace

This ensures that every release is thoroughly tested and automatically made available to users.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Enjoy using Moinsen Flutter!**
