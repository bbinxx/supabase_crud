// pages/login.js
import { useState } from 'react';
import { supabase } from '../src/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 for email input, 2 for OTP input
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error('Error sending OTP:', error);
      setLoading(false);
    } else {
      setStep(2);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'magiclink' });
    if (error) {
      console.error('Error verifying OTP:', error);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {step === 1 && (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleOtp}>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
      )}
    </div>
  );
}
