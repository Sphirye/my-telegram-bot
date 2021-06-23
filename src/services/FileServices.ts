import TelegramBot from "node-telegram-bot-api";
import ConstantTool from "./tools/ConstantTool";

export default class FileServices {
    static async getPhotoURL (bot: TelegramBot , msg: any) {
		const id = msg.photo[msg.photo.length - 1].file_id
		const file = await bot.getFile(id)
        return `https://api.telegram.org/file/bot${ConstantTool.TELEGRAM_BOT_TOKEN}/${file.file_path}`
    }

    static getCommonURL(text: string): string | undefined {
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        let extractedURL: string | undefined = undefined
        
        text.replace(urlRegex, function(url) {
            extractedURL = url;
            return url;
        }) 

        return extractedURL
    }

    static getFileExtension(URL: string, formats: [string]) {
        let supportedFormat: boolean = false;

        for(let i of formats){
            if (URL?.slice(-3) == (i)) { supportedFormat = true }
        }

        return supportedFormat
    }

}