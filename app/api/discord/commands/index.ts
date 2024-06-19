import type { Command } from "../command";
import HelpChannels from "./helpChannels";
import Helpful from "./helpful";

const commands: { new (): Command<any> }[] = [HelpChannels, Helpful];

export default commands;
