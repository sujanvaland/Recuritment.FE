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
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert variant="default" className="mb-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <Button onClick={requestOtp} disabled={!email}>Send OTP</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input id="otp" value={otp} onChange={e => setOtp(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={verifyOtp} disabled={!otp}>Verify OTP</Button>
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={resetPassword} disabled={!password}>Reset Password</Button>
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
          </div>
        </div>
      )}

      
    </div>
  )
}
