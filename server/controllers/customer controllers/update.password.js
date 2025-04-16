

const updatePassword = async (req, res) => {


    const { password } = req.body

    const token = req.cookies['t-auth-token']

    if(!token) {
        return res.status(400).json({status: false , message: 'token not provide'})
    }



}