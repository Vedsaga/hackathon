"use client";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  CheckIcon,
  PackagePlus,
  SeparatorHorizontalIcon,
  View,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  goodName: z.string(),
  title: z.string(),
  description: z.string(),
  dccNodeId: z.string().optional(),
});

export type ProductListing = {
  index: number;
  dccNodeId: string;
  status: number;
};

export default function ProductListings() {
  const [state, setState] = useState({
    open: false,
    isDCCAccountLinked: false,
    shouldAddProduct: false,
    numberOfChildNodesReceived: 0,
    listedProducts: [] as Array<ProductListing>,
    listOfDCCs: [] as Array<string>,
    unUsedDCCs: [] as Array<string>,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goodName: "Nike ZoomX Vaporfly NEXT",
      title: "Nike ZoomX Vaporfly NEXT",
      description: `The Nike ZoomX Vaporfly NEXT is the fast you've never seen—or felt—before. By combining our two most innovative technologies, Nike ZoomX foam and VaporWeave material, it's the fastest shoe we've ever made. Scroll down to learn more about the future of racing shoes.`,
      dccNodeId: "",
    },
  });

  const router = useRouter();

  function onConsumerPreview() {
    router.push("/amazon/consumer");
  }

  useEffect(() => {
    const numberOfChildNodesReceived = parseInt(
      localStorage.getItem("numberOfChildNodesIssued") ?? "0"
    );
    const locaLlistOfDCCs: Array<string> = Array.from({
      length: numberOfChildNodesReceived,
    })
      .map((_, index) =>
        localStorage.getItem(`numberOfChildNodesIssued-${index + 1}`)
      )
      .filter((item): item is string => item !== null);

    // decode local storage string
    const localListedProducts: Array<ProductListing> = JSON.parse(
      localStorage.getItem("listedProducts") ?? "[]"
    ) as Array<ProductListing>;

    // get all the listing where status is STATUS_NOT_LINKED
    const localListedProductsNotLinked = localListedProducts
      .filter((product) => product.status === STATUS_NOT_LINKED)
      .forEach((product) => {
        setTimeout(() => {
          updateDCCStatus(product.dccNodeId, STATUS_LINKED);
        }, 5000);
      });

    const localunUsedDCCs = locaLlistOfDCCs.filter(
      (dccId) =>
        !localListedProducts.some((product) => product.dccNodeId === dccId)
    );

    setState((prev) => ({
      ...prev,
      isDCCAccountLinked: localStorage.getItem("isDCCAccountLinked") === "true",
      numberOfChildNodesReceived: numberOfChildNodesReceived,
      listOfDCCs: locaLlistOfDCCs,
      listedProducts: localListedProducts,
      unUsedDCCs: localunUsedDCCs,
    }));
  }, []);

  const STATUS_NOT_LINKED = 0;
  const STATUS_LINKED = 1;

  function onAddGoodsToDrafts() {
    const dccId = form.getValues("dccNodeId");
    const newLinkedDCC: ProductListing = {
      index: state.listedProducts.length,
      dccNodeId: "",
      status: STATUS_NOT_LINKED,
    };
    if (dccId !== undefined && dccId !== "") {
      newLinkedDCC.dccNodeId = dccId;
      setTimeout(() => {
        updateDCCStatus(dccId, STATUS_LINKED);
      }, 5000);
    }
    const filteredProductListings = state.listedProducts.reduce(
      (acc, product) => {
        if (product.dccNodeId === dccId) {
          acc = acc.filter((p) => p.dccNodeId !== dccId);
        }
        return acc;
      },
      [...state.listedProducts, newLinkedDCC]
    );
    const toJsonString = JSON.stringify(filteredProductListings);
    localStorage.setItem("listedProducts", toJsonString);

    setState((prev) => ({
      ...prev,
      shouldAddProduct: true,
    }));
  }

  function updateDCCStatus(dccNodeId: string, newStatus: number) {
    setState((prev) => {
      const updatedProductListings = prev.listedProducts.map((dcc) =>
        dcc.dccNodeId === dccNodeId ? { ...dcc, status: newStatus } : dcc
      ) as Array<ProductListing>;
      const toJsonString = JSON.stringify(updatedProductListings);
      localStorage.setItem("listedProducts", toJsonString);
      return {
        ...prev,
        listedProducts: updatedProductListings,
      };
    });
  }

  useEffect(() => {
    if (state.shouldAddProduct) {
      // decode local storage string
      const localListedProducts: Array<ProductListing> = JSON.parse(
        localStorage.getItem("listedProducts") ?? "[]"
      ) as Array<ProductListing>;
      console.log(localListedProducts);
      setState((prev) => ({
        ...prev,
        listedProducts: localListedProducts,
        unUsedDCCs: prev.listOfDCCs.filter(
          (dccId) =>
            !localListedProducts.some((product) => product.dccNodeId === dccId)
        ),
        open: false,
        shouldAddProduct: false,
      }));
    }
  }, [state.listedProducts, state.shouldAddProduct]);
  return (
    <Card className="flex flex-col min-h-[80vh] max-h-[80vh] max-w-[48vw]">
      <CardHeader className=" lg:mt-2">
        <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
          Product Listings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex gap-4">
            <Sheet
              open={state.open}
              onOpenChange={function (open) {
                if (open && state.shouldAddProduct) {
                  setState((prev) => ({ ...prev, open: false }));
                } else {
                  setState((prev) => ({ ...prev, open: open }));
                }
              }}
            >
              <SheetTrigger asChild>
                <Button
                  variant={
                    state.listedProducts.length === 0 ? "default" : "outline"
                  }
                >
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Add Goods
                </Button>
              </SheetTrigger>
              <SheetContent side={"bottom"} className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Add Goods</SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onAddGoodsToDrafts)}
                    className="w-full md:w-[64%] py-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <FormField
                        control={form.control}
                        name="goodName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Good Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="good name"
                                {...field}
                                readOnly={true}
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Goods Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="title"
                                {...field}
                                readOnly={true}
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dccNodeId"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Link DCC</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      " justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value}
                                    <SeparatorHorizontalIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search DCC..."
                                    className="h-9"
                                  />
                                  <CommandEmpty>No DCC found.</CommandEmpty>
                                  <CommandGroup>
                                    {state.listOfDCCs.map((dcc) => (
                                      <CommandItem
                                        value={dcc}
                                        key={dcc}
                                        onSelect={field.onChange}
                                        disabled={
                                          !new Set(state.unUsedDCCs).has(dcc)
                                        }
                                        className={`${
                                          !new Set(state.unUsedDCCs).has(dcc) &&
                                          "opacity-40 cursor-not-allowed"
                                        }`}
                                      >
                                        {dcc}
                                        <CheckIcon
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            new Set(field.value).has(dcc)
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Please select DCC which belong to this listing
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="description"
                                {...field}
                                readOnly={true}
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="mt-4">
                      Submit & Next
                    </Button>
                  </form>
                </Form>
                <SheetFooter></SheetFooter>
              </SheetContent>
            </Sheet>

            <Button variant={"secondary"} onClick={onConsumerPreview}>
              <View className="mr-2 " /> Consumer Preview
            </Button>
          </div>
          {state.listedProducts.length > 0 && (
            <ScrollArea className="rounded-md mt-4 max-h-[56vh] border">
              <div className="flex flex-col-reverse space-y-4 mb-4">
                {state.listedProducts.map((product, index) => (
                  <figure
                    key={index}
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
                          {form.watch("goodName")}
                        </h1>
                      </div>
                      <div className="w-full flex-none text-sm font-medium mt-2 space-x-2">
                        {(() => {
                          const foundDCC = product.dccNodeId !== "";
                          if (!foundDCC) {
                            return <Badge>DCC Not Linked</Badge>;
                          }

                          const status = product.status === STATUS_LINKED;
                          return (
                            <div className=" flex space-x-4 mt-2">
                              <Badge>{product.dccNodeId}</Badge>
                              {!status && (
                                <Badge className="bg-orange-600">
                                  Amazon Analyzing Listing
                                </Badge>
                              )}
                              {status && (
                                <Badge className="bg-green-600">Verifed</Badge>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                      <p className="mt-4 text-sm">
                        {form.watch("description")}
                      </p>
                    </div>
                  </figure>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
