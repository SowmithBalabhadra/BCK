import mongoose from "mongoose";

export const  connectDB = async () =>{
    await mongoose.connect('mongodb+srv://sowmithbalabhadra:panda@cluster0.f4t0t.mongodb.net/shopsphere').then(()=>console.log("DB Connected"))
}




