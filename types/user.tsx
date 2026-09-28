export type User = {
    id:string;
    username:string;
    first_name:string;
    last_name:string;
    email:string;
};

export type RegisterPayload = {
    username:string;
    first_name:string;
    last_name:string;
    email:string;
    password:string;
    password_confirmation:string;
}