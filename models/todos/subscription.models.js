import mongoose,{Schema} from "mongoose";

const subscriptionschema=Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

export const Subscription=new mongoose.models("Subscription",subscriptionschema);