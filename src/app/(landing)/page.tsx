import DiscordUI from "@/components/landing/DiscordReview";
import IntroSection from "@/components/landing/IntroSection";
import BentoGrid from "@/components/landing/BentoGrid";
import MaxWidthWrapper from "@/components/globals/MaxWidthWrapper";
import Heading from "@/components/globals/Heading";
import { Star } from "lucide-react";
import Image from "next/image";
import { Icons } from "@/components/globals/icons";
import ShinyButton from "@/components/globals/ShinyButton";
function page() {
  return (
    <>
      <IntroSection />
      <DiscordUI />
      <BentoGrid />
      <section className="relative py-24 sm:py-32 bg-white">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-brand-600">
              Real-Word Experiences
            </h2>
            <Heading className="text-center">What our customers say</Heading>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* FIRST Review */}
            <div className="flex flex-auto flex-col gap-4 bg-brand-25 p-6 sm:p-8 lg:p-16 rounded-t-[2rem] lg:rounded-tr-none lg:rounded-l-[2rem]">
              <div className="flex gap-0.5 justify-center mb-2 lg:justify-start">
                {[1, 2, 3, 4, 5].map((item) => {
                  return (
                    <Star
                      className="size-5 text-brand-600 fill-brand-600"
                      key={item}
                    />
                  );
                })}
              </div>
              <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-950 text-center lg:text-left text-pretty">
                Ping Panda has been a Game-changer for me. I've been using it
                for two months now and seeing sales pop in real-time is super
                satisfy.
              </p>
              <div className="flex flex-col justify-center lg:justify-start sm:flex-row items-center sm:items-start gap-4 mt-2">
                <Image
                  src={"/user-2.png"}
                  className="rounded-full object-cover"
                  alt="random user"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="font-semibold flex items-center">
                    Friea Larson
                    <Icons.verificationBadge className="text-blue-500 size-4 inline-block ml-1.5" />
                  </p>
                  <p className="text-sm text-gray-600">@itsfriea</p>
                </div>
              </div>
            </div>
            {/* SECOND Review */}
            <div className="flex flex-auto flex-col gap-4 bg-brand-25 p-6 sm:p-8 lg:p-16 rounded-b-[2rem] lg:rounded-bl-none lg:rounded-r-[2rem]">
              <div className="flex gap-0.5 justify-center mb-2 lg:justify-start">
                {[1, 2, 3, 4, 5].map((item) => {
                  return (
                    <Star
                      className="size-5 text-brand-600 fill-brand-600"
                      key={item}
                    />
                  );
                })}
              </div>
              <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-950 text-center lg:text-left text-pretty">
                Ping Panda has been off four our SaaS. Nice to have simple way
                to see who we're doing day-to-day. Definitely makes our live
                easier.
              </p>
              <div className="flex flex-col justify-center lg:justify-start sm:flex-row items-center sm:items-start gap-4 mt-2">
                <Image
                  src={"/user-1.png"}
                  className="rounded-full object-cover"
                  alt="random user"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="font-semibold flex items-center">
                    Kido Durands
                    <Icons.verificationBadge className="text-blue-500 size-4 inline-block ml-1.5" />
                  </p>
                  <p className="text-sm text-gray-600">@kidodurand_2</p>
                </div>
              </div>
            </div>
          </div>
          <ShinyButton
            href="/sing-up"
            className="relative z-10 h-14 w-full max-w-xs text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            Start for free today
          </ShinyButton>
        </MaxWidthWrapper>
      </section>
    </>
  );
}

export default page;
