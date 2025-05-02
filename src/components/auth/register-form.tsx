"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/validations/auth";

interface ValidationErrors {
   [key: string]: string[];
}

const inputClasses =
   "w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/30 focus:border-transparent transition-colors [&::-ms-reveal]:hidden [&::-ms-clear]:hidden";
const labelClasses =
   "block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100";

const RegisterForm = () => {
   const router = useRouter();
   const [form, setForm] = useState({ name: "", email: "", password: "" });
   const [showPassword, setShowPassword] = useState(false);
   const [errors, setErrors] = useState<ValidationErrors | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      setErrors(null);
      setSuccess(null);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors(null);
      setSuccess(null);
      setLoading(true);

      // Client-side validation
      const validationResult = registerSchema.safeParse(form);
      if (!validationResult.success) {
         const formattedErrors = validationResult.error.errors.reduce(
            (acc, err) => {
               const field = err.path[0] as string;
               if (!acc[field]) acc[field] = [];
               acc[field].push(err.message);
               return acc;
            },
            {} as ValidationErrors
         );

         setErrors(formattedErrors);
         setLoading(false);
         return;
      }

      try {
         const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
         });

         const data = await res.json();

         if (!res.ok) {
            if (data.validationErrors) {
               setErrors(data.validationErrors);
            } else {
               setErrors({ general: [data.message || "Registration failed"] });
            }
            setLoading(false);
            return;
         }

         setSuccess(data.message);

         const login = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
         });

         if (login?.error) {
            setErrors({
               general: [
                  "Registered successfully, but failed to log in automatically.",
               ],
            });
            setLoading(false);
            return;
         }

         router.push("/");
      } catch (err) {
         console.error("Register error:", err);
         setErrors({ general: ["Something went wrong. Please try again."] });
         setLoading(false);
      }
   };

   return (
      <div className="max-w-md mx-auto p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-background shadow text-foreground">
         <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            Create an Account
         </h1>

         {success && (
            <div className="mb-4 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
               {success}
            </div>
         )}

         {errors?.general && (
            <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
               {errors.general.map((error, i) => (
                  <div key={i}>{error}</div>
               ))}
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label htmlFor="name" className={labelClasses}>
                  Full Name
               </label>
               <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                  placeholder="John Doe"
               />
               {errors?.name && (
                  <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                     {errors.name.map((error, i) => (
                        <div key={i}>{error}</div>
                     ))}
                  </div>
               )}
            </div>

            <div>
               <label htmlFor="email" className={labelClasses}>
                  Email
               </label>
               <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
               />
               {errors?.email && (
                  <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                     {errors.email.map((error, i) => (
                        <div key={i}>{error}</div>
                     ))}
                  </div>
               )}
            </div>

            <div>
               <label htmlFor="password" className={labelClasses}>
                  Password
               </label>
               <div className="relative">
                  <input
                     id="password"
                     name="password"
                     type={showPassword ? "text" : "password"}
                     value={form.password}
                     onChange={handleChange}
                     className={inputClasses}
                     required
                     autoComplete="off"
                     placeholder="••••••••"
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                     aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                     {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                     ) : (
                        <Eye className="h-5 w-5" />
                     )}
                  </button>
               </div>
               {errors?.password && (
                  <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                     {errors.password.map((error, i) => (
                        <div key={i}>{error}</div>
                     ))}
                  </div>
               )}
            </div>

            <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded text-sm border dark:border-gray-700">
               <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Password Requirements:
               </h2>
               <ul className="text-gray-700 dark:text-gray-300 list-disc pl-4 space-y-1">
                  <li>At least 8 characters</li>
                  <li>Maximum 100 characters</li>
                  <li>At least one uppercase letter (A-Z)</li>
                  <li>At least one lowercase letter (a-z)</li>
                  <li>At least one number (0-9)</li>
                  <li>At least one special character (@$!%*?&)</li>
               </ul>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
               {loading ? "Creating account..." : "Register"}
            </Button>
         </form>

         <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
               href="/auth/signin"
               className="text-blue-600 hover:underline dark:text-blue-400"
            >
               Sign in
            </Link>
         </p>
      </div>
   );
};

export default RegisterForm;
