export class RemoveCharacter {

    static removeLastSlash(text: string): string {
        if (!!text) {
            const slash = text.slice(-1);
            if (slash === "/") {
                return text.substr(0, text.length - 1);
            }
        }
        return text;
    }
}