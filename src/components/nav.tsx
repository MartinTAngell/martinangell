import { Instrument_Sans, Inter } from "next/font/google"

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
});

const instrument_sans = Instrument_Sans({
  weight: "400",
  subsets: ["latin"],
});

const links = ["About", "Projects", "Publications", "Rants", "Contact"];

const NAME_DELAY = 0;
const LINKS_DELAY = 0.15;
const ANIMATION_STAGGER = 0.10;

const Nav = () => {
  return (
    <nav style={{
      inset: 0,
      display: "flex",
      justifyContent: "space-between",
      top: 0,
      left: 0,
      color: "white",
    }}>
      <h1 style={{
        padding: "1vh 4vw",
        fontSize: "1.15rem",
        letterSpacing: "0.22em",
        userSelect: "none",
        animationDelay: `${NAME_DELAY}s`
      }}
        className={`${inter.className} fade-in`}
      >MARTIN ANGELL</h1>
      <div style={{
        display: "flex",
        padding: "1vh 4vw",
        fontSize: "1.15rem",
        gap: "5rem",
        userSelect: "none"
      }} className={instrument_sans.className}>
        {links.map((label, i) => (
          <a key={label} className="fade-in" style={{ animationDelay: `${LINKS_DELAY + i * ANIMATION_STAGGER}s` }}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Nav 
