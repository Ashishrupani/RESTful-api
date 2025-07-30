export const userHit = (req,res) =>{
    console.log('user page');
    res.status(200).json({
        message : "api/user hit..."
    });
}