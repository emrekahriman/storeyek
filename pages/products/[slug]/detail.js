import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import React, { useState } from "react";
import Head from "next/head";
import Header from "../../../components/Header";
import Image from "next/image";
import axios from "axios";
import dayjs from "dayjs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { addToBasket } from "@/redux/basket";

function detail({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const title = `${product.name} - StoreYEK`;

  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState(product.comments);

  const handleAddToCart = async () => {
    dispatch(addToBasket({ product, quantity }));
  };

  const createComment = async (e) => {
    e.preventDefault();

    if (status !== "loading" && !session) {
      router.push("/login");
      throw new Error("You must be logged in to comment");
    }

    // Get the area of the name="comment" textarea
    const comment = e.target.elements.comment.value;
    const submitBtn = e.target.elements.submit;

    // Disable the submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Loading...";

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/create-comment`,
      {
        comment,
        productId: product._id,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user.tokenYek}`,
        },
      }
    );
    submitBtn.disabled = false;
    submitBtn.innerHTML = "Comment";

    const data = res.data;
    if (data.status === "success") {
      setComments(comments => [data.comment, ...comments]);
      e.target.reset();
    } else {
      throw new Error("Error while sending comment");
    }
  };

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <main className="min-h-full-nav bg-white">
        <div className="isolate py-10 px-6 lg:px-8">
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
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-16 lg:flex-row lg:items-center">
              <div className="flex flex-col gap-6 lg:w-2/4">
                {/* Carousel */}
                <Swiper
                  className="w-full"
                  grabCursor
                  loop
                  style={{
                    "--swiper-navigation-color": "#ddd",
                    "--swiper-pagination-color": "#ddd",
                  }}
                  navigation={true}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  onSwiper={setThumbsSwiper}
                >
                  {product.images.map((image, i) => (
                    <SwiperSlide key={i}>
                      <div className="relative h-60 w-full sm:h-80 md:h-[25rem]">
                        <Image
                          className="h-full w-full object-contain"
                          fill
                          sizes="100%"
                          priority={i === 0}
                          src={image}
                          alt="product images"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="flex h-16 flex-row justify-between bg-gradient-to-r from-white via-slate-200 to-white sm:h-24">
                  {/* Thumbs */}
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={5}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="w-full"
                    slidesPerView={2}
                    freeMode={true}
                    navigation={true}
                    style={{
                      "--swiper-navigation-color": "#ddd",
                      "--swiper-pagination-color": "#ddd",
                    }}
                    breakpoints={{
                      500: {
                        slidesPerView: 3,
                      },
                      768: {
                        slidesPerView: 4,
                      },
                    }}
                  >
                    {product.images.map((image, i) => (
                      <SwiperSlide key={i}>
                        <div className="relative h-full cursor-pointer">
                          <Image
                            className="h-full w-full object-contain"
                            fill
                            sizes="100%"
                            priority
                            src={image}
                            alt="product images"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
              {/* ABOUT */}
              <div className="flex flex-col gap-4 lg:w-2/4">
                <div>
                  <span className=" font-semibold text-violet-600">
                    {product.category.name}
                  </span>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                </div>
                <p className="text-gray-700">{product.description}</p>
                <h6 className="text-2xl font-semibold">$ {product.price}</h6>
                <div className="flex flex-col gap-12 sm:flex-row sm:items-center">
                  <div className="flex flex-row items-center">
                    <button
                      disabled={quantity === 1}
                      className="rounded-lg bg-gray-200 py-2 px-5 text-3xl text-violet-800 disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-40"
                      onClick={() =>
                        setQuantity((prev) => prev > 1 && prev - 1)
                      }
                    >
                      -
                    </button>
                    <span className="rounded-lg py-4 px-6">{quantity}</span>
                    <button
                      disabled={quantity === product.countsInStock}
                      className="rounded-lg bg-gray-200 py-2 px-5 text-3xl text-violet-800 disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-40"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart()}
                    disabled={quantity === 0}
                    className="h-full max-w-sm rounded-xl bg-violet-800 py-3 px-16 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h1 className="text-3xl font-bold">
                Comments ({comments.length})
              </h1>
              {/* Create comment section */}
              <div className="mt-8 flex flex-col gap-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (e.target.elements.comment.value === "") {
                      return toast.error("Comment cannot be empty");
                    }
                    toast.promise(createComment(e), {
                      loading: "Loading...",
                      success: "Comment successfully sent!",
                      error: (err) => err.message,
                    });
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <textarea
                      className="h-32 w-full rounded-lg bg-gray-100 p-4"
                      placeholder="Write your comment here..."
                      name="comment"
                    ></textarea>
                    <button
                      name="submit"
                      className="h-full max-w-xs self-end rounded-xl bg-violet-800 py-3 px-16 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Comment
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-8 flex flex-col gap-8">
                {comments.length === 0 && (
                  <div className="w-full rounded-md bg-red-100 py-3 text-center text-red-900">
                    No comments yet
                  </div>
                )}

                {comments.map((comment, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200">
                        <Image
                          className="rounded-full object-cover object-top"
                          width={48}
                          height={48}
                          src={comment.user.profilePic}
                          alt="user profile pic"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h6 className="text-lg font-semibold">
                          {comment.user.fullName}
                        </h6>
                        <p className="text-gray-700">
                          {dayjs(comment.date).format("MMM D, YYYY")}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default detail;

// get product from redux toolkit with ssr
export const getServerSideProps = async (context) => {
  const { slug } = context.query;
  let { data: response } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`
  );
  if (response.status !== "success" || response.product === null) {
    return {
      notFound: true,
    };
  }
  const product = response.product;
  return {
    props: {
      product,
    },
  };
};
