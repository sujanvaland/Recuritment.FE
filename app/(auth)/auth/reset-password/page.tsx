"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DataService } from "@/services/axiosInstance"

export default function ResetPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const requestOtp = async () => {
    setError(null)
    try {
      const response = await DataService.post('/auth/request-otp', { email })
      if (response.status === 200) {
        setMessage('OTP sent to your email')
        setStep(2)
        // Demo: show OTP from response
        if (response.data?.otp) setOtp(response.data.otp)
      } else {
        setError(response.data?.error || 'Failed to send OTP')
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP')
    }
  }

  const verifyOtp = async () => {
    setError(null)
    try {
      debugger;
      const response = await DataService.post('/auth/verify-otp', { email, otp: otp })
      if (response.status === 200) {
        setMessage('OTP verified')
        setStep(3)
      } else {
        setError(response.data?.error || 'Failed to verify OTP')
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to verify OTP')
    }
  }

  const resetPassword = async () => {
    setError(null)
    try {
      const response = await DataService.post('/auth/reset-password', { email, password,otp: otp })
      if (response.status === 200) {
        setMessage('Password reset successful. Please login with your new password.')
        router.push('/auth/login')
      } else {
        setError(response.data?.error || 'Failed to reset password')
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
        <div className="p-8">
          <div className="flex flex-col space-y-3 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">Reset Password</h1>
            <p className="text-gray-600">Enter your email to reset your password</p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert variant="default" className="mb-6">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input 
                  id="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  required
                  className="h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button 
                onClick={requestOtp} 
                disabled={!email}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base"
              >
                Send OTP
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-700 font-medium">OTP</Label>
                <Input 
                  id="otp" 
                  value={otp} 
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  className="h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={verifyOtp} 
                  disabled={!otp}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base"
                >
                  Verify OTP
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="h-12"
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">New Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={resetPassword} 
                  disabled={!password}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base"
                >
                  Reset Password
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="h-12"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
