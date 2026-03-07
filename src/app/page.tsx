import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecentUpdates from "@/components/RecentUpdates";
import Publications from "@/components/Publications";
import Journey from "@/components/Journey";
import Awards from "@/components/Awards";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <RecentUpdates />
        <Publications />
        <Journey />
        <Awards />
      </main>
      <Footer />
    </>
  );
}
