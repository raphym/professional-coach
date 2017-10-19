export class User {

    constructor(public email: string,
        public password: string,
        public levelRights: number,
        public firstName: string,
        public lastName: string,
        public phone?: number,
        public street?: string,
        public streetNumber?: number,
        public city?: string,
        public country?: string,
        public picture?: string
        ){}
}