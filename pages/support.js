import React, { use, useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import axios from "axios";
import Loader from "../components/Loader";

function support({ faqs, error }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="min-h-dscreen overflow-hidden bg-[#E7ECEE]">
      <Head>
        <title>Support - StoreYEK</title>
      </Head>
      <Header />
      <main className="min-h-full-nav bg-white">
        <div
          className={`isolate ${loading || error ? "" : "py-20"} px-6 lg:px-8`}
        >
          <div className="absolute inset-x-0 top-[-6rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
            <svg
              className="relative left-1/2 -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-40rem)] sm:h-[42.375rem]"
              viewBox="0 0 1155 678"
            >
              <path
                fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
              />
              <defs>
                <linearGradient
                  id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                  x1="1155.49"
                  x2="-78.208"
                  y1=".177"
                  y2="474.645"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9089FC" />
                  <stop offset={1} stopColor="#FF80B5" />
                </linearGradient>
              </defs>
            </svg>
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
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  FAQ's
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                  Can't find the answer you're looking for?
                </p>
              </div>
              <div className="mx-auto mt-10 max-w-xl">
                {faqs.map((faq) => (
                  <Disclosure as="div" className="mb-6" key={faq._id}>
                    {({ open }) => (
                      <div
                        className={
                          open
                            ? "shadow-lg shadow-black/5 transition-all duration-500"
                            : ""
                        }
                      >
                        <Disclosure.Button
                          className={`flex w-full justify-between rounded-lg bg-gradient-to-r from-white to-purple-50 px-4 py-5 text-left text-sm font-medium text-gray-700 ${
                            open ? "rounded-b-none" : ""
                          } shadow-sm focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                        >
                          <span>{faq.question}</span>
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
                          <Disclosure.Panel className="bg-white px-4 py-3 text-sm text-gray-500">
                            {faq.answer}
                          </Disclosure.Panel>
                        </Transition>
                      </div>
                    )}
                  </Disclosure>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default support;

export const getServerSideProps = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/page/faq`
    );

    return {
      props: {
        faqs: data.faqs || null,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        faqs: null,
        error: "Something went wrong while fetching FAQ's",
      },
    };
  }
};
