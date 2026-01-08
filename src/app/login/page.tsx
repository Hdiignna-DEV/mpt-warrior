'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginSplit from '@/components/LoginSplit';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user is pending, redirect to pending page
        if (data.status === 'pending' && data.user) {
          localStorage.setItem('mpt_user', JSON.stringify(data.user));
          window.location.href = '/pending-approval';
          return;
        }
        throw new Error(data.error || 'Login gagal');
      }

      // Store user data and token in localStorage (for compatibility with Academy pages)
      localStorage.setItem('mpt_user', JSON.stringify(data.user));
      localStorage.setItem('mpt_token', data.token);
      localStorage.setItem('token', data.token); // <-- Tambahkan baris ini

      // Force page reload to trigger middleware with new token
      window.location.href = data.user.role === 'ADMIN' ? '/admin-hq' : '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-4 flex items-center justify-center">
      <LoginSplit />
    </div>
  );
}
