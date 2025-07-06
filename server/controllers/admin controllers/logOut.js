

const logout = (req, res) => {
    res.clearCookie('a-auth-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });

}


module.exports = { logout }