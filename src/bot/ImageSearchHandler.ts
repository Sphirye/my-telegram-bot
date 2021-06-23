import axios from "axios"
import TelegramBot, { Message } from "node-telegram-bot-api"
import ConstantTool from "../services/tools/ConstantTool"
import JsonTool from "../services/tools/JsonTool"
import GoogleImg from "./models/GoogleImg"


async function getResponse(query: string) {
    let response = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${ConstantTool.GOOGLE_IMAGE_API_KEY}&cx=e056d1bc433db6bee&q=${query}&searchType=IMAGE`)
    let img = JsonTool.jsonConvert.deserializeArray(response.data.items, GoogleImg)
    return img
}

async function update(bot: TelegramBot, items: [GoogleImg], index: number, message: Message) {
    bot.editMessageText(items[index].link!, {
        message_id: message.message_id,
        chat_id: message.chat.id,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '◀️',
                        callback_data: "previous_img",
                    },
                    {
                        text: '▶️',
                        callback_data: "next_img"
                    },
                ]
            ]
        }
    })
}

export default class ImageSearch {

    bot: TelegramBot
    index: number
    items: [GoogleImg] = [{}]
    msg: Message
    t: any = undefined
    
    constructor(bot: TelegramBot, msg: Message, query: string) {
        this.msg = msg
        this.index = 0
        this.bot = bot

        getResponse(query).then((XD) => {
            this.items.splice(0, this.items.length)
            XD.forEach(item => this.items.push(item))
            update(this.bot, this.items, this.index, this.msg!)
        })
        
    }

    previous() {
        if (this.index != 0) {
            this.index -= 1
            update(this.bot, this.items, this.index, this.msg)
        }
    }

    next() {
        this.index += 1
        update(this.bot, this.items, this.index, this.msg)
    }

    destroy() {
        console.log("destroying")
        this.bot.editMessageText("Petition expired.", {
            message_id: this.msg.message_id,
            chat_id: this.msg.chat.id,
        })
    }
}