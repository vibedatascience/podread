import { auth } from "@/auth";

export async function isAdmin(): Promise<boolean> {
    const session = await auth();
    // For now, we'll consider any logged-in user as "admin" or "premium" for testing,
    // or you can check for specific emails:
    // return session?.user?.email === "your-email@gmail.com";
    return !!session?.user;
}

