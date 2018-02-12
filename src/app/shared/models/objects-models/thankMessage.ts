export class ThankMessage {
    createdTime: string;
    rating: number;
    reviewText: string;
    name: string;

    constructor(createdTime: string, rating: number, reviewText: string, name: string) {
        this.createdTime = createdTime;
        this.rating = rating;
        this.reviewText = reviewText;
        this.name = name;
    }
}