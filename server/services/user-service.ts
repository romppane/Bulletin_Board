import {} from 'awilix';
export class UserService {

    private current : Number;
    private repository : any

    constructor(current : Number, repository : any) {
        this.current = current;
        this.repository = repository;
    }

    // Get one
    getOne() {
        return this.repository.find(this.current);
    }




    // Get all

    // Post

    // Put

    // Delete
}