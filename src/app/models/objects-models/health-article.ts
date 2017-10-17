export class HealthArticle {
    _id: string;
    title: string;
    image: string;
    content: string;

    constructor(id: string, title: string, image: string, content: string) {
        this._id = id;
        this.title = title;
        this.image = image;
        this.content = content;
    }
}