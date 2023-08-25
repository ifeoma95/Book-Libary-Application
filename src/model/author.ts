import mongoose, {Schema, Document, Model} from 'mongoose'
import { Books, IBook } from './book';

export interface IAuthor extends Document{
    authorName: string;
    email: string;
    password: string;
    phoneNumber: number;
    books: IBook[];
}

const authorSchema = new Schema({
    authorName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        unique: true
    },
    books:[{
        type: mongoose.Types.ObjectId,
        ref: 'Books'
    }]
})

const Author = mongoose.model<IAuthor>("Authors", authorSchema)

export {Author}