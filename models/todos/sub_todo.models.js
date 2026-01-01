import mongoose from "mongoose";

const subtodoSchema=mongoose.Schema({});

export const Subtodo=mongoose.Model("Sub_todo",subtodoSchema);
