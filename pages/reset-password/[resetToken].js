import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import AppleLogo from "@/public/assets/images/apple-logo.png";

export default function resetPassword() {
  const router = useRouter();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const submitBtnRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Resetting your password...");
    submitBtnRef.current.disabled = true;

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        id: toastId,
      });
      submitBtnRef.current.disabled = false;
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          token: router.query.resetToken,
          password,
        }
      );

      if (data.status === "success") {
        toast.success(data.message, {
          id: toastId,
          duration: 2500,
        });

        const toastId2 = toast.loading("Redirecting to login page...");

        setTimeout(() => {
          toast.dismiss(toastId2);
          router.push("/login");
        }, 3000);
      } else {
        toast.error(data.message, {
          id: toastId,
        });
        submitBtnRef.current.disabled = false;
      }
    } catch (error) {
      toast.error("Something went wrong", {
        id: toastId,
      });
      submitBtnRef.current.disabled = false;
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <main className="min-h-dscreen bg-white">
        <div className="isolate  py-20 px-6 lg:px-8">
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
          <div className="mx-auto mt-10 max-w-7xl">
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-md space-y-8">
                <div>
                  <Image
                    className="mx-auto h-12 w-auto"
                    src={AppleLogo}
                    alt="Your Company"
                  />
                  <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Reset your password
                  </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="-space-y-px rounded-md shadow-sm">
                    <div>
                      <label htmlFor="password" className="sr-only">
                        New Password
                      </label>
                      <input
                        ref={passwordRef}
                        id="password"
                        name="password"
                        type="password"
                        minLength={6}
                        required
                        className="relative block w-full rounded-t-md rounded-b-none border-2 border-gray-300 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                        placeholder="New Password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="sr-only">
                        Confirm Password
                      </label>
                      <input
                        ref={confirmPasswordRef}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        minLength={6}
                        required
                        className="relative block w-full rounded-t-none rounded-b-md border-2 border-gray-300 px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      ref={submitBtnRef}
                      type="submit"
                      className="group relative flex w-full justify-center rounded-md bg-purple-600 py-2 px-3 text-sm font-semibold text-white hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="group-disabled:hidden">
                        Reset Password
                      </div>
                      <div
                        role="status"
                        className="hidden group-disabled:block"
                      >
                        <svg
                          aria-hidden="true"
                          className="mr-2 h-6 w-6 animate-spin fill-white text-purple-800"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { resetToken } = context.query;

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/check-reset-token`,
    { resetToken }
  );

  if (data.status === "error") return { notFound: true };

  return {
    props: {},
  };
}
