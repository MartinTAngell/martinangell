import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <div>
      <p className="text-accent-text text-xs uppercase tracking-[0.2em]">ABOUT</p>
      <h1 className="font-serif text-6xl leading-none mt-3">Hi, I&apos;m Martin!</h1>
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mt-8">
        <div className="lg:w-2/3">
          <div className="mb-12">
            <p className="mb-4">
              I&apos;m a senior at NYU&apos;s Courant Institute studying Computer Science and Mathematics. I&apos;m fascinated by physically based simulations and their applications in computer graphics. For the uninitiated, this includes everything from making blocks fall and bounce to rendering realistic hair for people with hair as curly as mine (the attached picture doesn&apos;t show quite how curly it is at its current length).
            </p>
            <p className="mb-4">
              My introduction to the world of computer graphics came from the YouTube videos of Sebastian Lague, which I&apos;m sure is the case for most computer graphics folks of my generation. It was specifically <Link target="_blank" className="text-accent" href="https://youtu.be/lctXaT9pxA0?si=O5joDQAgD8j_pnOv">this</Link> video on procedurally generated moons and planets that made me think, “That&apos;s what I want to do with my life!”
            </p>
            <p className="mb-4">
              Since Fall 2024, I&apos;ve been an undergraduate researcher with <Link target="_blank" className="text-accent" href="https://wp.nyu.edu/courantinstituteofmathematicalsciences-gizemk">Professor Gizem Kayar</Link>. As a member of her lab, I work on realistic fluid simulations using SPH. For more information about my research, go to my <Link className="text-accent" href="/publications">publications</Link> page.
            </p>
            <p className="mb-4">
              Outside of my obsession with computer graphics, I&apos;m interested in theater, music, history, baseball (with a love for underlying analytics), and football. I&apos;ve also got two adorable and aggressively soft cats named Natasha and Anatole. If you want to hear me rant obsessively about any of these things, go to my <Link className="text-accent" href="/rants">rants</Link> page.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-serif mb-3">Get in touch</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <span><Link className="text-accent" href="mailto:martin@martinangell.com">martin@martinangell.com</Link></span>
              <div className="flex gap-4 md:gap-2">
                <span><Link className="text-accent-text hover:text-fg" href="https://github.com/martintangell" target="_blank">GitHub</Link></span>
                <span className="hidden md:inline text-accent-text">&middot;</span>
                <span><Link className="text-accent-text hover:text-fg" href="https://www.linkedin.com/in/martintangell" target="_blank">LinkedIn</Link></span>
                <span className="hidden md:inline text-accent-text">&middot;</span>
                <span><Link className="text-accent-text hover:text-fg" href="/resume" target="_blank">Resume</Link></span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex lg:w-1/3 flex-col gap-8">
          <div className="relative aspect-square w-56 lg:w-full">
            <Image
              alt="Martin Angell"
              fill
              className="rounded-xl object-cover object-top"
              sizes="(min-width: 1024px) 33vw, 100vw"
              src="/marty.jpg" />
          </div>

          <div className="w-full bg-accent-bg rounded-xl border border-dg p-4">
            <h3 className="text-3xl font-serif">Quick facts</h3>
            <div className="flex flex-col mt-4 text-sm">
              <div className="flex flex-col border-t border-dg pt-2 mt-2">
                <span className="text-accent-text uppercase tracking-[0.15em]">Studying</span>
                <span>Bachelor of Arts in Computer Science and Mathematics at NYU Courant, 2027</span>
              </div>
              <div className="flex flex-col border-t border-dg pt-2 mt-2">
                <span className="text-accent-text uppercase tracking-[0.15em]">Research Interests</span>
                <span>Computer graphics, computer simulation, computational fluid dynamics, rendering</span>
              </div>
              <div className="flex flex-col border-t border-dg pt-2 mt-2">
                <span className="text-accent-text uppercase tracking-[0.15em]">Currently Re-Reading</span>
                <span>A Storm of Swords by <span className="italic">George R.R. Martin</span> </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
