import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import Image from "next/image";
import Link from "next/link";
import Loader from "../../components/Loader";

function index({ search }) {
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.products);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  const [selectedCategory, setSelectedCategory] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const filterProducts = (search, selectedCategory) => {
    if (search || selectedCategory) {
      const filteredProducts = products.filter((product) => {
        if (selectedCategory && selectedCategory != "0") {
          return (
            product.name.toLowerCase().includes(search.toLowerCase()) &&
            product.category
              .toLowerCase()
              .includes(selectedCategory.toLowerCase())
          );
        } else {
          return product.name.toLowerCase().includes(search.toLowerCase());
        }
      });
      setFilteredProducts(filteredProducts);
    } else {
      setFilteredProducts(products);
    }
  };

  useEffect(() => {
    if (productsLoading === false) {
      filterProducts(search, selectedCategory);
      setIsPageLoading(false);
    }
  }, [search, productsLoading, categoriesLoading, selectedCategory]);

  return (
    <>
      <Head>
        <title>Products - StoreYEK</title>
      </Head>

      <Header />

      <main className="min-h-full-nav">
        <div className={`isolate px-6 lg:px-8`}>
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

          {isPageLoading || productsLoading ? (
            <Loader />
          ) : productsError ? (
            <div className="grid h-full-nav place-items-center">
              <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-2xl font-medium tracking-wide text-transparent md:text-3xl">
                {productsError}
              </h1>
            </div>
          ) : (
            <>
              <div className="mx-auto mt-20 max-w-3xl text-center">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  All Products
                </h2>
              </div>
              <div className="mx-auto mb-20 mt-10 max-w-7xl">
                {/* Product List Content */}
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                      Total {filteredProducts.length} Products
                    </h2>
                    <div className="">
                      <select
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                        }}
                        className="block w-full rounded-lg border border-purple-200 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                      >
                        <option value={"0"}>All Categories</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          className="group relative rounded-lg bg-white p-3 shadow-md"
                        >
                          <div className="aspect-w-1 aspect-h-1 lg:aspect-none relative min-h-[22rem] w-full overflow-hidden rounded-md bg-purple-50 group-hover:opacity-75 lg:h-80">
                            <Image
                              fill
                              sizes="100%"
                              priority
                              src={product.images[0]}
                              alt={`${product.name} image`}
                              className="h-full w-full object-contain object-center transition duration-300 ease-in-out group-hover:scale-105 lg:h-full lg:w-full"
                            />
                          </div>
                          <div className="mt-4 flex justify-between">
                            <div>
                              <h3 className="text-sm text-gray-700">
                                <Link href={`/products/${product.slug}/detail`}>
                                  <span
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                  />
                                  {product.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500"></p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              <NumericFormat
                                value={product.price}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                              />
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="col-span-1 mb-4 rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800 sm:col-span-2 md:col-span-3 lg:col-span-4"
                        role="alert"
                      >
                        <span className="font-medium">
                          No products found with keyword{" "}
                          {search && (
                            <span className="font-semibold">"{search}"</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default index;

export async function getServerSideProps(context) {
  const { search } = context.query;
  return {
    props: {
      search: search || "",
    },
  };
}
