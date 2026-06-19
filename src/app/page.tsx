import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WalkersPreview } from "@/components/sections/WalkersPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { CTA } from "@/components/sections/CTA";
import { AccountNotice } from "@/components/ui/AccountNotice";

export default function HomePage({
  searchParams,
}: {
  searchParams: { cuenta?: string };
}) {
  return (
    <>
      <AccountNotice status={searchParams.cuenta} />
      <Hero />
      <Services />
      <HowItWorks />
      <WalkersPreview />
      <Testimonials />
      <Pricing />
      <CTA />
    </>
  );
}
