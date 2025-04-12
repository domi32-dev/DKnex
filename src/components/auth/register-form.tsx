"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const RegisterForm = () => {
   const router = useRouter();
   const [form, setForm] = useState({ name: "", email: "", password: "" });
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
         const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
         });

         const data = await res.json();

         if (!res.ok) {
            setError(data.error || "Registration failed");
            setLoading(false);
            return;
         }

         const login = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
         });

         if (login?.error) {
            setError("Registered, but failed to log in.");
            setLoading(false);
            return;
         }

         router.push("/");
      } catch (err) {
         console.error("Register error:", err);
         setError("Something went wrong. Please try again.");
         setLoading(false);
      }
   };

   return (
      <div className="max-w-md mx-auto p-6 rounded-xl border bg-background shadow text-foreground">
         <h1 className="text-2xl font-bold mb-6 text-center">
            Create an Account
         </h1>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
               </label>
               <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring focus:ring-primary/30"
                  required
               />
            </div>

            <div>
               <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
               >
                  Email
               </label>
               <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring focus:ring-primary/30"
                  required
                  autoComplete="email"
               />
            </div>

            <div>
               <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
               >
                  Password
               </label>
               <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring focus:ring-primary/30"
                  required
                  autoComplete="new-password"
               />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
               {loading ? "Creating account..." : "Register"}
            </Button>
         </form>

         <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
               Sign in
            </Link>
         </p>
      </div>
   );
};

export default RegisterForm;
