const checkAuth =(req, res , next)=>{
    if (req.session && req.session.userId){
        next();
    }else{

    }res.redirect('/backend/login')
};
module.exports= {checkAuth};

