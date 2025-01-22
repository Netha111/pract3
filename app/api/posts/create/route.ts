import { dbConnection } from "@/app/lib/database";
import { Post } from "@/app/lib/model";
import { NextResponse } from "next/server";

const AUTHORIZED_EMAIL = "pavan@gmail.com";

export async function POST(request: Request) {
  try {
    await dbConnection();
    console.log("Connected to MongoDB");
    
    const data = await request.json();
    console.log("Received data:", data);

    if (data.author !== AUTHORIZED_EMAIL) {
      return NextResponse.json(
        { error: "it is only for authors" },
        { status: 403 }
      );
    }

    const post = await Post.create({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
    });
    
    console.log("Created post:", post);

    return NextResponse.json({ message: "Post created successfully", post });
  } catch (error) {
    console.log("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
} 