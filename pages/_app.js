// pages/_app.js
import { useEffect } from 'react';
import { supabase } from '../src/supabaseClient';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (router.pathname !== '/' && router.pathname !== '/login' && router.pathname !== '/signup') {
          router.push('/');
        }
      } else {
        if (router.pathname === '/' || router.pathname === '/login' || router.pathname === '/signup') {
          router.push('/home');
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/');
      } else if (event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED') {
        if (router.pathname === '/' || router.pathname === '/login' || router.pathname === '/signup') {
          router.push('/home');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
