import React from "react";
import { useSelector } from "react-redux";
import { selectBasketItems } from "@/redux/basket";
import { ShoppingBagIcon } from "@heroicons/react/outline";
import Link from "next/link";

function Basket() {
  const basketItems = useSelector(selectBasketItems);

  if (basketItems.length === 0) return null;
  return (
    <Link href="/checkout">
      <div className="fixed bottom-10 right-10 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-300 transition-all duration-150 hover:bg-gray-200 shadow-md">
        {basketItems.length > 0 && (
          <span className="absolute -right-2 -top-2 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-[10px] text-white">
            {basketItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
        <ShoppingBagIcon className="headerIcon h-8 w-8" />
      </div>
    </Link>
  );
}

export default Basket;
