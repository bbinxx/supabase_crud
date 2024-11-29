// pages/login.js
import { useState } from 'react';
import { supabase } from '../src/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 for email input, 2 for OTP input
  const [loginMethod, setLoginMethod] = useState(null); // 'password' or 'otp'
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (loginMethod === 'password') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Error signing in:', error);
        setLoading(false);
      } else {
        router.push('/home');
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        console.error('Error sending OTP:', error);
        setLoading(false);
      } else {
        setStep(2);
      }
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
      router.push('/home');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <p>Don't have an account? <Link href="/signup">Sign Up</Link></p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {loginMethod === 'password' && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        {loginMethod === 'otp' && step === 2 && (
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}
        <div style={{ marginTop: '10px' }}>
          <button type="button" onClick={() => setLoginMethod('password')} style={{ marginRight: '10px' }}>
            Login with Password
          </button>
          <button type="button" onClick={() => setLoginMethod('otp')}>
            Login with OTP
          </button>
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
          {loginMethod === 'password' ? (loading ? 'Logging In...' : 'Login') : (step === 1 ? (loading ? 'Sending OTP...' : 'Send OTP') : (loading ? 'Verifying OTP...' : 'Verify OTP'))}
        </button>
      </form>
    </div>
  );
}
