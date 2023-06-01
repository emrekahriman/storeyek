import { useState, useEffect } from "react";
import ProfileLayout from "@/layouts/ProfileLayout";
import { getSession } from "next-auth/react";
import axios from "axios";
import Loader from "@/components/Loader";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

const Orders = ({ orders, error }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <ProfileLayout>
      <div className="w-full text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Your Orders
        </h2>
        <p className="mt-2 text-sm leading-8 text-gray-600 sm:text-lg">
          You currently have a total of{" "}
          <span className="font-bold">{orders.length}</span> orders
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-3xl font-bold text-gray-700">
            {error}
          </h1>
        </div>
      ) : (
        <>
          <div className="mt-10 w-full">
            {orders.length === 0 ? (
              <div className="mt-20 flex flex-col items-center justify-center rounded-md bg-yellow-100 px-4 py-2 text-yellow-700">
                <h1 className="text-center font-bold sm:text-xl">
                  You have no orders yet
                </h1>
              </div>
            ) : (
              orders.map((order) => (
                <Disclosure as="div" className="mb-8" key={order._id}>
                  {({ open }) => (
                    <div
                      className={
                        open
                          ? "shadow-lg shadow-black/5 transition-all duration-500"
                          : ""
                      }
                    >
                      <Disclosure.Button
                        className={`flex w-full justify-between rounded-lg bg-gradient-to-r from-white to-purple-100 px-4 py-5 text-left text-sm font-medium text-gray-700 ${
                          open ? "rounded-b-none" : ""
                        } shadow-sm focus:outline-none`}
                      >
                        <div className="grid grid-cols-2 gap-x-3 gap-y-4 pr-2 sm:auto-cols-auto sm:grid-flow-col sm:gap-x-14 md:gap-x-8 lg:gap-x-14">
                          <div className="col-span-1">
                            <span className="text-gray-500">Order ID</span>
                            <span className="block text-gray-900">
                              {/*  show id last 8 characters then if clicked copy all the id */}
                              <span
                                className="group relative cursor-pointer bg-gradient-to-r from-gray-900 bg-clip-text text-transparent transition-colors duration-200 hover:text-purple-500"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigator.clipboard.writeText(order._id);
                                  toast.success("Order ID copied to clipboard");
                                }}
                              >
                                {order._id.substring(order._id.length - 12)}..
                                <span className="pointer-events-none absolute -top-7 left-0 w-max rounded-md bg-black py-0.5 px-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                                  Click to copy
                                </span>
                              </span>
                            </span>
                          </div>
                          <div className="col-span-1 lg:text-center">
                            <span className="text-gray-500">Order Date</span>
                            <span className="block text-gray-900">
                              {dayjs(order.createdAt).format("MMM D, YYYY")}
                            </span>
                          </div>
                          <div className="col-span-1">
                            <span className="text-gray-500">Total</span>
                            <span className="block text-gray-900">
                              ${order.total}
                            </span>
                          </div>
                          <div className="col-span-1">
                            <span className="text-gray-500">
                              Delivery Status
                            </span>
                            <span className="block text-gray-900">
                              {order.deliveryStatus}
                            </span>
                          </div>
                        </div>
                        <ChevronDownIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-purple-500 transition-transform duration-200`}
                        />
                      </Disclosure.Button>
                      <Transition
                        className={
                          "overflow-hidden rounded-b-lg shadow-sm transition-all duration-200"
                        }
                        show={open}
                        enter="transition ease-in-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in-out duration-200"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Disclosure.Panel className="flex flex-col gap-y-4 bg-white px-4 py-3 text-sm text-gray-500">
                          {/* Item */}
                          {order.items.map((item) => (
                            <div
                              className="flex border-b border-purple-200 pb-4 last:border-none last:pb-0"
                              key={item._id}
                            >
                              <div className="grid h-24 w-24 place-items-center rounded-md bg-purple-100/75 p-1.5">
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  width={70}
                                  height={70}
                                  className="object-contain"
                                />
                              </div>
                              <div className="ml-4 flex flex-grow flex-wrap justify-between gap-y-3 sm:flex-row sm:flex-nowrap sm:place-items-center">
                                <div className="w-full sm:flex-1">
                                  <span className="text-gray-500">Product</span>
                                  <span className="block text-gray-900">
                                    {item.product.name}
                                  </span>
                                </div>
                                <div className="flex-1 sm:flex-nowrap">
                                  <span className="text-gray-500">
                                    Quantity
                                  </span>
                                  <span className="block text-gray-900">
                                    {item.quantity}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-gray-500">Price</span>
                                  <span className="block text-gray-900">
                                    ${item.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>
              ))
            )}
          </div>
        </>
      )}
    </ProfileLayout>
  );
};

export default Orders;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { tokenYek } = session.user;

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/orders`,
    {
      headers: {
        Authorization: `Bearer ${tokenYek}`,
      },
    }
  );

  return {
    props: {
      orders: data.orders || [],
      error: data.error || null,
    },
  };
}
