var expect =  require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage',()=>{
    it("should generate correct message object",()=>{

        var from = "Rishabh";
        var text = "Hello to all";
        var response = generateMessage(from,text);
        
        expect(response).toInclude({from,text});
        expect(response.createdAt).toBeA('number');
        
    });
});

describe('generateLocationMessage',()=>{

    it("should generate correct location object",()=>{
        var from = 'Admin';
        var url = 'https://www.google.com/maps?q=1,1';
        var response = generateLocationMessage(from,1,1);
        expect(response.from).toBe(from);
        expect(response.url).toBe(url);
    });
});