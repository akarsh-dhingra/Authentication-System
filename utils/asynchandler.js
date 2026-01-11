// const asynchandler=(fn)=>{
//    return async (res,req,next)=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code||500).json({
//             success:false,
//             msg:error.message 
//         })
//     }
// }}
const asynchandler=(fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch(next);
    };
};

export default asynchandler;

