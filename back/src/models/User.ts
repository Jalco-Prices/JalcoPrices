import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
    userId: string
    email: string
    isAdmin: boolean
    isDisabled: boolean
    createdAt: Date
    updatedAt: Date
}

const UserSchema = new Schema<IUser>(
    {
        userId: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        isAdmin: { type: Boolean, default: false },
        isDisabled: { type: Boolean, default: true }
    },
    { timestamps: true }
)

export default mongoose.model<IUser>('User', UserSchema)