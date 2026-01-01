import mongoose from "mongoose";

const todoSchema=mongoose.Schema({},{timestamps:true});

export const todo=mongoose.Model("Todos",todoSchema);