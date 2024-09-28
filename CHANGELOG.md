# Change Log

All notable changes to the "Moinsen Flutter" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2023-06-05
### Changed
- Code refactoring and cleanup, test coverage increased to nearly 100%
- Modified _index.dart generation to exclude Dart files with the same name as their parent folder

## [0.2.4] - 2023-06-04
 - Fixed, the first steps with every new extension are always the hardest

## [0.2.3] - 2023-06-04
 - Fixed no _index.dart for app or package root

## [0.2.2] - 2023-06-04
 - Fixed missing logo

## [0.2.1] - 2023-06-04
- Fixed issue with wrong comments generated in `_index.dart` files, shame on me

## [0.2.0] - 2023-06-04
- Updated README with new features and usage instructions

## [0.1.2] - 2023-06-04

### Added
- Automated deployment workflow to VSCode Marketplace
- Release tagging mechanism

### Changed
- Updated CHANGELOG.md structure and content

## [0.1.1] - 2023-06-01

### Added
- Minor improvements and bug fixes

## [0.1.0] - 2023-05-28

### Added
- Initial release of Moinsen Flutter extension
- Implemented basic functionality for creating and updating `_index.dart` files
- Added customizable ignore lists for folders and files
- Implemented test cases for core functionality
- Set up code coverage reporting
- Added badges to README for version, installs, rating, license, and code coverage
- Created comprehensive README with feature list and usage instructions
- Implemented MIT License

### Changed
- Updated package.json with new scripts for testing and coverage
- Refactored extension.ts to improve maintainability and testability

### Fixed
- Resolved issues with file path handling in different operating systems

## [Unreleased]
- Planned improvements based on user feedback
- Performance optimizations for large projects
- Additional customization options for `_index.dart` file generation