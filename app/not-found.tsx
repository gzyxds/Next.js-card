import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 left-1/3 h-[400px] w-[550px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-500/5 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[350px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-violet-400/5 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Card */}
      <Card className="w-full max-w-sm border shadow-lg shadow-black/[0.04]">
        <CardHeader className="text-center pb-2">
          <p className="text-5xl font-bold tracking-tight text-muted-foreground/50">
            404
          </p>
          <CardTitle className="text-xl font-bold tracking-tight mt-3">
            Page not found
          </CardTitle>
          <CardDescription>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Button asChild className="w-full h-11 shadow-md shadow-primary/20">
            <Link href="/">Go back home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
