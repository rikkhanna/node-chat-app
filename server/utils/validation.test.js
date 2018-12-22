const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString',() => {
    it('should reject non-string values',() => {
        expect(isRealString(123)).toNotBe('string');
    });
    it('should reject String with only spaces', () => {
        expect(isRealString('  ')).toBeFalsy();
    });

    it('should allow string with non space characters', () => {
        expect(isRealString(' rick  khanna  ')).toBeTruthy();
    })
});