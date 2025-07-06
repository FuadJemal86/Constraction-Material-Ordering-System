const isProduction = process.env.NODE_ENV === "production";


const logout = (req, res) => {
    res.clearCookie('a-auth-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.sendStatus(200);
}


module.exports = { logout }