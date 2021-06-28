import { Message } from "node-telegram-bot-api"

let commands = ["siis", "issi", "bonk", "img", "checkUrl", "ascii"]
let prefix = "$"

export default class CommandTool {
    static getCommand (msg: Message): string | undefined {       
        for (let command of commands) {
            if ((msg.text != undefined) && (msg.text.slice(0, command.length + 1) == (prefix + command))) {
                return msg.text.slice(0, command.length + 1).substring(1)
            }
    
            if ((msg.caption != undefined) && (msg.caption.slice(0, command.length + 1) == (prefix + command))) {
                return msg.caption.slice(0, command.length + 1).substring(1)
            }
        }
        return undefined
    }

    static isCommand(msg: Message): boolean {
        return (msg.text?.charAt(0) == "$") || (msg.caption?.charAt(0) == "$")
    }

    static getMainMessage (msg: Message): string | undefined {
        return (msg.text?.substring(this.getCommand(msg)!.length + 1).trim())
    }
}