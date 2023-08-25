import mongoose, {Schema, Document, Model} from 'mongoose'
import { IAuthor } from './author';

export interface IBook extends Document{
    title: string;
    datePublished: Date;
    description: string;
    pageCount: number;
    genre: string;
    publisher: string;
    authorId: string;
}

const bookSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    datePublished: {
        type: Date,
        required: true,
    },
    description:{
        type: String,
        default: "none"
    },
    pageCount:{
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        default: "N/A"
    },
    publisher: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Types.ObjectId,
        required: true,
    }
})

export const Books = mongoose.model<IBook>("Books", bookSchema)