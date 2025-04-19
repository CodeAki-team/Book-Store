// "use client";

// import { useCartStore } from "@/hooks/cartStore";
// import { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { ShoppingCart } from "lucide-react";
// import { useSmartCart } from "@/hooks/useSmartCart";

// type Props = {
//   product: {
//     id: string;
//     title: string;
//     image: string;
//     price: number;
//     stock: number;
//   };
// };

// const AddToCartButton = ({ product }: Props) => {
//   const { cart, addToCart, updateQuantity } = useCartStore();
//   const item = cart.find((i) => i.id === product.id);
//   const { addItem } = useSmartCart();



//   const handleAdd = () => {
//     if (!item) {
//       addItem({
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         quantity: 1,
//         image: product.image
//       });
//     }
//   };

//   const increment = () => {
//     if (item && item.quantity < product.stock) {
//       updateQuantity(product.id, item.quantity + 1);
//     }
//   };

//   const decrement = () => {
//     if (item && item.quantity > 0) {
//       updateQuantity(product.id, item.quantity - 1);
//     }
//   };
//   if (product.stock===0) {
//     return( <Button
//        className="w-full mt-4 bg-gray-400  text-gray-600 font-semibold py-3 rounded-md transition-all "
      
//       disabled  >out of  Stock </Button> )
//   }


//   return (
//     <div className="flex justify-center items-center">

      

      
//       {
     
//       !item ? (
//         <Button
//           onClick={handleAdd}
//           className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all cursor-pointer"
//         >
//           <ShoppingCart className="mr-2" /> Add to Cart
//         </Button>
//       ) : (
//         <div className="flex items-center gap-2">
//           <Button
//             onClick={decrement}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             -
//           </Button>
//           <span className="px-2 text-lg font-semibold">{item.quantity}</span>
//           <Button
//             onClick={increment}
//             disabled={item.quantity >= product.stock}
//             className={`px-3 py-1 rounded ${
//               item.quantity >= product.stock
//                 ? "bg-gray-300 cursor-not-allowed"
//                 : "bg-green-500 hover:bg-green-600 text-white"
//             }`}
//           >
//             +
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddToCartButton;
// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { ShoppingCart } from "lucide-react";
// import { useSmartCart } from "@/hooks/useSmartCart";
// import { supabase } from "@/lib/supabaseClient"; // Supabase client import
// import { useLocalCartStore } from "@/hooks/useLocalCartStore"; // Local cart Zustand

// type Props = {
//   product: {
//     id: string;
//     title: string;
//     image: string;
//     price: number;
//     stock: number;
//   };
// };

// const AddToCartButton = ({ product }: Props) => {
//   const { cart, addToCart, updateQuantity } = useLocalCartStore();
//   const item = cart.find((i) => i.id === product.id);
//   const { addItem } = useSmartCart();

//   // اضافه کردن محصول به Supabase
//   const addToSupabase = async (productId: string, quantity: number) => {
//     const { data: { session } } = await supabase.auth.getSession();
//     const user = session?.user;

//     if (user) {
//       const { error } = await supabase
//         .from('Cart')
//         .upsert([
//           {
//             user_id: user.id,
//             book_id: productId,
//             quantity: quantity,
//           }
//         ]);

//       if (error) {
//         console.error("Error adding to cart in Supabase:", error.message);
//       }
//     }
//   };

//   // اضافه کردن به سبد خرید
//   const handleAdd = () => {
//     if (!item) {
//       addItem({
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         quantity: 1,
//         image: product.image,
//       });
//       // ذخیره کردن تغییرات در Supabase
//       addToSupabase(product.id, 1);
//     }
//   };

//   // افزایش تعداد
//   const increment = () => {
//     if (item && item.quantity < product.stock) {
//       updateQuantity(product.id, item.quantity + 1);
//       // به‌روزرسانی در Supabase
//       addToSupabase(product.id, item.quantity + 1);
//     }
//   };

//   // کاهش تعداد
//   const decrement = () => {
//     if (item && item.quantity > 0) {
//       updateQuantity(product.id, item.quantity - 1);
//       // به‌روزرسانی در Supabase
//       addToSupabase(product.id, item.quantity - 1);
//     }
//   };

//   if (product.stock === 0) {
//     return (
//       <Button className="w-full mt-4 bg-gray-400 text-gray-600 font-semibold py-3 rounded-md transition-all" disabled>
//         Out of Stock
//       </Button>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center">
//       {!item ? (
//         <Button
//           onClick={handleAdd}
//           className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all cursor-pointer"
//         >
//           <ShoppingCart className="mr-2" /> Add to Cart
//         </Button>
//       ) : (
//         <div className="flex items-center gap-2">
//           <Button
//             onClick={decrement}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             -
//           </Button>
//           <span className="px-2 text-lg font-semibold">{item.quantity}</span>
//           <Button
//             onClick={increment}
//             disabled={item.quantity >= product.stock}
//             className={`px-3 py-1 rounded ${item.quantity >= product.stock ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
//           >
//             +
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddToCartButton;
// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { ShoppingCart } from "lucide-react";
// import { useSmartCart } from "@/hooks/useSmartCart";
// import { supabase } from "@/lib/supabaseClient";
// import { useLocalCartStore } from "@/hooks/useLocalCartStore";

// type Props = {
//   product: {
//     id: string;
//     title: string;
//     image: string;
//     price: number;
//     stock: number;
//   };
// };

// const AddToCartButton = ({ product }: Props) => {
//   const [isClient, setIsClient] = useState(false);
//   const { items, addToLocalCart, updateQuantity } = useLocalCartStore();
//   const item = items.find((i) => i.id === product.id);  // استفاده از `items` به جای `cart`
//   const { addItem } = useSmartCart();

//   useEffect(() => {
//     setIsClient(true);  // برای اطمینان از اینکه کامپوننت فقط در حالت کلاینت رندر می‌شود
//   }, []);

//   // اضافه کردن محصول به Supabase
//   const addToSupabase = async (productId: string, quantity: number) => {
//     const { data: { session } } = await supabase.auth.getSession();
//     const user = session?.user;

//     if (user) {
//       const { error } = await supabase
//         .from('cart')
//         .upsert([
//           {
//             user_id: user.id,
//             book_id: productId,
//             quantity: quantity,
//           }
//         ]);

//       if (error) {
//         console.error("Error adding to cart in Supabase:", error.message);
//       }
//     }
//   };

//   // اضافه کردن به سبد خرید
//   const handleAdd = () => {
//     if (!item) {
//       addItem({
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         quantity: 1,
//         image: product.image,
//       });
//       // ذخیره کردن تغییرات در Supabase
//       addToSupabase(product.id, 1);
//     }
//   };

//   // افزایش تعداد
//   const increment = () => {
//     if (item && item.quantity < product.stock) {
//       updateQuantity(product.id, item.quantity + 1);
//       // به‌روزرسانی در Supabase
//       addToSupabase(product.id, item.quantity + 1);
//     }
//   };

//   // کاهش تعداد
//   const decrement = () => {
//     if (item && item.quantity > 0) {
//       updateQuantity(product.id, item.quantity - 1);
//       // به‌روزرسانی در Supabase
//       addToSupabase(product.id, item.quantity - 1);
//     }
//   };

//   if (!isClient) {
//     return null;  // از رندر شدن در سرور جلوگیری می‌کنیم
//   }

//   if (product.stock === 0) {
//     return (
//       <Button className="w-full mt-4 bg-gray-400 text-gray-600 font-semibold py-3 rounded-md transition-all" disabled>
//         Out of Stock
//       </Button>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center">
//       {!item ? (
//         <Button
//           onClick={handleAdd}
//           className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all cursor-pointer"
//         >
//           <ShoppingCart className="mr-2" /> Add to Cart
//         </Button>
//       ) : (
//         <div className="flex items-center gap-2">
//           <Button
//             onClick={decrement}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             -
//           </Button>
//           <span className="px-2 text-lg font-semibold">{item.quantity}</span>
//           <Button
//             onClick={increment}
//             disabled={item.quantity >= product.stock}
//             className={`px-3 py-1 rounded ${item.quantity >= product.stock ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
//           >
//             +
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddToCartButton;
"use client"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useSmartCart } from "@/hooks/useSmartCart";
import { supabase } from "@/lib/supabaseClient";
import { useLocalCartStore } from "@/hooks/useLocalCartStore";

type Props = {
  product: {
    id: string;
    title: string;
    image: string;
    price: number;
    stock: number;
  };
};

const AddToCartButton = ({ product }: Props) => {
  const [isClient, setIsClient] = useState(false);
  const { items, addToLocalCart, updateQuantity, clearLocalCart } = useLocalCartStore();
  const item = items.find((i) => i.id === product.id);  // استفاده از `items` به جای `cart`
  const { addItem } = useSmartCart();

  useEffect(() => {
    setIsClient(true);  // برای اطمینان از اینکه کامپوننت فقط در حالت کلاینت رندر می‌شود
  }, []);

  // اضافه کردن محصول به Supabase
  const addToSupabase = async (productId: string, quantity: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
  
    if (user) {
      // بررسی و به‌روزرسانی یا اضافه کردن رکورد جدید
      const { data, error } = await supabase
        .from('cart')
        .upsert([{
          user_id: user.id,
          book_id: productId,
          quantity: quantity,
        }], { onConflict: ['user_id', 'book_id'] }); // در صورت وجود conflict، مقدار quantity به‌روزرسانی شود
  
      if (error) {
        console.error("Error adding/updating to cart in Supabase:", error.message);
      }
    }
  };

  // اضافه کردن به سبد خرید
  const handleAdd = () => {
    if (!item) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      // ذخیره کردن تغییرات در Supabase
      addToSupabase(product.id, 1);
    }
  };

  // افزایش تعداد
  const increment = () => {
    if (item && item.quantity < product.stock) {
      updateQuantity(product.id, item.quantity + 1);
      // به‌روزرسانی در Supabase
      addToSupabase(product.id, item.quantity + 1);
    }
  };

  // کاهش تعداد
  const decrement = () => {
    if (item && item.quantity > 1) {
      updateQuantity(product.id, item.quantity - 1);
      // به‌روزرسانی در Supabase
      addToSupabase(product.id, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      // اگر تعداد به صفر برسد، محصول را از سبد خرید حذف کن
      clearLocalCart(); // یا remove از Zustand و Supabase
      removeFromSupabase(product.id);
    }
  };

  // حذف از Supabase
  const removeFromSupabase = async (productId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (user) {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id)
        .eq('book_id', productId);

      if (error) {
        console.error("Error removing from cart in Supabase:", error.message);
      }
    }
  };

  if (!isClient) {
    return null;  // از رندر شدن در سرور جلوگیری می‌کنیم
  }

  if (product.stock === 0) {
    return (
      <Button className="w-full mt-4 bg-gray-400 text-gray-600 font-semibold py-3 rounded-md transition-all" disabled>
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="flex justify-center items-center">
      {!item ? (
        <Button
          onClick={handleAdd}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all cursor-pointer"
        >
          <ShoppingCart className="mr-2" /> Add to Cart
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={decrement}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            -
          </Button>
          <span className="px-2 text-lg font-semibold">{item.quantity}</span>
          <Button
            onClick={increment}
            disabled={item.quantity >= product.stock}
            className={`px-3 py-1 rounded ${item.quantity >= product.stock ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
          >
            +
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
