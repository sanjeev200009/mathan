import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import ServiceStrip from "@/components/ServiceStrip";
import PromoBanners from "@/components/PromoBanners";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

// The one-page shop, top to bottom as in the design.
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Categories />
        <Products />
        <ServiceStrip />
        <PromoBanners />
        <WhyChooseUs />
      </main>
      <Footer />
    </>
  );
}
