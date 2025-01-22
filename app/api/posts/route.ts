import { NextResponse } from "next/server";
import { dbConnection } from "@/app/lib/database";
import { Post, UserLogin } from "@/app/lib/model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import isEmail from "validator/lib/isEmail";
import { normalizeEmail } from "validator";

interface SessionUser {
  email: string;
  // other user properties
}

interface Session {
  user?: SessionUser;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!session?.user?.email || !isEmail(session.user.email)) {
      return NextResponse.json(
        { error: "Invalid or missing email" },
        { status: 401 }
      );
    }
   
    await dbConnection();
    
    // Check if user has paid
    const user = await UserLogin.findOne({ 
      email: normalizeEmail(session.user.email) || '' 
    });
    
    if (!user?.paid) {
      return NextResponse.json(
        { error: "Please subscribe to view posts", isPaid: false },
        { status: 403 }
      );
    }

    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.log("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
} 