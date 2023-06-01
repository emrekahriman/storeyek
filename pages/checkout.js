import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { selectBasketItems, selectBasketTotal } from "@/redux/basket";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Button from "@/components/Button";
import CheckoutProduct from "@/components/CheckoutProduct";
import { NumericFormat } from "react-number-format";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

function checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const checkoutButtonRef = useRef(null);

  // const basketItems = useSelector(selectBasketItems);
  const basketTotal = useSelector(selectBasketTotal);

  // get basket with async thunk
  const {
    items: basketItems,
    loading: basketLoading,
    error: basketError,
  } = useSelector((state) => state.basket);

  useEffect(() => {
    if (status === "loading" || basketLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status, basketLoading]);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
    } else {
      // Check if basket is empty
      if (basketItems.length === 0) {
        toast.error("Your basket is empty");
        return;
      }

      // Check if user has address
      if (!session.user.address) {
        toast.error("Please add your address");
        router.push("/profile");
        return;
      }

      // Disable checkout button
      checkoutButtonRef.current.disabled = true;

      // if any item is out of stock
      let outOfStock = false;
      basketItems.forEach((item) => {
        if (item.product.countsInStock < item.quantity) {
          toast.error(
            `Sorry, ${item.product.name} has only ${item.product.countsInStock} items in stock`
          );
          checkoutButtonRef.current.disabled = false;
          outOfStock = true;
          return;
        }
      });

      if (outOfStock) return;

      // Create checkout session
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/create-checkout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.user.tokenYek}`,
          },
        }
      );

      if (data.status === "success") {
        router.push(data.url);
      } else {
        toast.error(data.error ?? data.message);
      }
    }
  };

  return (
    <div className="min-h-dscreen overflow-hidden bg-[#E7ECEE]">
      <Head>
        <title>Bag - StoreYEK</title>
      </Head>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <main className="mx-auto max-w-5xl pb-24">
          <div className="px-5">
            <h1 className="my-4 text-3xl font-semibold md:text-4xl">
              {basketItems.length > 0 ? "Review your bag" : "Your bag is empty"}
            </h1>
            <p className="my-4">
              {basketItems.length > 0
                ? "Review your items and proceed to checkout"
                : "Please add some items to your bag"}
            </p>

            {basketItems.length === 0 && (
              <Button
                title={"Continue shopping"}
                onClick={() => router.push("/")}
              />
            )}
          </div>

          {basketItems.length > 0 && (
            <div className="mx-5 md:mx-8">
              {basketItems.map((item) => (
                <CheckoutProduct key={item.product._id} item={item} />
              ))}

              <div className="my-12 mt-6 ml-auto max-w-3xl">
                <div className="divide-y divide-gray-300">
                  <div className="pb-4">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>
                        <NumericFormat
                          value={basketTotal}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                          decimalScale={2}
                        />
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Shipping</p>
                      <p>FREE</p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 text-xl font-semibold">
                    <h4>Total</h4>
                    <h4>
                      <NumericFormat
                        value={basketTotal}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                        decimalScale={2}
                      />
                    </h4>
                  </div>
                </div>

                <div className="my-14 space-y-4">
                  <h4 className="text-xl font-semibold">
                    How would you like to check out?
                  </h4>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex flex-1 flex-col items-center space-y-8 rounded-xl bg-gray-200 p-8 py-12 md:order-2">
                      <h4 className="mb-4 flex flex-col text-xl font-semibold">
                        Pay in full
                        <span>
                          <NumericFormat
                            value={basketTotal}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                            decimalScale={2}
                          />
                        </span>
                      </h4>

                      <Button
                        refYek={checkoutButtonRef}
                        onClick={handleCheckout}
                        noIcon
                        // loading={loading}
                        title="Check Out"
                        width="w-full"
                        // onClick={createCheckoutSession}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default checkout;
