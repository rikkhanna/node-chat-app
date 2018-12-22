const {Users} = require('./Users');
const expect = require('expect');


var users;

beforeEach(()=>{
    users = new Users();
    users.users = [{
        id:'1',
        name:'Rick',
        room:'Nodejs'
    },{
        id:'2',
        name:'Rob',
        room:'React'
    },{
        id:'3',
        name:'Panav',
        room:'Nodejs'
    }];
});

describe('Users',() => {
    it('should add new user', () => {
        var user = new Users();
        var userInfo = {
            id:'123',
            name:'Rishabh',
            room:'Nodejs'
        }
        user.addUser(userInfo.id,userInfo.name,userInfo.room);
        expect(user.users).toEqual([userInfo]);
    });

    it('should return names for Nodejs' ,() => {
        var userList = users.getUserList('Nodejs');
        expect(userList).toEqual(['Rick','Panav']);
    });

    it('should return names for React' ,() => {
        var userList = users.getUserList('React');
        expect(userList).toEqual(['Rob']);
    });

    it('should remove a user',() => {
        var userId = '1';
        var user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });
    it('should not remove a user',() => {

        var userId = '5';
        var user = users.removeUser(userId);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });
    it('should find a user',() => {
        var user = users.getUser('1');
        expect(user).toInclude(users.users[0]);
    });
    it('should not find a user',() => {
        var user = users.getUser('4');
        expect(user).toNotExist();
    });
});