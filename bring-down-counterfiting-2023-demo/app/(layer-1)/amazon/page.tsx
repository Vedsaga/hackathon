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
import { formatDistanceToNow, addDays } from "date-fns";

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
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  isDCCAccountLinked: z.boolean(),
});

export default function Amazon() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isDCCAccountLinked: true,
    },
  });
  const [state, setState] = useState({
    open: false,
    shouldLinkDCCAccount: false,
    isDCCAccountLinked: false,
    isSyncingDCCs: false,
    isSyncCompleted: false,
    numberOfChildNodesReceived: 0,
  });

  const router = useRouter();

  function onSubmit() {
    router.push("/amazon/goods-listings");
  }

  function onLinkDCCAccount() {
    localStorage.setItem("isDCCAccountLinked", "true");
    setState((prev) => ({
      ...prev,
      shouldLinkDCCAccount:
        localStorage.getItem("isDCCAccountLinked") === "true",
      open: false,
    }));
  }

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isDCCAccountLinked: localStorage.getItem("isDCCAccountLinked") === "true",
      numberOfChildNodesReceived: parseInt(
        localStorage.getItem("numberOfChildNodesIssued") ?? "0"
      ),
    }));
  }, []);

  useEffect(() => {
    if (state.isDCCAccountLinked) {
      setState((prev) => ({
        ...prev,
        isSyncingDCCs: true,
      }));
    }

    // wait for 2 seconds and then set isSyncCompleted to true
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isSyncingDCCs: false,
        isSyncCompleted: true,
      }));
    }, 2000);
  }, [state.isDCCAccountLinked]);

  const watchIsDCCAccountLinked = form.watch("isDCCAccountLinked");

  useEffect(() => {
    if (watchIsDCCAccountLinked && state.shouldLinkDCCAccount) {
      localStorage.setItem("isDCCAccountLinked", "true");
    }
    if (!watchIsDCCAccountLinked && !state.shouldLinkDCCAccount) {
      localStorage.setItem("isDCCAccountLinked", "false");
    }
    setState((prev) => ({
      ...prev,
      shouldLinkDCCAccount: false,
      isSyncCompleted: localStorage.getItem("isDCCAccountLinked") === "true",
      isDCCAccountLinked: localStorage.getItem("isDCCAccountLinked") === "true",
    }));
  }, [state.shouldLinkDCCAccount, watchIsDCCAccountLinked]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-2">
        <Card>
          <CardHeader className=" lg:mt-2">
            <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
              Link DCC Account
            </CardTitle>
            <CardDescription className="sm:text-base">
              If you have not created a DCC account, please create one.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full md:w-[64%] py-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-4">
                  <FormField
                    control={form.control}
                    name="isDCCAccountLinked"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm border-primary">
                        <div className="space-y-0.5">
                          <FormLabel>Link DCC Account</FormLabel>
                          <FormDescription>
                            Linking DCC helps you get DCC badges on your listing
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
                  {form.watch("isDCCAccountLinked") && (
                    <Dialog
                      open={state.open}
                      onOpenChange={function (open) {
                        if (open && state.isDCCAccountLinked) {
                          setState((prev) => ({ ...prev, open: false }));
                        } else {
                          setState((prev) => ({ ...prev, open: open }));
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          disabled={state.isDCCAccountLinked}
                          variant={
                            state.isDCCAccountLinked ? "outline" : "default"
                          }
                        >
                          {state.isDCCAccountLinked ? (
                            <Check className="mr-2 h-4 w-4" color="green" />
                          ) : (
                            <Link2Icon className="mr-2 h-4 w-4" />
                          )}
                          Link DCC Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Link DCC account?</DialogTitle>
                          <DialogDescription>
                            Linking your DCC account to Amazon account will,{" "}
                            <b>
                              help you get DCC badges on your product listing.
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
                          <Button type="button" onClick={onLinkDCCAccount}>
                            Yes, Link Account
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
                  {!form.watch("isDCCAccountLinked") && (
                    <Button
                      type="submit"
                      className="mt-4 md:mt-0"
                      disabled={form.watch("isDCCAccountLinked")}
                    >
                      Skip
                    </Button>
                  )}
                  {form.watch("isDCCAccountLinked") && (
                    <Button
                      type="submit"
                      className="my-4  md:mt-0"
                      disabled={!state.isDCCAccountLinked}
                    >
                      Go to Product Listing
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      {state.isDCCAccountLinked && (
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
                {state.isSyncingDCCs
                  ? "Syncing DCCs..."
                  : state.isSyncCompleted
                  ? `${state.numberOfChildNodesReceived} DCCs Found`
                  : ""}
              </CardTitle>
              <CardDescription>
                It would show all vaild DCC which have not expired.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.isDCCAccountLinked && (
                <div>
                  {state.isSyncingDCCs ? (
                    <div className="flex flex-col min-h-[64vh] max-h-[64vh] items-center justify-center">
                      <h4 className="text-center pr-4">Syncing DCCs...</h4>
                      <LoadingIndicator />
                    </div>
                  ) : state.isSyncCompleted ? (
                    <ScrollArea className=" h-max rounded-md ">
                      <div className="flex flex-col">
                        {Array.from({
                          length: state.numberOfChildNodesReceived,
                        }).map((_, index) => (
                          <Card
                            key={index}
                            className="flex flex-row items-center justify-between mb-4"
                          >
                            <CardHeader className="flex flex-col">
                              <CardTitle className="text-md">
                                BUS-123456-789
                              </CardTitle>
                              <CardDescription>
                                {localStorage.getItem(
                                  `numberOfChildNodesIssued-${index + 1}`
                                )}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col align-middle space-y-2">
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(Date.now(), {
                                  addSuffix: true,
                                })}
                              </span>
                              <Badge className="w-max bg-red-600">
                                expiring in{" "}
                                {formatDistanceToNow(addDays(Date.now(), 29))}{" "}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div>Nothing Found</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
