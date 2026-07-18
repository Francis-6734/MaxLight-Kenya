import Image from "next/image";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-max flex min-h-[70vh] items-center justify-center py-14">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border shadow-xl lg:grid-cols-2">
        <div className="relative hidden bg-black lg:block">
          <Image src="/logo-full.jpg" alt="MaxLight Kenya" fill className="object-cover" priority />
        </div>
        <div className="flex items-center justify-center bg-background p-8 sm:p-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
