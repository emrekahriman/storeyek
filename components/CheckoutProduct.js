import {
  ChevronDownIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import React from "react";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { removeFromBasket } from "@/redux/basket";
import Link from "next/link";

function CheckoutProduct({ item }) {
  const dispatch = useDispatch();
  const removeItemFromBasket = () => {
    dispatch(removeFromBasket(item.product));
  };

  return (
    <div className="flex flex-col gap-x-4 border-b border-gray-300 pb-5 lg:flex-row lg:items-center">
      <div className="relative h-44 w-44">
        <Image
          src={item.product.images[0]}
          className="object-contain"
          fill="fill"
          sizes="100%"
          alt="Product image"
        />
      </div>
      <div className="flex flex-1 items-end lg:items-center">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-x-8 text-xl lg:flex-row lg:text-2xl">
            <h4 className="font-semibold lg:w-96">{item.product.name}</h4>
            <p className="flex items-end gap-x-1 font-semibold">
              {item.quantity}
              <ChevronDownIcon className="h-6 w-6 text-blue-500" />
            </p>
          </div>

          <Link
            href={`/products/${item.product.slug}/detail`}
            className="flex cursor-pointer items-center text-blue-500 hover:underline"
          >
            Show product details
            <InformationCircleIcon className="ml-1 h-5 w-5" />
          </Link>
        </div>

        <div className="flex flex-col items-end space-y-4">
          <h4 className="text-xl font-semibold lg:text-2xl">
            <NumericFormat
              value={item.product.price * item.quantity}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
              decimalScale={2}
            />
          </h4>
          <button
            onClick={removeItemFromBasket}
            className="text-blue-500 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutProduct;
