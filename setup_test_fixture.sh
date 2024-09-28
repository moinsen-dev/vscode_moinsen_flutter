#!/bin/bash

# Create the main test fixture directory
mkdir -p src/test/fixture/generateIndexFiles

# Create a mock Flutter project structure
cd src/test/fixture/generateIndexFiles

# Create directories
mkdir -p lib/screens lib/widgets lib/models lib/utils
mkdir -p test android ios build .dart_tool

# Create mock Dart files
echo "// Main file" > lib/main.dart
echo "// Home screen" > lib/screens/home_screen.dart
echo "// Profile screen" > lib/screens/profile_screen.dart
echo "// Custom button widget" > lib/widgets/custom_button.dart
echo "// User model" > lib/models/user.dart
echo "// API service" > lib/utils/api_service.dart

# Create a file with multiple dots
echo "// File with multiple dots" > lib/utils/config.prod.dev.dart

# Create a pubspec.yaml file
cat << EOF > pubspec.yaml
name: test_project
description: A test Flutter project.
version: 1.0.0+1
environment:
  sdk: ">=2.12.0 <3.0.0"
dependencies:
  flutter:
    sdk: flutter
EOF

# Create some files in ignored directories
echo "// Android config" > android/build.gradle
echo "// iOS config" > ios/Runner.xcodeproj
echo "// Build artifact" > build/app.dex
echo "// Dart tool config" > .dart_tool/package_config.json

# Create a nested structure to test recursion
mkdir -p lib/features/auth lib/features/settings
echo "// Login screen" > lib/features/auth/login_screen.dart
echo "// Register screen" > lib/features/auth/register_screen.dart
echo "// Settings screen" > lib/features/settings/settings_screen.dart

# Create a directory with a dot
mkdir .hidden_dir
echo "// Hidden file" > .hidden_dir/hidden_file.dart

# Create a file to be ignored
echo "// Ignored file" > lib/ignored_file.dart

echo "Test fixture setup complete."