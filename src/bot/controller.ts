import TelegramBot, { InlineQueryResult, Message } from 'node-telegram-bot-api'
import {isAllowed, register} from './Permission'
import { contienePalabrasProhibidas } from './blocked'
import { sendMessageToChannel } from './channel'
import ConstantTool from "../services/tools/ConstantTool"
import ImageServices from '../services/ImageServices'
import FileServices from "../services/FileServices"
import ImageSearchHandler from './ImageSearchHandler'
import CommandTool from "../services/tools/CommandTool"


const axios = require('axios')
const text2png = require('text2png');

function init(): void {
    const bot = new TelegramBot(ConstantTool.TELEGRAM_BOT_TOKEN, {polling: true});      
    const bannedList: { [key: string]: number } = {};

    bot.on("polling_error", console.log);
    
    bot.on("message", (msg) => {
        const sender_id = msg.chat.id;

        if (CommandTool.isCommand(msg)) {
            let command = CommandTool.getCommand(msg)
            
            switch (command) {
                case "siis": { ImageServices.siis(bot, msg) } break
                case "issi": { ImageServices.issi(bot, msg) } break
                case "bonk": { ImageServices.bonk(bot, msg) } break
                case "checkUrl": { bot.sendMessage(sender_id, FileServices.getCommonURL(msg.text!)!) } break
                case "img":  { 
                    bot.sendMessage(sender_id, "Just a moment, sir.").then((message: Message) => {

                        const imageSearch = new ImageSearchHandler(bot, message, `${msg.text?.substring(command!.length + 1)}`)
                        
                        setTimeout(() => {
                            imageSearch.destroy()
                        },
                        180000)


                        bot.addListener("callback_query", (btn) => {
                            const data = btn.data

                            switch (data) {
                                case "previous_img": {
                                    if (msg!.from!.username == btn.from.username) {
                                        imageSearch.previous()
                                    }
                                } break
                                
                                case "next_img": {
                                    if (msg!.from!.username == btn.from.username) {
                                        imageSearch.next()
                                    }
                                } break
                            }
                        })
        
                    })
                } break
            }
        }

        if (msg.text && contienePalabrasProhibidas(msg.text)){
            
            bannedList[msg.from!.id] = bannedList[msg.from!.id] === undefined ? 1 : bannedList[msg.from!.id] + 1;

            if (bannedList[msg.from!.id] >= 3) {
                bot.kickChatMember(sender_id, msg.from!.id.toString());
            } else {
                bot.sendMessage(sender_id, `Cuida tu vocabulario, Advertencia No. ${bannedList[msg.from!.id]}`, {                
                    reply_to_message_id: msg.message_id
                })
            }
        }
    })

    bot.on("inline_query", (qry) => {
        const matches: Array<InlineQueryResult> = dictionarySearch(qry.query).map(([word, definition], i) => {
            return {
                id: i.toString(),
                type: `article`,
                title: word,
                description: definition, 
                input_message_content: {
                    message_text: `${word}: ${definition}`  
                }
            }
        })
        bot.answerInlineQuery(qry.id, matches);
    })
}

class ImageSearch {

    bot: TelegramBot
    index: number
    avaliable: boolean
    
    constructor(bot: TelegramBot) {
        this.index = 0
        this.bot = bot
        this.avaliable = true
    }

    previous() {
        if (this.index != 0) {
            this.index -= 1
            this.bot.sendMessage(-341965778, "previous " + this.index)
        }
    }

    next() {
        this.index += 1
        this.bot.sendMessage(-341965778, "next "  + this.index)
    }

    reset() {
        this.index = 0
    }
}

function dictionarySearch(text: string): Array<[string, string]>{
    const fs = require('fs');
    const dictionary: {
        [word: string]: string
    } = JSON.parse(fs.readFileSync('./dictionary.json', 'utf8'));

    const matches: Array<[string, string]> = Object.entries(dictionary).filter(([word])=>{
        return word.includes(text);
    })

    return matches;
}

const BotController = {init};
export default BotController;

