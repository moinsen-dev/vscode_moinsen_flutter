# Moinsen Flutter

![Version](https://img.shields.io/visual-studio-marketplace/v/your-publisher.moinsen-flutter)
![Installs](https://img.shields.io/visual-studio-marketplace/i/your-publisher.moinsen-flutter)
![Rating](https://img.shields.io/visual-studio-marketplace/r/your-publisher.moinsen-flutter)
![License](https://img.shields.io/github/license/your-username/moinsen-flutter)
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

Please report any issues on the [GitHub repository](https://github.com/your-username/moinsen-flutter/issues).

## Release Notes

### 0.1.0

Initial release of Moinsen Flutter:
- Implemented basic functionality for creating and updating `_index.dart` files
- Added customizable ignore lists for folders and files

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Enjoy using Moinsen Flutter!**
