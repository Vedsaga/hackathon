"use client";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckIcon,
  Link2Icon,
  LucideDraftingCompass,
  MoveRight,
  PackagePlus,
  SeparatorHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "@/components/loading-indicator";
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
  utilizedTrademarks: z.array(z.string()),
});

const languages = [
  {
    label: "ALPHAFLY",
    value: "90118325",
    statuses: [
      { label: "LIVE", color: "bg-green-600" },
      { label: "REGISTERED", color: "bg-green-600" },
    ],
  },
  {
    label: "NIKE",
    value: "97096366",
    statuses: [
      { label: "PENDING", color: "bg-orange-700" },
      { label: "LIVE", color: "bg-green-600" },
    ],
  },
] as const;
export default function GoodsDetailsDrafts() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goodName: "Nike ZoomX Vaporfly NEXT",
      title: "Nike ZoomX Vaporfly NEXT",
      description: `The Nike ZoomX Vaporfly NEXT is the fast you've never seen—or felt—before. By combining our two most innovative technologies, Nike ZoomX foam and VaporWeave material, it's the fastest shoe we've ever made. Scroll down to learn more about the future of racing shoes.`,
      utilizedTrademarks: ["ALPHAFLY", "NIKE"],
    },
  });

  const [state, setState] = useState({
    open: false,
    isUSPTOLinked: false,
    shouldAddGoods: false,
    showTademarks: false,
    goodsCount: 0,
    selectedGoodsCount: 0,
  });

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isUSPTOLinked") === "true") {
      setState((prev) => ({
        ...prev,
        isUSPTOLinked: true,
        goodsCount: parseInt(localStorage.getItem("goodsCount") ?? "0"),
      }));
      return;
    } else {
      router.push("/link-uspto");
    }
  }, [router]);

  function onNext() {
    router.push("/dashboard");
  }

  function onAddGoodsToDrafts() {
    setState((prev) => ({
      ...prev,
      shouldAddGoods: true,
      open: false,
    }));
  }

  useEffect(() => {
    if (state.shouldAddGoods) {
      setState((prev) => ({
        ...prev,
        shouldAddGoods: false,
        goodsCount: parseInt(localStorage.getItem("goodsCount") ?? "0") + 1,
      }));
      localStorage.setItem("goodsCount", state.goodsCount.toString());
    }
  }, [state.goodsCount, state.shouldAddGoods]);

  const trademarkData: Array<TrademarkDetails> = [
    {
      imageUrl: "https://tsdr.uspto.gov/img/90118325/large",
      wordmark: "ALPHAFLY",
      statuses: [
        { label: "LIVE", color: "bg-green-600" },
        { label: "REGISTERED", color: "bg-green-600" },
      ],
      goodsAndServices: "IC 025: Footwear.",
      classNumber: "025",
      link: "",
      serialNumber: "90118325",
      owner: "Nike, Inc. (CORPORATION; OREGON)",
    },
    {
      imageUrl: "https://tsdr.uspto.gov/img/97096366/large",
      wordmark: "NIKE",
      statuses: [
        { label: "PENDING", color: "bg-orange-700" },
        { label: "LIVE", color: "bg-green-600" },
      ],
      goodsAndServices:
        "IC 041: Entertainment services, namely, providing on-line,...",
      classNumber: "041, 035, 009",
      link: "",
      serialNumber: "97096366",
      owner: "Nike, Inc. (CORPORATION; OREGON)",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1">
        <Card className="flex flex-col min-h-[80vh]">
          <CardHeader className=" lg:mt-2">
            <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
              Goods Details Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Sheet
                open={state.open}
                onOpenChange={function (open) {
                  if (open && state.shouldAddGoods) {
                    setState((prev) => ({ ...prev, open: false }));
                  } else {
                    setState((prev) => ({ ...prev, open: open }));
                  }
                }}
              >
                <SheetTrigger asChild>
                  <Button
                    variant={state.goodsCount === 0 ? "secondary" : "outline"}
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
                          name="utilizedTrademarks"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Utilized Trademarks</FormLabel>
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
                                      {field.value.length === 0
                                        ? "Select trademark"
                                        : field.value.join(", ")}
                                      <SeparatorHorizontalIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                  <Command>
                                    <CommandInput
                                      placeholder="Search trademark..."
                                      className="h-9"
                                    />
                                    <CommandEmpty>
                                      No Trademak found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {languages.map((trademark) => (
                                        <CommandItem
                                          className="w-[100%]"
                                          value={trademark.label}
                                          key={trademark.value}
                                          onSelect={() => {}}
                                        >
                                          {trademark.label}
                                          <CheckIcon
                                            className={cn(
                                              "ml-auto h-4 w-4",
                                              new Set(field.value).has(
                                                trademark.label
                                              )
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
                                This is the trademark that will be used in the
                                dashboard.
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
              <Button
                disabled={state.goodsCount === 0}
                onClick={onNext}
                variant={"secondary"}
              >
                Next -&gt;
              </Button>
            </div>
            <ScrollArea className="h-[80vh] rounded-md mt-8">
              {state.goodsCount > 0 && (
                <div className="flex flex-col space-y-4 mt-8">
                  {Array.from({ length: state.goodsCount }, (_, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer mr-4 ${
                        state.selectedGoodsCount === index + 1 &&
                        "border-4 rounded-lg border-stale-300"
                      }`}
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          showTademarks: true,
                          selectedGoodsCount: index + 1,
                        }));
                      }}
                      onKeyDown={(event) => {
                        // Reacting to the "Enter" key for accessibility
                        if (event.key === "Enter") {
                          setState((prev) => ({
                            ...prev,
                            showTademarks: true,
                            selectedGoodsCount: index + 1,
                          }));
                        }
                      }}
                    >
                      <figure
                        key={index}
                        className={`md:flex ${
                          state.selectedGoodsCount === index + 1
                            ? "bg-white"
                            : "bg-stale-100"
                        } rounded-xl p-8 md:p-0 dark:bg-slate-800 shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden`}
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
                            <span className="text-red-500">
                              Utilized Trademarks:
                            </span>{" "}
                            {form
                              .watch("utilizedTrademarks")
                              .map((trademark) => (
                                <Badge key={trademark} >
                                  {trademark}
                                </Badge>
                              ))}
                          </div>
                          <p className="mt-4 text-sm">
                            {form.watch("description")}
                          </p>
                        </div>
                      </figure>
                    </div>
                  ))}
                </div>
              )}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card className="flex flex-col min-h-[80vh]">
          <CardHeader className=" lg:mt-2">
            <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
              Trademark Utilized
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.showTademarks ? (
              <ScrollArea className=" h-max rounded-md">
                {
                  <div className="flex w-max space-x-4">
                    {trademarkData.map((trademark, index) => (
                      <TrademarkCard
                        key={index}
                        details={trademark}
                        className="w-80"
                      />
                    ))}
                  </div>
                }
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="flex flex-col min-h-[40vh] items-center justify-center">
                <h4 className="text-center pr-4">No Goods Selected</h4>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
