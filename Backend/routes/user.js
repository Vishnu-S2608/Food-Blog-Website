const express= require('express');
const{userLogin,userSignUp,getUser}=require('../controller/usercntrl');
const { sendOtp, verifyOtp } = require('../controller/otpController');
const router=express.Router();

router.post('/signUp',userSignUp);
router.post('/login',userLogin);
router.get('/user/:id',getUser);

// ✅ New OTP routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports=router;