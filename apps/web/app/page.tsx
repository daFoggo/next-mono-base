import { Header } from "@/components/sections/header"
import { HeroSection } from "@/components/sections/hero-section"
import { StripSection } from "@/components/sections/strip-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { WorkSection } from "@/components/sections/work-section"
import { DeeperSection } from "@/components/sections/deeper-section"
import { Footer } from "@/components/sections/footer"

/**
 * Landing page: full-bleed bands cut by hairlines, with two vertical rails along the content edge. Colors come from the
 * theme tokens; the pixel art is our own (docs/design-system.md, Pixel art).
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <div className="relative isolate">
        <main>
          <HeroSection />
          <StripSection />
          <FeaturesSection />
          <WorkSection />
          <DeeperSection />
        </main>
        <Footer />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-5 inset-y-0 -z-10 border-x md:inset-x-9"
        />
      </div>
    </>
  )
}
