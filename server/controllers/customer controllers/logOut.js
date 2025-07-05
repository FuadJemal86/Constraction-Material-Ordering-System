const logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie('x-auth-token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.sendStatus(200);
}


module.exports = { logout }