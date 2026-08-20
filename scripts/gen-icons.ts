import { writeFileSync } from "node:fs";
import { iconCatalog } from "../src/icons";

const catalog = iconCatalog();
writeFileSync("public/icons.json", JSON.stringify(catalog));
console.error(`icons.json: ${catalog.length} icons`);
