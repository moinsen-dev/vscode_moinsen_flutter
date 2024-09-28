# Moinsen Flutter

![Version](https://img.shields.io/visual-studio-marketplace/v/MoinsenDevelopment.moinsen-flutter)
![Installs](https://img.shields.io/visual-studio-marketplace/i/MoinsenDevelopment.moinsen-flutter)
![Rating](https://img.shields.io/visual-studio-marketplace/r/MoinsenDevelopment.moinsen-flutter)
![License](https://img.shields.io/github/license/moinsen-dev/vscode_moinsen_flutter)
![Coverage](https://img.shields.io/badge/coverage-placeholder-brightgreen)

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

## Known Issues

Please report any issues on the [GitHub repository](https://github.com/moinsen-dev/vscode_moinsen_flutter/issues).

## Release Notes

### 0.1.2

- Automated deployment workflow to VSCode Marketplace
- Release tagging mechanism
- Updated CHANGELOG.md structure and content

### 0.1.1

- Minor improvements and bug fixes

### 0.1.0

Initial release of Moinsen Flutter:
- Implemented basic functionality for creating and updating `_index.dart` files
- Added customizable ignore lists for folders and files
- Implemented test cases for core functionality
- Set up code coverage reporting
- Created comprehensive README with feature list and usage instructions

## Automated Deployment

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
