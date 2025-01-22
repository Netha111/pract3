import { NextResponse } from "next/server";
import { dbConnection } from "@/app/lib/database";
import { UserLogin } from "@/app/lib/model";

export async function POST(request: Request) {
  try {
    await dbConnection();
    const { email } = await request.json();

    const updatedUser = await UserLogin.findOneAndUpdate(
      { email },
      { paid: true },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
} 