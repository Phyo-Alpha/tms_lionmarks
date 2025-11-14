"use client";

import { UnderlinedLink } from "@/client/components/login-register/underlined-link";
import { Form } from "@/client/components/ui/form";
import { FormInput } from "@/client/components/ui/form/form-input";
import { FormPasswordInput } from "@/client/components/ui/form/form-password-input";
import { FormSubmit } from "@/client/components/ui/form/form-submit";
import { authQueries } from "@/client/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// ---------------- HARDCODED VALUES ----------------
const LOGIN_BUTTON_TEXT = "Log In";
const FORGOT_PASSWORD_TEXT = "Forgot Password?";
const FORGOT_PASSWORD_LINK = "/forgot-password";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
// ---------------- END HARDCODED VALUES ----------------

export default function AdminLoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useMutation(authQueries.login());

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate(data, {
      onSuccess: () => {
        toast.success("Admin login successful. Redirecting to admin dashboard...");
        router.push("/admin");
      },
      onError: (error) => {
        toast.error(error.message ?? "Admin login failed. Please check your credentials.");
      },
    });
  };

  return (
    <main className="h-screen flex w-full relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/login_background.png')",
          }}
        />
        <div className="absolute inset-0 bg-blue-600/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        <header className="pt-8 pb-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">LionMarks</h1>
            <p className="text-white/90 text-sm">Powered by SumPlus</p>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl">
            <div className="">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                  <FormInput
                    name="email"
                    InputProps={{ inputSize: "default" }}
                    label="Email Address"
                    placeholder="Enter your email"
                    inputClassName="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />

                  <FormPasswordInput
                    name="password"
                    InputProps={{ inputSize: "default" }}
                    label="Password"
                    placeholder="Enter your password"
                    inputClassName="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />

                  <div className="flex justify-end">
                    <UnderlinedLink
                      href={FORGOT_PASSWORD_LINK}
                      className="text-background bg-blue-500 px-2 py-1"
                    >
                      {FORGOT_PASSWORD_TEXT}
                    </UnderlinedLink>
                  </div>

                  <FormSubmit className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md">
                    {LOGIN_BUTTON_TEXT}
                  </FormSubmit>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
