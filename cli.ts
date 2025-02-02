import { CreateProject } from "./commands/create.ts";
import { DevProject } from "./commands/dev.ts";
import { BuildProject } from "./commands/build.ts";

const command: { [key: string]: boolean } = { "create": true, "dev": true, "build": true, "start": true };
const { args: Args } = Deno;
const [cmd, appName, flag] = [Args[0], Args[1], Args[2]];

async function Main(appName: string, flag: string) {
  try {
    if (command[cmd]) {
      switch (cmd) {
        case "create":
          appName ? 
            await CreateProject(appName, Deno.cwd(), flag) : 
            Main(`${prompt('Please enter App name: ', 'myApp')}`, flag);
          break;
        case "dev":
          await BuildProject(appName);
          DevProject(appName);
          break;
        case "build":
          await BuildProject(appName);
          //convert es6 module for js to consumed locally 
          const p=Deno.run({cmd:["deno","bundle","build/index.js","public/bundle.js"]});
          const {success} = await p.status();
          if (success) {
            console.log('./public/index.bundle.html is now deployable without build/*.js ')
          }
          break;
      }
    } 
    else if (cmd === "--version" || cmd === "-v") {
      console.log(`NOVAS 1.0`);
    }
    else {
      console.log(`To create a project, type:` + ` %cNOVAS create ` + `%c[project name]`, "color:#55dac8;", "color:red;");
      console.log(`To compile a project, type:` + ` %cNOVAS build`, "color:#55dac8;");
      console.log(`To start a dev server, type:` + ` %cNOVAS dev`, "color:#55dac8;");
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      console.log(error);
    }
  }
}

if (import.meta.main) {
  await Main(appName, flag);
}
