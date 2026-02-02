import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { getApiBase } from '../lib/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification link.');
      return;
    }
    fetch(`${getApiBase()}/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json?.data?.success) {
          setStatus('success');
          setMessage(json?.data?.message || 'Email verified. You can now log in.');
        } else {
          setStatus('error');
          setMessage(json?.data?.message || json?.error || 'Invalid or expired link.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error. Please try again.');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Email verified'}
            {status === 'error' && 'Verification failed'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === 'loading' && <Loader2 className="h-10 w-10 animate-spin text-blue-600" />}
          {status === 'success' && <CheckCircle className="h-10 w-10 text-green-600" />}
          {status === 'error' && <XCircle className="h-10 w-10 text-red-600" />}
          {(status === 'success' || status === 'error') && (
            <Button asChild className="w-full">
              <Link to="/login">Go to Log in</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
