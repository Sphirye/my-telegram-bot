import TelegramBot, { InlineQueryResult, Message } from 'node-telegram-bot-api';
import {isAllowed, register} from './Permission';
import { contienePalabrasProhibidas } from './blocked';
import { sendMessageToChannel } from './channel';
import ConstantTool from "../services/tools/ConstantTool";
import sharp from 'sharp';
import ImageServices from '../services/ImageServices';
import FileServices from "../services/FileServices";

const axios = require('axios')
const text2png = require('text2png');

function init(): void{

    const bot = new TelegramBot(ConstantTool.TELEGRAM_BOT_TOKEN as string, {polling: true});      
    const bannedList: { 
        [key: string]: number 
    } = {};

    //bot.sendMessage(-341965778, "Hey guys, TF2 Soldier here")

    bot.on("message", (msg) => {

        const sender_id = msg.chat.id;

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

        if (command(msg, "/url")) {
            let bruh = FileServices.getCommonURL(msg.text!);
            bot.sendMessage(sender_id, bruh)
        }

        if (command(msg, "/siis")) {
            ImageServices.siis(bot, msg)
        }

        if (command(msg, "/issi")) {
            ImageServices.issi(bot, msg)
        }

        if (command(msg, "/bonk")) {
            ImageServices.bonk(bot, msg)
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

function command(msg: Message, command: string) {

    let text: string = ""
    let firstWord: string = ""

    if (msg.text) {
        text = msg.text
    } else {
        if (msg.caption) {
            text = msg.caption
        }
    }

    for(let letter of text) {
        if (letter != " ") {
            firstWord = firstWord + letter
        } else {
            break;
        }
    }

    return (firstWord === command)
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

