import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleTest() {
  const [ init, setInit ] = useState(false);

  useEffect(() => {
      initParticlesEngine(async engine => await loadSlim(engine)).then(() => setInit(true));
  }, []);

  const particlesLoaded = container => console.log(container);

  return (
    <>
        {init && <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab",
                        },

                    },
                    modes: {
                        grab: {
                            distance: 200,
                            lineLinked: {
                              opacity: 1
                            }
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#555",
                    },
                    links: {
                        color: "#555",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 0.5,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            width: 800,
                            height: 800
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
        }
    </>
)
}
