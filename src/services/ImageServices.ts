import { AxiosResponse, ResponseType } from "axios";
import { Response } from "express";
import TelegramBot, { Message } from "node-telegram-bot-api";
import sharp from "sharp";
import FileServices from "./FileServices";
import ConstantTool from "./tools/ConstantTool";
const text2png = require('text2png');
const axios = require('axios')
//@ts-ignore
import imageToAscii from 'image-to-ascii'

const caption:string = "Here's your photo, sir."

export default class ImageServices {

    static async siis(bot: TelegramBot , msg: Message) {
        let url: string | undefined = await this.getUrl(bot, msg)
        const sender_id = msg.chat.id

        if (url == undefined) { bot.sendMessage(sender_id, "I dont see any url in your message, sir.") }
        else try {
            const response = await axios.get(url, { responseType: 'arraybuffer' })
    
            await sharp(response!.data)
            .metadata()
            .then((metadata) => {
                return sharp(response.data)
                    .extract({ left: 0, top: 0, width: Math.round(metadata.width! / 2), height: metadata.height! })
                    .flop()
                    .toBuffer()
            })
            .then((metadata) => {
                return sharp(response.data)
                    .composite([{ input: metadata, gravity: 'southeast' }])
                    .toBuffer()
            })
                .then((data) => {
                    bot.sendPhoto(sender_id, data, { caption: caption })
            })

        } catch (error) {
            console.log(error)
        }
    }

    static async issi(bot: TelegramBot , msg: any) {
        let url: string | undefined = await this.getUrl(bot, msg)
        const sender_id = msg.chat.id

        if (url == undefined) { bot.sendMessage(sender_id, "I dont see any url in your message, sir.") }
        else try {
            const response = await axios.get(url, { responseType: 'arraybuffer' })
            
            await sharp(response.data)
                .metadata()
                .then((metadata) => {
                    return sharp(response.data)
                    .flop()
                    //Se resta una unidad a la posición extraida para evitar errores.
                    .extract({ 
                        left: Math.round(metadata.width! * 0.5) - 1, 
                        top: 0, width: Math.round(metadata.width! / 2), 
                        height: metadata.height! 
                    })
                    .toBuffer()
                })
                .then((data) => {
                    return sharp(response.data)
                    .composite([{ input: data, gravity: 'southwest' }])
                    .toBuffer()
                })
                .then((data) => {
                    bot.sendPhoto(sender_id, data, { caption: caption })
                })
        } catch (error) {
            console.log(error)
        }
    }

    static async bonk(bot: TelegramBot, msg: any) {

        let url: string | undefined = await this.getUrl(bot, msg)
        const sender_id = msg.chat.id

        if (url == undefined) { bot.sendMessage(sender_id, "I dont see any url in your message, sir.") }
        else try {
            const response = await axios.get(url, { responseType: 'arraybuffer' })
            sharp(response.data)
                .metadata()
                .then((metadata) => {
                    return sharp(response.data)
                    .resize(500, 50, { fit: 'fill' })
                    .png()
                    .toBuffer()
                }).then((data) => {
                    bot.sendPhoto(sender_id, data, { caption: caption })
                })
        } catch (error) {
            console.log(error)
        }
    }

    static async ascii(bot: TelegramBot, msg: Message) {
        const sender_id = msg.chat.id

        let url = await this.getUrl(bot, msg)

        if (url == undefined) {
            bot.sendMessage(sender_id, "I founded no links in there, sir.")
        } else {
            imageToAscii(url, { 
                colored: false,
                size: { width: 100/2, height: 40 },
                size_options: { screen_size: { width: 100, height: 100 }, preserve_aspect_ratio: false },
                white_bg: true
            }, (err: any, converted: string) => {
                bot.sendMessage(sender_id , "```" + converted + "```", { parse_mode: "MarkdownV2" })
            })
        }

    }

    static async getUrl(bot: TelegramBot, msg: Message){
        if (msg.photo) {
            return await FileServices.getPhotoURL(bot, msg)
        }

        if (!msg.photo) {
            return FileServices.getCommonURL(msg)
        }

        if ((msg.text == undefined) && (!msg.photo)) {
            bot.sendMessage(msg.chat.id, "I don't see any link in there, sir.")
        }
    }
}