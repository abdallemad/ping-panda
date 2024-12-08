import Heading from "@/components/globals/Heading";
import MaxWidthWrapper from "@/components/globals/MaxWidthWrapper";
import { FaCheck } from "react-icons/fa";
import ShinyButton from "@/components/globals/ShinyButton";

function IntroSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-brand-25">
      <MaxWidthWrapper className="text-center">
        <div className="relative mx-auto text-center flex flex-col items-center gap-10">
          <div>
            <Heading>
              <span>Real Time SaaS Insight</span>
              <br />
              <span className="relative bg-gradient-to-r from-brand-700 to-brand-800 bg-clip-text text-transparent">
                Delivered to Your Discord
              </span>
            </Heading>
          </div>
          <p className="text-base/7 text-gray-600 max-w-prose text-center text-pretty">
            PingPanda is the easiest way to monitor your SaaS. Get instant
            notification for{" "}
            <span className="font-semibold text-gray-700">
              sales, new users, or any other event
            </span>{" "}
            send directly to your Discord.
          </p>
          <ul className="space-y-2 text-base/7 text-gray-600 text-left flex flex-col items-start">
            {[
              "Real-time Discord critical events",
              "Buy once, use forever",
              "Track sales, new users, or any other events",
              "Monitor your SaaS",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-1.5 text-left">
                <FaCheck className="text-brand-700 size-5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="w-full max-w-80">
            <ShinyButton className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl">
              Start For Free Today
            </ShinyButton>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

export default IntroSection;
