const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { generateIndexFiles } = require("../extension"); // Adjust the path as needed

describe("generateIndexFiles", () => {
  const fixtureDir = path.join(__dirname, "fixture", "dartExample");

  beforeEach(() => {
    // Clean up any existing _index.dart files before each test
    removeIndexFiles(fixtureDir);
  });

  it("should generate _index.dart files in appropriate directories", async () => {
    await generateIndexFiles(fixtureDir);

    // Check if _index.dart files are created in the correct locations
    assert(
      fs.existsSync(path.join(fixtureDir, "lib", "_index.dart")),
      "lib/_index.dart should exist"
    );
    assert(
      fs.existsSync(path.join(fixtureDir, "lib", "models", "_index.dart")),
      "lib/models/_index.dart should exist"
    );
    assert(
      fs.existsSync(path.join(fixtureDir, "lib", "services", "_index.dart")),
      "lib/services/_index.dart should exist"
    );
    assert(
      fs.existsSync(path.join(fixtureDir, "lib", "utils", "_index.dart")),
      "lib/utils/_index.dart should exist"
    );
  });

  it("should not generate _index.dart file in the root directory with pubspec.yaml", async () => {
    await generateIndexFiles(fixtureDir);

    assert(
      !fs.existsSync(path.join(fixtureDir, "_index.dart")),
      "_index.dart should not exist in the root directory"
    );
  });

  it("should generate correct export statements in _index.dart files", async () => {
    await generateIndexFiles(fixtureDir);

    const libIndexContent = fs.readFileSync(
      path.join(fixtureDir, "lib", "_index.dart"),
      "utf8"
    );
    assert(
      libIndexContent.includes("export 'models/_index.dart';"),
      "lib/_index.dart should export models/_index.dart"
    );
    assert(
      libIndexContent.includes("export 'services/_index.dart';"),
      "lib/_index.dart should export services/_index.dart"
    );
    assert(
      libIndexContent.includes("export 'utils/_index.dart';"),
      "lib/_index.dart should export utils/_index.dart"
    );
    assert(
      !libIndexContent.includes("export 'main.dart';"),
      "lib/_index.dart should not export main.dart"
    );

    const modelsIndexContent = fs.readFileSync(
      path.join(fixtureDir, "lib", "models", "_index.dart"),
      "utf8"
    );
    assert(
      modelsIndexContent.includes("export 'user.dart';"),
      "models/_index.dart should export user.dart"
    );
  });
});

function removeIndexFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      removeIndexFiles(filePath);
    } else if (file === "_index.dart") {
      fs.unlinkSync(filePath);
    }
  }
}
