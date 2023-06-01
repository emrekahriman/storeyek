import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Image from "next/image";
import axios from "axios";
import Loader from "@/components/Loader";

function about({ page }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (page) {
      setLoading(false);
    } else {
      setError("Something went wrong!");
      setLoading(false);
    }
  }, [page]);

  return (
    <>
      <Head>
        <title>About - StoreYEK</title>
      </Head>

      <Header />
      {loading ? (
        <Loader />
      ) : (
        <main className="min-h-full-nav bg-white">
          <div className="isolate py-20 px-6 lg:px-8">
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
            <div className="mx-auto max-w-3xl">
              {error ? (
                <h1 className="mt-20 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-2xl font-medium tracking-wide text-transparent">
                  {error}
                </h1>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-between gap-4">
                    <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                      {page.title}
                    </h2>
                    <Image
                      src={page.image}
                      alt={page.slug}
                      className="mb-10 object-contain"
                      width={400}
                      height={197}
                    />

                    <p className="mt-2 text-justify text-lg leading-8 text-gray-600">
                      {page.content}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default about;

export const getServerSideProps = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/page/about`
  );

  return {
    props: {
      page: data.page || null,
    },
  };
};
