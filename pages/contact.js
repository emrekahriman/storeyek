import React, { useRef } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Button from "../components/Button";
import axios from "axios";
import { toast } from "react-hot-toast";

function contact() {
  const submitBtnRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fullName = e.target.fullName.value;
      const subject = e.target.subject.value;
      const email = e.target.email.value;
      const message = e.target.message.value;

      if (fullName === "" || subject === "" || email === "" || message === "") {
        return toast.error("Please fill all the fields");
      }

      submitBtnRef.current.disabled = true;
      const toastId = toast.loading("Sending message...");

      const payload = {
        fullName,
        subject,
        email,
        message,
      };

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/page/contact`,
        payload
      );
      if (data.status === "success") {
        toast.success("Message sent successfully", {
          id: toastId,
        });
        e.target.reset();
      } else {
        toast.error(data.error, {
          id: toastId,
        });
      }
      submitBtnRef.current.disabled = false;
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong while sending message");
      submitBtnRef.current.disabled = false;
    }
  };

  return (
    <>
      <Head>
        <title>Contact - StoreYEK</title>
      </Head>

      <Header />

      <main>
        <div className="isolate bg-white py-20 px-6 lg:px-8">
          <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
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
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Contact us
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We're here to help. Send us a message and we'll respond as soon as
              we can.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl">
            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Full name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    className="block w-full rounded-md border-2 border-gray-300 py-2 px-3.5 text-gray-900 shadow-sm placeholder:text-gray-400  focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Subject
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    className="block w-full rounded-md border-2 border-gray-300 py-2 px-3.5 text-gray-900 shadow-sm placeholder:text-gray-400  focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-md border-2 border-gray-300 py-2 px-3.5 text-gray-900 shadow-sm placeholder:text-gray-400  focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full rounded-md border-2 border-gray-300 py-2 px-3.5 text-gray-900 shadow-sm placeholder:text-gray-400  focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Button
                refYek={submitBtnRef}
                type="submit"
                title="Let's talk"
                width="w-full"
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default contact;
