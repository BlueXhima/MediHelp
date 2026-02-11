import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { FeatureSection } from "../components/FeatureSection";
import { ResourcesSection } from "../components/ResourcesSection";
import { Banner } from "../components/Banner";
import { Footer } from "../components/Footer";

export const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            <main>
                <section id="hero" className="scroll-mt-4">
                    <HeroSection />
                </section>

                <section id="about" className="scroll-mt-4">
                    <AboutSection />
                </section>

                <section id="features" className="scroll-mt-4">
                    <FeatureSection />
                </section>

                <section id="resources" className="scroll-mt-4">
                    <ResourcesSection />
                </section>

                <Banner />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
};