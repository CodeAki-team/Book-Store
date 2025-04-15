import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useUser = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check if there's a session when the component is mounted using getSession
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user); // If session exists, set the user
            }
        };

        fetchSession();

        // Listen for auth changes and update the user state accordingly
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    setUser(session.user); // If session exists, set the user
                } else {
                    setUser(null); // No session, set user to null
                }
            }
        );

        // Cleanup the listener on unmount
        return () => {
            authListener?.subscription?.unsubscribe(); // Properly access 'subscription' before calling 'unsubscribe'
        };
    }, []);

    return user;
};
