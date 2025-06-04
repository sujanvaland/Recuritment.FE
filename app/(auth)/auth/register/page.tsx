"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/lib/auth";
import authService from "@/services/authService";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "job-seeker" as UserRole,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters")
      return
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      company: "",
      title: "",
    }

    console.log('userData', userData);

    try {
      const response = await authService.register(userData)
      console.log("Registered:", response)

      if (response.status == 200)

      // Show success toast
      {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "job-seeker" as UserRole,
        })
        toast.success("Account created successfully! Welcome to JobConnect!")
      }
      else {
        toast.error(response?.data?.error)
      }
      // Clear form data after successful registration

    } catch (error: any) {
      console.error("Registration failed:", error)

      // Check for duplicate email error
      if (
        error.response?.status === 409 ||
        error.response?.data?.message?.toLowerCase().includes("email") ||
        error.response?.data?.error?.toLowerCase().includes("email") ||
        error.response?.data?.toLowerCase().includes("User with this email already exists")
      ) {
        toast.error("An account with that email already exists. Please use a different email or try signing in.")
      } else if (error.response?.data?.message) {
        // Show specific error message from backend
        toast.error(error.response.data.message)
      } else {
        // Generic error message
        toast.error("Registration failed. Please try again.")
      }
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to create your JobConnect account
        </p>
      </div>
      {(error || formError) && (
        <Alert variant="destructive">
          <AlertDescription>{formError || error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>I am a</Label>
              <RadioGroup
                defaultValue="job-seeker"
                className="flex"
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="job-seeker" id="job-seeker" />
                  <Label htmlFor="job-seeker" className="font-normal">
                    Job Seeker
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label htmlFor="employer" className="font-normal">
                    Employer
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        <span>Already have an account? </span>
        <Link
          href="/auth/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
