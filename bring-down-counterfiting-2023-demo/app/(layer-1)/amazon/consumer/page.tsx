"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Image from "next/image";
import { BadgeAlert, BadgeCheckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ProductListing } from "../product-listings/page";

export default function Consumer() {
  const [state, setState] = useState({
    listedProducts: [] as Array<ProductListing>,
  });

  useEffect(() => {
    // decode local storage string
    const localListedProducts: Array<ProductListing> = JSON.parse(
      localStorage.getItem("listedProducts") ?? "[]"
    ) as Array<ProductListing>;

    setState((prev) => ({
      ...prev,
      listedProducts: localListedProducts,
    }));
  }, []);
  return (
    <Card className="flex flex-col min-h-[80vh] max-h-[80vh] max-w-[80vw]">
      <CardHeader className=" lg:mt-2">
        <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
          Consumer Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state.listedProducts.length > 0 && (
          <ScrollArea className="rounded-md h-[64vh]">
            <div className="flex flex-col-reverse space-y-4 mb-4">
              {state.listedProducts.map((product, index) => (
                <figure
                  key={index}
                  className={`md:flex mx-8 bg-white rounded-xl p-8 md:p-0 dark:bg-slate-800 shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden`}
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
                    <div className="flex flex-wrap align-middle items-center">
                      <h1 className="flex-auto text-xl font-semibold">
                        Nike ZoomX Vaporfly NEXT
                      </h1>
                      {(() => {
                        const foundDCC = product.dccNodeId !== "";
                        if (foundDCC && product.status === 1) {
                          return (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="#33C361"
                              stroke="#FFFFFF"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                          );
                        }
                        if (foundDCC && product.status === 0) {
                          return (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="#FF7F00"
                              stroke="#FFFFFF"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                              <line x1="12" x2="12.01" y1="17" y2="17" />
                            </svg>
                          );
                        }
                      })()}
                    </div>
                    <p className="mt-4 text-sm">
                      The Nike ZoomX Vaporfly NEXT is the fast you&apos;ve never
                      seen—or felt—before. By combining our two most innovative
                      technologies, Nike ZoomX foam and VaporWeave material,
                      it&apos;s the fastest shoe we&apos;ve ever made. Scroll
                      down to learn more about the future of racing shoes.
                    </p>
                  </div>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
