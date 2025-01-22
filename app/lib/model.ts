import { Schema, model, models, Model, Document } from "mongoose";

// Define the interface for the UserLogin document
export interface IUserLogin extends Document {
  email: string;
  paid:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const userLoginSchema = new Schema<IUserLogin>(
  {
    email: { type: String, required: true },
    paid: { type: Boolean, default: false },
},
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt` fields
  }
);

// Export the model, creating it only if it doesn't already exist
export const UserLogin: Model<IUserLogin> =
  models.UserLogin || model<IUserLogin>("UserLogin", userLoginSchema);

export interface IPost extends Document {
  title: string;
  content: string;
  author: string; // email of the author
  excerpt: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    excerpt: { type: String, required: true },
    published: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Post: Model<IPost> =
  models.Post || model<IPost>("Post", postSchema);
