import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  clerkId:      string
  username:     string
  email:        string
  firstName:    string
  lastName:     string
  avatarUrl:    string
  bio:          string
  website:      string
  github:       string
  twitter:      string
  role:         'admin' | 'user'
  blocked?:     boolean
  isActive:     boolean
  projectCount: number
  createdAt:    Date
  updatedAt:    Date
}

const userSchema = new Schema<IUser>(
  {
    clerkId:      { type: String, required: true, unique: true },
    username:     { type: String, required: true, unique: true, trim: true, lowercase: true },
    email:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    firstName:    { type: String, default: '', trim: true },
    lastName:     { type: String, default: '', trim: true },
    avatarUrl:    { type: String, default: '' },
    bio:          { type: String, default: '', maxlength: 500 },
    website:      { type: String, default: '' },
    github:       { type: String, default: '' },
    twitter:      { type: String, default: '' },
    role:         { type: String, enum: ['admin', 'user'], default: 'user' },
    blocked:      { type: Boolean, default: false },
    isActive:     { type: Boolean, default: true },
    projectCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

userSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`.trim()
})

userSchema.index({ clerkId: 1 })
userSchema.index({ username: 1 })
userSchema.index({ email: 1 })

export const User = model<IUser>('User', userSchema)
