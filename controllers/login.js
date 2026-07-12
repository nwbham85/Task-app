export async function loginUser(req,res) {
    const {email, password} = req.body;
    console.log(req.body);

    res.status(200).json({
        message: 'Login controller reached'
    })
}

