"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { Check, Link2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "@/components/loading-indicator";
import { TrademarkCard, TrademarkDetails } from "@/components/trademark-card";

const formSchema = z.object({
  isTrademarkOwner: z.boolean(),
});

export default function TrademarkOwnerRegistation() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isTrademarkOwner:
        (localStorage.getItem("isUSPTOLinked") ?? "false") === "true",
    },
  });

  const [state, setState] = useState({
    open: false,
    shouldLinkUSPTOAccount: false,
    isUSPTOLinked: false,
    isSyncingTrademarks: false,
    isSyncCompleted: false,
  });

  const router = useRouter();

  function onSubmit() {
    if (state.isUSPTOLinked) {
      router.push("/goods-details-drafts");
      return;
    }
    if (!state.isUSPTOLinked) {
      router.push("/dashboard");
    }
  }

  function onPrevious() {
    router.push("/trademark-owner-registation");
  }

  function onLinkUSPTO() {
    localStorage.setItem("isUSPTOLinked", "true");
    setState((prev) => ({
      ...prev,
      shouldLinkUSPTOAccount: true,
      open: false,
    }));
  }

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isUSPTOLinked: localStorage.getItem("isUSPTOLinked") === "true",
    }));
  }, []);

  useEffect(() => {
    if (state.isUSPTOLinked) {
      setState((prev) => ({
        ...prev,
        isSyncingTrademarks: true,
      }));
    }

    // wait for 2 seconds and then set isSyncCompleted to true
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isSyncingTrademarks: false,
        isSyncCompleted: true,
      }));
    }, 2000);
  }, [state.isUSPTOLinked]);

  const watchIsTrademarkOwner = form.watch("isTrademarkOwner");

  useEffect(() => {
    if (watchIsTrademarkOwner && state.shouldLinkUSPTOAccount) {
      localStorage.setItem("isUSPTOLinked", "true");
    }
    if (!watchIsTrademarkOwner && !state.shouldLinkUSPTOAccount) {
      localStorage.setItem("isUSPTOLinked", "false");
    }
    setState((prev) => ({
      ...prev,
      shouldLinkUSPTOAccount: false,
      isSyncCompleted: localStorage.getItem("isUSPTOLinked") === "true",
      isUSPTOLinked: localStorage.getItem("isUSPTOLinked") === "true",
    }));
  }, [state.shouldLinkUSPTOAccount, watchIsTrademarkOwner]);

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

    {
      imageUrl: "https://tsdr.uspto.gov/img/77078429/large",
      wordmark: "NIKEGOLF",
      statuses: [
        { label: "DEAD", color: "bg-red-600" },
        { label: "CANCELLED", color: "bg-red-600" },
      ],
      goodsAndServices:
        "(CANCELLED) IC 035: [ Retail store services in the field of apparel,...",
      classNumber: "035, 041, 018, 025, 028",
      link: "",
      serialNumber: "77078429",
      owner: "Nike, Inc. (CORPORATION; OREGON)",
    },
    {
      imageUrl: "https://tsdr.uspto.gov/img/76707023/large",
      link: "",
      wordmark: "NIKE",
      serialNumber: "76707023",
      statuses: [
        { label: "ABANDONED", color: "bg-gray-400" },
        { label: "CANCELLED", color: "bg-red-600" },
      ],
      goodsAndServices:
        "(ABANDONED) IC 005: Fragrance products for land vehicles, aircraft,...",
      classNumber: "005",
      owner: "Olde Granddad Industries, Inc. (CORPORATION; NEW JERSEY)",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-2">
        <Card className="flex flex-col min-h-[80vh] max-h-[80vh]">
          <CardHeader className=" lg:mt-2">
            <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
              Link USPTO Account
            </CardTitle>
            <CardDescription className="sm:text-base"></CardDescription>
          </CardHeader>
          <CardContent className="w-full md:w-[64%] py-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-4">
                  <FormField
                    control={form.control}
                    name="isTrademarkOwner"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm border-primary">
                        <div className="space-y-0.5">
                          <FormLabel>I&apos;m Trademark Owner</FormLabel>
                          <FormDescription>
                            do you have any trademark registered with USPTO?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("isTrademarkOwner") && (
                    <Dialog
                      open={state.open}
                      onOpenChange={function (open) {
                        if (open && state.shouldLinkUSPTOAccount) {
                          setState((prev) => ({ ...prev, open: false }));
                        } else {
                          setState((prev) => ({ ...prev, open: open }));
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          disabled={state.isUSPTOLinked}
                          variant={state.isUSPTOLinked ? "outline" : "default"}
                        >
                          {state.isUSPTOLinked ? (
                            <Check className="mr-2 h-4 w-4" color="green" />
                          ) : (
                            <Link2Icon className="mr-2 h-4 w-4" />
                          )}
                          Link USPTO Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Link USPTO account?</DialogTitle>
                          <DialogDescription>
                            Linking your USPTO account to DCC account will
                            authorize you,{" "}
                            <b>
                              to create Parent Node(first certificate in the
                              DCC).
                            </b>
                            <br />
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="secondary"
                              className="mr-4"
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="button" onClick={onLinkUSPTO}>
                            Yes, Link Account
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
                  <button
                    type="button"
                    className={cn(buttonVariants({ variant: "outline" }))}
                    onClick={onPrevious}
                  >
                    Previous
                  </button>
                  {!form.watch("isTrademarkOwner") && (
                    <Button
                      type="submit"
                      className="mt-4 md:mt-0"
                      disabled={form.watch("isTrademarkOwner")}
                    >
                      Skip
                    </Button>
                  )}
                  {form.watch("isTrademarkOwner") && (
                    <Button
                      type="submit"
                      className="mt-4 md:mt-0"
                      disabled={!state.isUSPTOLinked}
                    >
                      Submit & Next
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>{" "}
      </div>
      <div className="col-span-3">
        {state.isUSPTOLinked && (
          <ScrollArea className=" h-max rounded-md border">
            {state.isSyncingTrademarks ? (
              <div className="flex flex-col min-h-[80vh] max-h-[80vh] items-center justify-center">
                <h4 className="text-center pr-4">Loading Trademarks...</h4>
                <LoadingIndicator />
              </div>
            ) : state.isSyncCompleted ? (
              <div className="flex w-max space-x-4 p-4">
                {trademarkData.map((trademark, index) => (
                  <TrademarkCard
                    key={index}
                    details={trademark}
                    className="w-80"
                  />
                ))}
              </div>
            ) : (
              <h4>No Trademarks Found</h4>
            )}

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
