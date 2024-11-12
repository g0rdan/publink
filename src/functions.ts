import YAML from "yaml";
import fs from "fs";

export function extractPackageNames(pathToYaml: string): string[] {
  try {
    const file = fs.readFileSync(pathToYaml, "utf8");
    const parsed = YAML.parse(file);
    const dependencies = parsed["dependencies"];
    const devDependencies = parsed["dev_dependencies"];
    const dependencyNames: string[] = Object.keys(dependencies);
    const devDependencyNames: string[] = Object.keys(devDependencies);
    return [...dependencyNames, ...devDependencyNames];
  } catch (e) {
    console.error("Error loading YAML file:", e);
    return [];
  }
}
