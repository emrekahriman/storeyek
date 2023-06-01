import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { NumericFormat } from "react-number-format";
import { addToBasket } from "@/redux/basket";

function Product({ product }) {
  const dispatch = useDispatch();

  const addItemToBasket = () => {
    dispatch(addToBasket({product}));
  };

  return (
    <div className="flex h-fit w-[320px] select-none flex-col space-y-3 rounded-xl bg-[#35383C] p-8 md:h-[500px] md:w-[400px] md:p-10">
      <div className="relative h-64 w-full md:h-72">
        <Image
          src={product.images[0]}
          className="h-full w-full object-contain"
          width={300}
          height={300}
          alt={`${product.name} image`}
        />
      </div>

      <div className="flex flex-1 items-center justify-between space-x-3">
        <div className="space-y-2 text-xl text-white md:text-2xl">
          <Link href={`/products/${product.slug}/detail`}>
            <p>{product.name}</p>
          </Link>
          <p>
            <NumericFormat
              value={product.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
              decimalScale={2}
            />
          </p>
        </div>

        <div
          className="flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-150 hover:brightness-90 md:h-[70px] md:w-[70px]"
          onClick={addItemToBasket}
        >
          <ShoppingCartIcon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
}

export default Product;
