const logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("x-auth-token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/customer", // this must match how it was set
    });

    res.status(200).json({ message: "Logged out successfully" });
};
