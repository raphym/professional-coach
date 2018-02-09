export class Article {
    _id: string;
    title: string;
    image: string;
    content: string;
    intro: string;
    date: string;
    valid: boolean;

    constructor(id: string, title: string, image: string, content: string, intro: string, date: string, valid: boolean) {
        this._id = id;
        this.title = title;
        this.image = image;
        this.content = content;
        this.intro = intro
        this.date = date;
        this.valid = valid;
    }
}