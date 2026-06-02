import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Hobbies from "@/components/sections/Hobbies";
import Links from "@/components/sections/Links";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Hobbies />
      <Links />
      <Contact />
    </main>
  );
}
