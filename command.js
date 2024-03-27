import { Command } from "commander";
import { cue, edit, list, pop, push, show } from "./todo.js";

export const program = new Command();

const join = (a, b) => {
  return b ? `${b} ${a}` : a;
};

program.name("todo").description("Stack based todo app in your shell");

program
  .command("show", { isDefault: true })
  .description("Print current task (same as running todo without any argument)")
  .action(show);

program
  .command("list")
  .alias("ls")
  .description("Print the full list of tasks")
  .action(list);

program
  .command("push")
  .aliases(["new", "create"])
  .description("Add a task to the top of the stack")
  .argument("<name...>", "name of the task to add", join)
  .option("-n, --next", `don't replace current task, put this on place two`)
  .action(push);

program
  .command("cue")
  .description("Add a task to the bottom of the stack")
  .argument("<name...>", "name of the task to add", join)
  .action(cue);

program
  .command("pop")
  .alias("done")
  .description("The current task is done, remove it and get the next in line")
  .action(pop);

program
  .command("edit")
  .aliases(["open", "editor"])
  .description("Open the task list in a text editor")
  .action(edit);
