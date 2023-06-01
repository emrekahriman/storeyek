import React, { useState } from "react";
import Header from "@/components/Header";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

const ProfileLayout = ({ children }) => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Signed out successfully");
  };

  return (
    <>
      <Header />
      {status === "loading" ? (
        <Loader />
      ) : (
        <>
          <aside
            className={`fixed top-14 left-0 z-30 h-screen w-56 -translate-x-full transition-transform md:top-16 lg:w-72 ${
              sidebarOpen ? "translate-x-0" : ""
            } md:translate-x-0`}
            aria-label="Sidebar"
          >
            <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4">
              {/* button to close sidebar on mobile */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-drawer-target="default-sidebar"
                data-drawer-toggle="default-sidebar"
                aria-controls="default-sidebar"
                type="button"
                className="absolute top-5 -right-9 -z-10 mt-2 ml-3 inline-flex items-center rounded-r-lg bg-gray-50 p-2 text-sm text-gray-500 shadow-lg focus:outline-none md:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="h-6 w-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>

              <ul className="mt-4 space-y-2 font-medium">
                <li>
                  <Link
                    href="/profile"
                    className={`flex items-center rounded-lg p-2 text-gray-900 transition-all duration-300 ${
                      router.pathname === "/profile"
                        ? "bg-gray-200/60 hover:drop-shadow-lg"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75  group-hover:text-gray-900 "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Your Profile
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile/orders"
                    className={`flex items-center rounded-lg p-2 text-gray-900 transition-all duration-300 ${
                      router.pathname.startsWith("/profile/orders")
                        ? "bg-gray-200/60 hover:drop-shadow-md"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Orders
                    </span>
                    {/* <span className="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-purple-200 p-3 text-sm font-medium text-purple-800">
                      7
                    </span> */}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/profile/update-password"
                    className={`flex items-center rounded-lg p-2 text-gray-900 transition-all duration-300 ${
                      router.pathname.startsWith("/profile/update-password")
                        ? "bg-gray-200/60 hover:drop-shadow-md"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      data-name="Layer 1"
                      viewBox="0 0 122.88 117.85"
                    >
                      <path
                        className="cls-1"
                        d="M108,96.63l12.88,13.06v6.14h-6.09v-4.62h-5.06v-5h-4.83l-1.4-4.55A14.08,14.08,0,0,1,95.63,104a13.32,13.32,0,1,1,13.8-13.31,12.87,12.87,0,0,1-1.47,6ZM95,62.12a27.85,27.85,0,0,1,26.22,37.27l-4.55-4.61a22.2,22.2,0,0,0-39-18.63l-.1.13,0,0,0,0-.24.31h0l-.12.17-.14.19-.13.18-.13.19-.1.14,0,.05-.13.19-.12.19v0l-.11.17-.12.2,0,.08-.07.11-.12.2-.09.15,0,0-.12.2-.11.2v0l-.09.18-.11.2,0,.1-.06.11-.1.2-.08.17,0,0-.1.21-.09.2,0,0L74.7,81l-.09.22,0,.1,0,.11-.09.21-.07.18v0l-.09.21-.08.22v0l-.07.18-.07.22,0,.11L74,83l-.11.34,0,.07v0l-.07.22-.06.23,0,0,0,.17-.06.23,0,.12,0,.1-.1.4V85h0l-.1.45v.06l0,.17,0,.23,0,.14,0,.1-.06.38v.09l0,.23,0,.24v.06l0,.18,0,.23v.24l0,.42v0h0l0,.24,0,.24v.13l0,.36v1.3h0v.67l0,.42v.06h0l0,.54v0l0,.28,0,.25v0l.07.46v.1l0,.27,0,.24v0l.1.48v.07l.06.27,0,.22v.06l.07.27,0,.21v.06l.08.26.07.27.08.26v.05l.07.22.08.26.07.19,0,.07.09.26.07.18,0,.08.09.25.1.26.11.25.07.17,0,.08.11.26.11.24.12.25.07.15,0,.1.12.24h0c.2.4.42.79.64,1.18l.14.24.14.23.14.23.15.22.15.23.07.11.08.11h0c.41.59.84,1.16,1.3,1.71l.18.21.17.2h0c.23.27.48.52.72.78l.19.19.06.07.13.12A22.14,22.14,0,0,0,95,112.18a22.78,22.78,0,0,0,4.7-.5,7.64,7.64,0,0,0,2.73,1.63,7.44,7.44,0,0,0,1.69,3,27.82,27.82,0,0,1-28.82-6.63l-.33-.35a27.29,27.29,0,0,1-2.89-3.53H0C0,74,28.69,85.5,40.31,69.53c1.34-2,1-1.82-.52-3.42a18.41,18.41,0,0,1-1.61-1.93c-3.1-4.25-5.88-9.06-8.68-13.53-2-3-3.09-5.65-3.09-7.78s1.21-4.93,3.62-5.53a120.24,120.24,0,0,1-.21-14,19.64,19.64,0,0,1,.64-3.51,20.3,20.3,0,0,1,9-11.51A23.11,23.11,0,0,1,44.41,6c3.09-1.17,1.6-5.86,5-6,8-.21,21.09,6.61,26.2,12.15a20.15,20.15,0,0,1,5.22,13.1l-.32,12.62a3.94,3.94,0,0,1,2.88,2.87c.42,1.71,0,4-1.49,7.35h0c0,.11-.11.11-.11.22C78.51,53.73,75.1,60,71.32,65c-1.9,2.53-3.46,2.08-1.84,4.51a19.81,19.81,0,0,0,3.37,3.57,26.52,26.52,0,0,1,2.47-2.82l.35-.32A27.72,27.72,0,0,1,95,62.12ZM93.64,86.39a2.46,2.46,0,1,1-2.46,2.46,2.47,2.47,0,0,1,2.46-2.46Z"
                      />
                    </svg>

                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Update Password
                    </span>
                  </Link>
                </li>
                <li>
                  <a
                    onClick={handleSignOut}
                    className="flex cursor-pointer items-center rounded-lg p-2 text-red-600 hover:bg-gray-100"
                  >
                    <svg
                      aria-hidden="true"
                      className="duration-7 h-6 w-6 flex-shrink-0 text-red-600 transition group-hover:text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Sign Out
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          <div className="md:ml-56 lg:ml-72">
            <main className="min-h-full-nav bg-white">
              <div className="isolate py-10 px-4 lg:px-8">
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
                <div className="mx-auto max-w-4xl">{children}</div>
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(ProfileLayout), { ssr: false });
