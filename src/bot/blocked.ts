import fs from 'fs';

export function contienePalabrasProhibidas(msg: string){
    let blocked_word: Array<string> = JSON.parse(fs.readFileSync("./blocked.json", "utf8"))
    return !!blocked_word.find(word => msg.includes(word))
}