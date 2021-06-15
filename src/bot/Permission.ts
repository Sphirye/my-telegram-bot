import fs from 'fs';

export function isAllowed(id: number): boolean{
    let ids: Array<string> = fs.readFileSync('./allowed.txt', 'utf-8').split('./n');
    return !!ids.find(allowed_id => Number.parseInt(allowed_id) === id)
}

export function register(id: number){
    fs.appendFileSync('./allowed.txt', "/n" + id.toString(), 'utf8');
}