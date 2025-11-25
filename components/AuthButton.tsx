import { signIn, signOut, auth } from "@/auth"

export default async function AuthButton() {
    const session = await auth()

    if (!session?.user) {
        return (
            <form
                action={async () => {
                    "use server"
                    await signIn("google")
                }}
            >
                <button type="submit" className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 hover:text-accent">
                    Sign In
                </button>
            </form>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {session.user.image && (
                    <img src={session.user.image} alt="User" className="w-6 h-6 rounded-full border border-gray-200" />
                )}
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-700 hidden sm:inline-block">
                    {session.user.name}
                </span>
            </div>
            <span className="h-4 w-px bg-gray-300 mx-1"></span>
            <form
                action={async () => {
                    "use server"
                    await signOut()
                }}
            >
                <button type="submit" className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 hover:text-accent transition-colors">
                    Sign Out
                </button>
            </form>
        </div>
    )
}
