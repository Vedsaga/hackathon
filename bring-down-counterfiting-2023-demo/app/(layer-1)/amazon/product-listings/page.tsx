"use client";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
import { CheckIcon, PackagePlus, SeparatorHorizontalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { TrademarkCard, TrademarkDetails } from "@/components/trademark-card";
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

type LinkedDCC = {
  index: number;
  dccNodeId: string;
  status: number;
};

export default function ProductListings() {
  const [state, setState] = useState({
    open: false,
    isDCCAccountLinked: false,
    shouldAddProduct: false,
    productListingCount: 0,
    numberOfChildNodesReceived: 0,
    linkedDCCAtIndex: [] as Array<LinkedDCC>,
    listOfDCCs: [] as Array<string>,
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

    const localLinkedDCCAtIndex: Array<LinkedDCC> = locaLlistOfDCCs
      .map((val, index) => {
        const isDCCUsed = localStorage.getItem(val);
        if (isDCCUsed === "true") {
          return { index: index + 1, dccNodeId: val };
        }
        return null;
      })
      .filter((item) => item !== null) as Array<LinkedDCC>;

    setState((prev) => ({
      ...prev,
      isDCCAccountLinked: localStorage.getItem("isDCCAccountLinked") === "true",
      numberOfChildNodesReceived: numberOfChildNodesReceived,
      listOfDCCs: locaLlistOfDCCs,
      productListingCount: parseInt(
        localStorage.getItem("productListingCount") ?? "0"
      ),
    }));
  }, []);

  const STATUS_NOT_LINKED = 0;
  const STATUS_LINKED = 1;

  function onAddGoodsToDrafts() {
    const dccId = form.getValues("dccNodeId");
    const { linkedDCCAtIndex } = state;
    form.setValue("dccNodeId", "");

    if (dccId !== undefined) {
      localStorage.setItem(dccId, "true");
      const newLinkedDCC: LinkedDCC = {
        index: linkedDCCAtIndex.length,
        dccNodeId: dccId,
        status: STATUS_NOT_LINKED,
      };

      setState((prev) => ({
        ...prev,
        shouldAddProduct: true,
        linkedDCCAtIndex: [...linkedDCCAtIndex, newLinkedDCC],
        open: false,
      }));

      setTimeout(() => {
        updateDCCStatus(dccId, STATUS_LINKED);
      }, 5000);
    }
  }

  function updateDCCStatus(dccNodeId: string, newStatus: number) {
    setState((prev) => {
      const updatedDCCs = prev.linkedDCCAtIndex.map((dcc) =>
        dcc.dccNodeId === dccNodeId ? { ...dcc, status: newStatus } : dcc
      );
      return {
        ...prev,
        linkedDCCAtIndex: updatedDCCs,
      };
    });
  }

  useEffect(() => {
    if (state.shouldAddProduct) {
      const count =
        parseInt(localStorage.getItem("productListingCount") ?? "0") + 1;
      console.log("count", count);
      localStorage.setItem("productListingCount", count.toString());
      setState((prev) => ({
        ...prev,
        shouldAddProduct: false,
        productListingCount: parseInt(
          localStorage.getItem("productListingCount") ?? "0"
        ),
      }));
    }
  }, [state.productListingCount, state.shouldAddProduct]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1">
        <Card className="flex flex-col min-h-[80vh] max-h-[80vh]">
          <CardHeader className=" lg:mt-2">
            <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
              Product Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      state.productListingCount === 0 ? "default" : "outline"
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
                                          className="w-[100%]"
                                          value={dcc}
                                          key={dcc}
                                          onSelect={field.onChange}
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
            </div>
            <ScrollArea className="max-h-[80vh] rounded-md mt-8">
              {state.productListingCount > 0 && (
                <div className="flex flex-col space-y-4 mt-8">
                  {Array.from(
                    { length: state.productListingCount },
                    (_, index) => (
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
                              const foundDCC = state.linkedDCCAtIndex.find(
                                (dcc) => dcc.index === index
                              );

                              if (!foundDCC) {
                                return <Badge>DCC Not Linked</Badge>;
                              }

                              const status = foundDCC.status === STATUS_LINKED;
                              return (
                                <div className=" flex-row space-x-4 space-y-4">
                                  <Badge>{foundDCC.dccNodeId}</Badge>
                                  {!status && (
                                    <Badge className="bg-orange-600">
                                      Amazon Analyzing Listing
                                    </Badge>
                                  )}
                                  {status && (
                                    <Badge className="bg-green-600">
                                      Verifed
                                    </Badge>
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
                    )
                  )}
                </div>
              )}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
