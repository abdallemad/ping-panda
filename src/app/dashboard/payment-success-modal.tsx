"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getPlanAction } from "./category/[name]/action";
import { Modal } from "@/components/ui/modal";
import LoadingSpinner from "@/components/globals/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";

function PaymentSuccessModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      return await getPlanAction();
    },
    refetchInterval(query) {
      if (query.state.data?.plan === "PRO") return false;
      return 1000;
    },
  });
  const handleClose = () => {
    setIsOpen(false);
    router.push("/dashboard");
  };
  const isPaymentSuccessful = data?.plan === "PRO";
  return (
    <Modal
      showModal={isOpen}
      setShowModal={setIsOpen}
      onClose={handleClose}
      className="px-6 pt-6"
      preventDefaultClose={!isPaymentSuccessful}
    >
      <div className="flex flex-col items-center">
        {isPending || !isPaymentSuccessful ? (
          <div className="flex flex-col items-center justify-center h-64">
            <LoadingSpinner className="mb-4" />
            <p className="text-lg/7 font-medium text-gray-900">
              Upgrading your account...
            </p>
            <p className="text-gray-600 text-sm/6 mt-2 text-center text-pretty">
              Please wait while we process your upgrade. This might take a
              moment.
            </p>
          </div>
        ) : (
          <>
            <div className="relative aspect-video border border-gray-200 w-full overflow-hidden rounded-lg bg-gray-50">
              <Image
                width={400}
                height={400}
                src="/public/brand-asset-heart.png"
                className="h-full w-full object-cover"
                alt="payment success"
              />
            </div>
            <div className="mt-6 flex flex-col items-center gap-1 text-center">
              <p className="text-lg/7 tracking-tight font-medium text-pretty">
                Upgrade successful 🥳
              </p>
              <p className="text-gray-600 text-sm/6 text-pretty">
                You are now a Pro member. Enjoy the new features!
              </p>
            </div>
            <div className="mt-8 w-full">
              <Button onClick={handleClose} className="h-12 w-full">
                <Check className="mr-2 size-5" />
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default PaymentSuccessModal;
