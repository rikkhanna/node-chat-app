var isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
    /**   ' r k '
     *      'r k'
     */
}

module.exports = {isRealString};