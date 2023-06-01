import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import getCroppedImg from "@/utils/cropImage";
import Image from "next/image";
import ProfileLayout from "@/layouts/ProfileLayout";
import Modal from "@/components/Modal";
import Cropper from "react-easy-crop";
import axios from "axios";
import { blobToBase64, base64ToFile } from "@/utils/imageConversions";
import { toast } from "react-hot-toast";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const uploadPicBtnRef = useRef(null);

  useEffect(() => {
    if (!dialogOpen) {
      setSelectedFile(null);
    }
  }, [dialogOpen]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpdateAvatar = async () => {
    uploadPicBtnRef.current.disabled = true;
    const toastId = toast.loading("Updating avatar...");
    const croppedBlobUrl = await getCroppedImg(selectedFile, croppedAreaPixels); // blob image
    const base64data = await blobToBase64(croppedBlobUrl);
    const picFile = base64ToFile(base64data, "profilePicture.png");

    const formData = new FormData();
    formData.append("profilePicture", picFile);

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update-profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session?.user?.tokenYek}`,
        },
      }
    );
    if (data.status === "success") {
      session.user.profilePic = data.profilePic;
      await update({
        ...session,
        user: {
          ...session.user,
          profilePic: data.profilePic,
        },
      });

      toast.success("Avatar updated successfully", { id: toastId });
    } else {
      toast.error("Error updating avatar", { id: toastId });
    }
    setDialogOpen(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating profile...");
    const { fullName, phone, address } = e.target.elements;
    const submitBtn = e.target.elements.updateInfoBtn;
    submitBtn.disabled = true;

    if (!fullName.value || !phone.value || !address.value) {
      toast.error("Please fill all fields", { id: toastId });
      submitBtn.disabled = false;
      return;
    }
    const payload = {
      fullName: fullName.value,
      phone: phone.value,
      address: address.value,
    };
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.tokenYek}`,
        },
      }
    );
    if (data.status === "success") {
      await update({
        ...session,
        user: {
          ...session.user,
          ...payload,
        },
      });

      toast.success("Profile updated successfully", { id: toastId });
    } else {
      toast.error(data.error, { id: toastId });
    }
    submitBtn.disabled = false;
  };

  return (
    <ProfileLayout>
      <Modal isOpen={dialogOpen} setIsOpen={setDialogOpen}>
        {!selectedFile ? (
          <div className="flex w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="mb-3 h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={({ target: { files } }) => {
                  setSelectedFile(URL.createObjectURL(files[0]));
                }}
              />
            </label>
          </div>
        ) : (
          <div className="relative flex h-96 flex-col justify-center">
            <div className="relative h-5/6 w-full">
              <Cropper
                classes={
                  "absolute top-0 left-0 w-full h-full rounded-lg border-2 border-purple-500 shadow-md"
                }
                image={selectedFile}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="mt-5 flex justify-center">
              {/* upload button */}
              <button
                ref={uploadPicBtnRef}
                type="button"
                className="group inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:min-w-[4rem] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleUpdateAvatar}
              >
                <span className="group-disabled:hidden">Update Avatar</span>
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
              {/* cancel button */}
              <button
                type="button"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      <div className="mb-10 w-full text-center">
        <h1 className="text-4xl font-bold">Your Profile</h1>
      </div>
      <form className="mb-11">
        <div className="space-y-12">
          <div className=" border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile Picture
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              If you want to change your profile picture click the image below
            </p>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="text-center sm:col-span-6">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Current Avatar
                </label>
                <div className=" mt-5 flex items-center justify-center">
                  <div className="animate-ping rounded-full border border-black/20 p-3">
                    <div className="h-24 w-24 rounded-full border-2 border-black/30 p-2"></div>
                  </div>
                  <Image
                    unoptimized
                    key={session?.user?.profilePic}
                    onClick={() => setDialogOpen(true)}
                    src={session?.user?.profilePic}
                    alt="profile picture"
                    width={150}
                    height={150}
                    className="absolute cursor-pointer rounded-full border-2 border-purple-500 shadow-md transition-all duration-200 hover:shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={handleProfileUpdate}>
        <div className="space-y-12">
          <div className=" border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Change your personal information and email address.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full name
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={session?.user?.fullName}
                    type="text"
                    name="fullName"
                    id="fullName"
                    className="shadow-sn block w-full rounded-md border-2 border-gray-300 py-1.5 px-4 text-gray-900  placeholder:text-gray-400 focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={session?.user?.phone}
                    type="text"
                    name="phone"
                    id="phone"
                    className="shadow-sn block w-full rounded-md border-2 border-gray-300 py-1.5 px-4 text-gray-900  placeholder:text-gray-400 focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    placeholder={session?.user?.email}
                    id="email"
                    className="shadow-sn block w-full rounded-md border-2 border-gray-300 py-1.5 px-4 text-gray-900  placeholder:text-gray-400 focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2">
                  <textarea
                    id="address"
                    defaultValue={session?.user?.address}
                    className="shadow-sn block w-full rounded-md border-2 border-gray-300 py-1.5 px-4 text-gray-900  placeholder:text-gray-400 focus:border-purple-600 focus:outline-none sm:text-sm sm:leading-6"
                    name="address"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            name="updateInfoBtn"
            className="group rounded-md bg-purple-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:min-w-[4rem] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="group-disabled:hidden">Update Information</span>
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
      </form>
    </ProfileLayout>
  );
}
