import { join } from "https://deno.land/std@0.113.0/path/mod.ts";
import flags from "./flags.ts";
import {
  indexHTML,
  mainJs,
  svelteAppComponent,
  svelteComponent,
  vscodeDenoSettings,
  defaultConfigFile,
} from "../templates/templates.ts";

export async function CreateProject(name: string, path: string, flag: string): Promise<boolean> {
  if (flags['help'][flag] || flags['help'][name]) {
    console.log(`To create a project, type:` + ` %cNOVAS create ` + `%c[project name]`, "color:#55dac8;", "color:red;")
    return false;
  }
  const appDir = `${path}/${name}`;
  
  try {
    const startTime = Date.now();

    const encoder = new TextEncoder();

    await Deno.mkdir(join(path, name));
    await Deno.mkdir(join(appDir, "public"));
    await Deno.mkdir(join(appDir, "src"));
    await Deno.mkdir(join(appDir, ".vscode"));
    
    const indexHtmlFile = await Deno.create(join(`${path}/${name}/public`, "index.html"));
    const indexBundleHtmlFile = await Deno.create(join(`${path}/${name}/public`, "index.bundle.html"));
    const settings = await Deno.create(join(`${path}/${name}/.vscode`, "settings.json"));
    const defaultConfig = await Deno.create(join(appDir, "compileOptions.json"));
    const srcFile = await Deno.create(join(`${appDir}/src`, "App.svelte"));
    const componentFile = await Deno.create(join(`${appDir}/src`, "component.svelte"));
    const mainJsFile = await Deno.create(join(`${appDir}/src`, "index.js"));
    
    indexHtmlFile.write(encoder.encode(indexHTML));
    indexBundleHtmlFile.write(encoder.encode(
        indexHTML.replace('<script type="module" src="../build/index.js">'
                          ,'<script src="bundle.js">')));
    settings.write(encoder.encode(vscodeDenoSettings));
    defaultConfig.write(encoder.encode(defaultConfigFile));
    srcFile.write(encoder.encode(svelteAppComponent));
    componentFile.write(encoder.encode(svelteComponent));
    mainJsFile.write(encoder.encode(mainJs));

    
    const endTime = Date.now();
    console.log(`Project created successfully in ${(endTime - startTime) / 1000}s.! ✨`);

    return true;
  } catch (error: unknown) {
    console.log(error);
    return false;
  }
}
