export class User {

    constructor(
        public _id:number,
        public userName: string,
        public email: string,
        public password: string,
        public levelRights: number,
        public firstName: string,
        public lastName: string,
        public randomSecretCode:string,
        public randomHash:string,
        public registered:boolean,
        public phone?: number,
        public street?: string,
        public streetNumber?: number,
        public city?: string,
        public country?: string,
        public picture?: string
        ){}
}