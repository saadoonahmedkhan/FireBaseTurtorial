import React from "react";
import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

export default function Auth() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    // Logic remains the same, just keeping it clean
    const handleSignup = async () => {
        try { await createUserWithEmailAndPassword(auth, email, password); }
        catch (err) { console.error(err); }
    };

    const signinWithGoogle = async () => {
        try { await signInWithPopup(auth, googleProvider); }
        catch (err) { console.error(err); }
    };

    const handleSignout = async () => {
        try { await signOut(auth); }
        catch (err) { console.error(err); }
    };

    return (
        <div className="mx-auto mt-20 max-w-sm rounded-3xl border border-white/10 bg-zinc-900 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black tracking-tight text-white">Welcome</h1>
                <p className="text-sm text-zinc-400">Manage your movie database</p>
            </div>

            <div className="space-y-4">
                {/* Email Input */}
                <input 
                    type="email" 
                    placeholder="Email address"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-800/50 p-3 text-white placeholder-zinc-500 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password Input */}
                <input 
                    type="password" 
                    placeholder="Password"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-800/50 p-3 text-white placeholder-zinc-500 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Signup Button */}
                <button 
                    onClick={handleSignup}
                    className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-zinc-950 transition-all hover:bg-emerald-400 active:scale-95"
                >
                    Create Account
                </button>

                <div className="relative my-6 flex items-center py-2">
                    <div className="flex-grow border-t border-zinc-800"></div>
                    <span className="mx-4 flex-shrink text-xs font-bold uppercase tracking-widest text-zinc-600">OR</span>
                    <div className="flex-grow border-t border-zinc-800"></div>
                </div>

                {/* Google Sign-in */}
                <button 
                    onClick={signinWithGoogle}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 py-3 font-semibold text-white transition-all hover:bg-zinc-800 active:scale-95"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="google" />
                    Sign in with Google
                </button>

                {/* Logout */}
                <button 
                    onClick={handleSignout}
                    className="mt-4 w-full text-sm font-medium text-zinc-500 transition-colors hover:text-red-400"
                >
                    Sign Out of System
                </button>
            </div>
        </div>
    );
}