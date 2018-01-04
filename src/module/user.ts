export class UserManager{
    username:string = '';
    password:string = '';

    setUserName(username:string){
        this.username = username;
    }

    setPassword(password:string){
        this.password = password;
    }
}