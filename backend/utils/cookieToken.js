const getJwtToken = require('../helpers/getJwtToken');

const setCookieToken = (user, res) => {
    const token = getJwtToken(user.id);
    const options = {
        expires: new Date(
            Date.now()+3*24*60*60*1000
        ),
        httpOnly:true
    }
    user.password = undefined;
    res.cookie('token', token, options);
}

module.exports = setCookieToken;
