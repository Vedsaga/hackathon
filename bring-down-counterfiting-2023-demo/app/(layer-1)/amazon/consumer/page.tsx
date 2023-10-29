"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BadgeCheckIcon } from "lucide-react";

export default function Consumer() {
  return (
    <ScrollArea className="max-h-[80vh] rounded-md mt-8">
      <div className="flex flex-col space-y-4 mt-8">
        <figure
          className={`md:flex bg-white rounded-xl p-8 md:p-0 dark:bg-slate-800 shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden`}
        >
          <div className="flex-none w-48 relative">
            <Image
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              src="/nike-vapor-vertical-crop.png"
              alt="Nike Vapor"
              layout="responsive"
              objectFit="cover"
              width={1}
              height={2}
            />
          </div>
          <div className="flex-auto p-6">
            <div className="flex flex-wrap">
              <h1 className="flex-auto text-xl font-semibold">
                Nike ZoomX Vaporfly NEXT
              </h1>
              <BadgeCheckIcon
                color="orange"
                width={48}
                height={48}
              ></BadgeCheckIcon>
            </div>
            <p className="mt-4 text-sm">
              The Nike ZoomX Vaporfly NEXT is the fast you&apos;ve never seen—or
              felt—before. By combining our two most innovative technologies,
              Nike ZoomX foam and VaporWeave material, it&apos;s the fastest
              shoe we&apos;ve ever made. Scroll down to learn more about the
              future of racing shoes.
            </p>
          </div>
        </figure>
        <figure
          className={`md:flex bg-white rounded-xl p-8 md:p-0 dark:bg-slate-800 shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden`}
        >
          <div className="flex-none w-48 relative">
            <Image
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              src="/nike-vapor-vertical-crop.png"
              alt="Nike Vapor"
              layout="responsive"
              objectFit="cover"
              width={1}
              height={2}
            />
          </div>
          <div className="flex-auto p-6">
            <div className="flex flex-wrap justify-between">
              <h1 className="flex-auto text-xl font-semibold col">
                Nike ZoomX Vaporfly NEXT
              </h1>
            </div>
            <p className="mt-4 text-sm">
              The Nike ZoomX Vaporfly NEXT is the fast you&apos;ve never seen—or
              felt—before. By combining our two most innovative technologies,
              Nike ZoomX foam and VaporWeave material, it&apos;s the fastest
              shoe we&apos;ve ever made. Scroll down to learn more about the
              future of racing shoes.
            </p>
          </div>
        </figure>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
