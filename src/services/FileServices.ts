import TelegramBot from "node-telegram-bot-api";
import ConstantTool from "./tools/ConstantTool";

export default class FileServices {
    static async getPhotoURL (bot: TelegramBot , msg: any) {
        console.log("getPhotoUrl")
        const sender_id = msg.chat.id;
		const id = msg.photo[msg.photo.length - 1].file_id;
		const file = await bot.getFile(id);
		const path = file.file_path;
        const URL: string = `https://api.telegram.org/file/bot${ConstantTool.TELEGRAM_BOT_TOKEN}/${path}`;
        return URL;
    }

    static getCommonURL(text: string) {
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; 
        let extractedURL: string | undefined = undefined;
        
        text.replace(urlRegex, function(url) {
            extractedURL = url;
            return url;
        }) 

        if (extractedURL != null) {
            return extractedURL;
        } else {
            return "null"
        }
    }

    static getFileExtension(URL: string, formats: [string]) {
        let supportedFormat: boolean = false;

        for(let i of formats){
            if (URL?.slice(-3) == (i)) { supportedFormat = true }
        }

        return supportedFormat
    }

}