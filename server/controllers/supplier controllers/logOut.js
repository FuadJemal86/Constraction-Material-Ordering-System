const logout = (req, res) => {
    res.clearCookie('s-auth-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.sendStatus(200);
}


module.exports = { logout }