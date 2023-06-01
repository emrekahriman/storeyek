import React, { useState, useRef } from "react";
import Logo from "@/public/assets/images/apple-logo.png";
import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { selectBasketItems } from "@/redux/basket";
import { useRouter } from "next/router";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isLoaded = status !== "loading";

  const basketItems = useSelector(selectBasketItems);
  const [menuOpen, setMenuOpen] = useState(false);
  let [isSearchOpen, setIsSearchOpen] = useState(false);
  let searchInputRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.searchInput.value;
    if (searchInput) {
      router.push({
        pathname: "/products",
        query: { search: searchInput },
      });
      setIsSearchOpen(false);
    } else {
      toast.error("Search field cannot be empty");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-[#E7ECEE] p-4 shadow-lg">
      <div className="flex items-center justify-center md:w-1/5 ">
        <Link href="/">
          <div className="relative w-5 cursor-pointer opacity-75 transition duration-150 hover:opacity-100">
            <Image src={Logo} alt="Site Logo" />
          </div>
        </Link>
      </div>

      {isLoaded && (
        <>
          <div
            className={`${
              menuOpen ? "top-14 shadow-lg" : "-top-[350%]"
            } absolute left-0 right-0 -z-30 flex flex-col items-center justify-center gap-y-2 bg-[#E7ECEE] pt-2  pb-5 transition-all duration-700 ease-in-out md:relative md:top-auto md:flex md:flex-1 md:flex-row md:space-x-8 md:pb-0 md:shadow-none`}
          >
            <Link
              href={`/`}
              className={`${
                router.pathname === "/"
                  ? "font-medium text-black opacity-100"
                  : ""
              } headerLink`}
            >
              Home
            </Link>
            <Link
              href={`/products`}
              className={`${
                router.pathname.startsWith("/products")
                  ? "font-medium text-black opacity-100"
                  : ""
              } headerLink`}
            >
              Products
            </Link>
            <Link
              href={`/about`}
              className={`${
                router.pathname === "/about"
                  ? "font-medium text-black opacity-100"
                  : ""
              } headerLink`}
            >
              About
            </Link>
            <Link
              href={`/support`}
              className={`${
                router.pathname === "/support"
                  ? "font-medium text-black opacity-100"
                  : ""
              } headerLink`}
            >
              Support
            </Link>
            <Link
              href={`/contact`}
              className={`${
                router.pathname === "/contact"
                  ? "font-medium text-black opacity-100"
                  : ""
              } headerLink`}
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center justify-center gap-x-4 md:w-1/5">
            <SearchIcon
              className="headerIcon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />
            <Link href="/checkout">
              <div className="relative cursor-pointer">
                {basketItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 z-50 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-[10px] text-white">
                    {basketItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                )}
                <ShoppingBagIcon className="headerIcon" />
              </div>
            </Link>

            {session?.user ? (
              <img
                title="Profile"
                src={
                  session.user?.profilePic ||
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                }
                alt="userIcon"
                className="h-[34px] w-[34px] cursor-pointer rounded-full border"
                onClick={() => router.push("/profile")}
              />
            ) : (
              <Link href="/login" title="Login">
                <UserIcon className="headerIcon" />
              </Link>
            )}
            {menuOpen ? (
              <XIcon
                className="headerIcon md:hidden"
                onClick={() => toggleMenu()}
              />
            ) : (
              <MenuIcon
                className="headerIcon md:hidden"
                onClick={() => toggleMenu()}
              />
            )}
          </div>
          <Dialog
            initialFocus={searchInputRef}
            open={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
            <div className="fixed  inset-0 flex flex-col items-center justify-center p-4">
              <h1 className="mb-4 text-3xl font-bold text-white">
                Search Products
              </h1>
              <Dialog.Panel className="w-full max-w-sm rounded-md bg-white">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    name="searchInput"
                    className="h-full w-full rounded-md px-4 py-2 first-letter:uppercase focus:outline-none"
                    type="text"
                    ref={searchInputRef}
                    placeholder="Search with product name"
                  />
                </form>
              </Dialog.Panel>
            </div>
          </Dialog>
        </>
      )}
    </header>
  );
}

export default Header;
