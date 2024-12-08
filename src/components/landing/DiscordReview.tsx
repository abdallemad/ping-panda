import { DiscordMessage } from "@/components/landing/DiscordMessage";
import MockDiscordUi from "@/components/landing/MockDiscourdUi";
import MaxWidthWrapper from "@/components/globals/MaxWidthWrapper";
import { AnimatedList } from "@/components/ui/animated-list";

function DiscordUI() {
  return (
    <section className="relative bg-brand-25 pb-4">
      <div className="absolute inset-0 bottom-24 top-24 bg-brand-700" />
      <div className="relative mx-auto">
        <MaxWidthWrapper className="relative">
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <MockDiscordUi>
              <AnimatedList>
                <DiscordMessage
                  avatarSrc="/brand-asset-profile-picture.png"
                  avatarAlt="pingpanda"
                  username="PingPanda"
                  timestamp="Today at 12:32AM"
                  badgeColor="#43b581"
                  badgeText="SingUp"
                  title="👤 New user singed up"
                  content={{
                    name: "Mohamed Salah",
                    email: "salahmohamed@example.com",
                  }}
                />
                <DiscordMessage
                  avatarSrc="/brand-asset-profile-picture.png"
                  avatarAlt="pingpanda"
                  username="PingPanda"
                  timestamp="Today at 12:32AM"
                  badgeColor="#faa61a"
                  badgeText="Revenue"
                  title="🤑 Payment received"
                  content={{
                    amount: "$4900",
                    email: "zoeow@example.com",
                    plan: "PRO",
                  }}
                />
                <DiscordMessage
                  avatarSrc="/brand-asset-profile-picture.png"
                  avatarAlt="pingpanda"
                  username="PingPanda"
                  timestamp="Today at 5:11AM"
                  badgeColor="#5868f2"
                  badgeText="Milestone"
                  title="🚀 Revenue Milestone achieved"
                  content={{
                    recurringRevenue: "$5.000 USD",
                    growth: "+8.25",
                  }}
                />
              </AnimatedList>
            </MockDiscordUi>
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}

export default DiscordUI;
