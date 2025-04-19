// 'use client';
// import { useEffect } from 'react';

// import { useLocalCartStore } from '@/hooks/useLocalCartStore';
// import { syncLocalToSupabase } from '@/lib//cart';
// import { useSession } from '@supabase/auth-helpers-react';

// const AuthCartSync = () => {
//   const session = useSession();
//   const { items, clearLocalCart } = useLocalCartStore();

//   useEffect(() => {
//     const sync = async () => {
//       if (session?.user && items.length > 0) {
//         try {
//           await syncLocalToSupabase(session.user.id, items);
//           clearLocalCart();
//         } catch (err) {
//           console.error("Failed to sync local cart:", err);
//         }
//       }
//     };
//     sync();
//   }, [session]);

//   return null;
// };

// export default AuthCartSync;
// 'use client';

// import { useEffect } from 'react';
// import {supabase} from '@/lib/supabaseClient'; // فایل کلاینت Supabase
// import { useLocalCartStore } from '@/hooks/useLocalCartStore'; // Zustand برای سبد خرید

// const AuthCartSync = () => {
//   const { items, addToLocalCart } = useLocalCartStore(); // افزودن آیتم‌ها به سبد خرید
//   const { user } = supabase.auth;

//   // مرحله ۱: گرفتن session و فچ کردن محصولات از Supabase
//   useEffect(() => {
//     const fetchCartFromSupabase = async () => {
//         const { data: { session } } = await supabase.auth.getSession();

      
//       if (session && session.user) {
//         const userId = session.user.id;

//         // فچ کردن کارت‌های کاربر از Supabase
//         const { data: cartItems, error } = await supabase
//           .from('Cart') // جدول سبد خرید در Supabase
//           .select('*')
//           .eq('user_id', userId);

//         if (error) {
//           console.error('Error fetching cart from Supabase:', error.message);
//         } else {
//           // اضافه کردن آیتم‌ها به سبد خرید لوکال
//           cartItems?.forEach((cartItem) => {
//             addToLocalCart({
//                 id: cartItem.book_id,
//                 title: cartItem.book_title,
//                 image: cartItem.book_image,
//                 price: cartItem.book_price,
//                 quantity: cartItem.quantity,
//               });
//           });
//         }
//       }
//     };

//     fetchCartFromSupabase();

//     // گوش دادن به تغییرات وضعیت لاگین/لاگ‌اوت
//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session?.user) {
//         fetchCartFromSupabase(); // اگر لاگین شد، سبد خرید فچ بشه
//       }
//     });

//     return () => {
//       authListener?.subscription.unsubscribe();
//     };
//   }, [addToLocalCart]);

//   return null;
// };

// export default AuthCartSync;
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // فایل کلاینت Supabase
import { useLocalCartStore } from '@/hooks/useLocalCartStore'; // Zustand برای سبد خرید

const AuthCartSync = () => {
  const { items, addToLocalCart } = useLocalCartStore(); // افزودن آیتم‌ها به سبد خرید

  // مرحله ۱: گرفتن session و فچ کردن محصولات از Supabase
  useEffect(() => {
    const fetchCartFromSupabase = async () => {
      // گرفتن session فعلی
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) { // اگر کاربر لاگین باشد
        const userId = session.user.id;

        // فچ کردن کارت‌های کاربر از Supabase
        const { data: cartItems, error } = await supabase
          .from('cart') // جدول سبد خرید در Supabase
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching cart from Supabase:', error.message);
        } else {
          // اضافه کردن آیتم‌ها به سبد خرید لوکال
          cartItems?.forEach((cartItem) => {
            addToLocalCart({
              id: cartItem.book_id,
              title: cartItem.book_title,
              image: cartItem.book_image,
              price: cartItem.book_price,
              quantity: cartItem.quantity,
            });
          });
        }
      }
    };

    fetchCartFromSupabase();

    // گوش دادن به تغییرات وضعیت لاگین/لاگ‌اوت
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchCartFromSupabase(); // اگر لاگین شد، سبد خرید فچ بشه
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [addToLocalCart]);

  return null;
};

export default AuthCartSync;
