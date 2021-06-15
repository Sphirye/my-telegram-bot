import TelegramBot, { Message } from "node-telegram-bot-api";
import sharp from "sharp";
import FileServices from "./FileServices";
const text2png = require('text2png');
const axios = require('axios')

const caption:string = "Here's your photo, sir."

export default class ImageServices {

    static async siis(bot: TelegramBot , msg: Message) {
        try {
            let URL: string | undefined = undefined;
            const sender_id = msg.chat.id;

            if (msg.photo) {
                URL = await FileServices.getPhotoURL(bot, msg)
            } else {
                if (FileServices.getCommonURL(msg.text!) != "null") {
                    URL = FileServices.getCommonURL(msg.text!)
                }
                if (FileServices.getCommonURL(msg.text!) == "null") {
                    bot.sendMessage(sender_id, "Sir, this url is not avaliable")
                }
            }
            
            for(let i of ["png", "jpeg", "jpg"]){
                let supportedFormat: boolean = false;
                console.log(i)
            }

            if (URL?.slice(-3) == ("mp4")) {
                bot.sendMessage(sender_id, "Sir, this format is unsupported for this command.")
            }
            const response = await axios.get(URL, { responseType: 'arraybuffer' })
            
            await sharp(response.data)
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
        try {
            const sender_id = msg.chat.id;
            const URL: string = await FileServices.getPhotoURL(bot, msg)
            const response = await axios.get(URL, { responseType: 'arraybuffer' })
            
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
        try {
            const sender_id = msg.chat.id;
            const URL: string = await FileServices.getPhotoURL(bot, msg)
            const response = await axios.get(URL, { responseType: 'arraybuffer' })
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
}