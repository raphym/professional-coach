export class ThankMessage {
    created_time: string;
    rating: number;
    review_text: string;
    name: string;

    constructor(created_time: string, rating: number, review_text: string, name: string) {
        this.created_time = created_time;
        this.rating = rating;
        this.review_text = review_text;
        this.name = name;
    }
}