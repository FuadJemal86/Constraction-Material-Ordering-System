const logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie('s-auth-token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.sendStatus(200);
}


module.exports = { logout }