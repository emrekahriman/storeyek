import ProfileLayout from "@/layouts/ProfileLayout";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const updatePassword = () => {
  const { data: session } = useSession();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    const submitBtn = e.target.submitBtn;

    submitBtn.disabled = true;
    console.log({
      oldPassword,
      newPassword,
      confirmPassword,
    });
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all the fields");
      submitBtn.disabled = false;
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      submitBtn.disabled = false;
      return;
    }
    const toastId = toast.loading("Updating Password");
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update-password`,
      {
        oldPassword,
        newPassword,
        confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.user?.tokenYek}`,
        },
      }
    );
    if (data.status === "success") {
      toast.success("Password Updated Successfully", { id: toastId });
    } else {
      toast.error(data.error, { id: toastId });
    }
    submitBtn.disabled = false;
    // e.target.reset();
  };

  return (
    <ProfileLayout>
      <div className="mb-10 w-full text-center">
        <h1 className="text-4xl font-bold">Update Password</h1>
      </div>
      <form className="mx-auto w-full max-w-xl" onSubmit={handlePasswordUpdate}>
        <div className="space-y-12">
          <div className=" border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Old Password
                </label>
                <div className="mt-2">
                  <input
                    id="oldPassword"
                    type="password"
                    name="oldPassword"
                    className="shadow-sn block w-full rounded-md border-2 border-gray-300 py-1.5 px-4 text-gray-900  placeholder:text-gray-400 focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New Password
                </label>
                <div className="mt-2">
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    className="shadow-sn block w-full rounded-md border-2 border-gray-300 py-1.5 px-4 text-gray-900  placeholder:text-gray-400 focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    className="shadow-sn block w-full rounded-md border-2 border-gray-300 py-1.5 px-4 text-gray-900  placeholder:text-gray-400 focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            name="submitBtn"
            type="submit"
            className="group relative flex justify-center rounded-md bg-purple-600 px-8 py-2 text-sm font-semibold text-white hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:min-w-[4rem] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="group-disabled:hidden">Update Password</span>
            <div role="status" className="hidden group-disabled:block">
              <svg
                aria-hidden="true"
                className="h-5 w-5 animate-spin fill-white text-purple-800"
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
      </form>{" "}
    </ProfileLayout>
  );
};

export default updatePassword;
