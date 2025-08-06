import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { AuroraText } from "@/components/magicui/aurora-text";

export const Route = createFileRoute("/voted")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Voted />;
}

function Voted() {
  const startConfetti = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    startConfetti();
  }, []);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
        Thanks for <AuroraText>Voting</AuroraText>
      </h1>
    </div>
  );
}
