import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Modal = ({ children, isOpen, setIsOpen }) => {
  return (
    <Transition appear={true} show={isOpen}>
      <Dialog onClose={() => setIsOpen(false)}>
        <div className="fixed z-50 inset-0 bg-black/60" aria-hidden="true" />
        <Transition.Child
          className="z-50"
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-lg rounded bg-white">
              <div className="bg-white rounded-md p-4">{children}</div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
