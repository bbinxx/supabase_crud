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
        router.push('/login');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
