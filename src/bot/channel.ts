import TelegramBot from 'node-telegram-bot-api';

const CHANNEL_ID = "-341965778"
export function sendMessageToChannel(bot: TelegramBot, msg: string){
    bot.sendMessage(CHANNEL_ID, msg);
}