"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Check, Link2Icon } from "lucide-react";

const formSchema = z.object({
  fullname: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  haveBusinessTIN: z.boolean(),
  tin: z.string(),
  businessTIN: z.string(),
});

export default function TrademarkOwnerRegistation() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "John Doe",
      email: "john@doe.com",
      phone: "+1234567890",
      address: "123 Main St",
      haveBusinessTIN: true,
      tin: "TAX-ID-123456789",
      businessTIN: "BUS-TAX-ID-123456",
    },
  });
  const router = useRouter();

  function onSubmit() {
    localStorage.setItem(
      "haveBusinessTIN",
      form.getValues("haveBusinessTIN").toString()
    );
    router.push("/link-uspto");
  }

  const [state, setState] = useState({
    open: false,
    shouldLinkIRSAccount: false,
    isIRSAccountLinked: false,
    shouldShowLinkIRSAccountButton: false,
  });

  useEffect(() => {
    const isIRSAccountLinked =
      localStorage.getItem("isIRSAccountLinked") === "true";
    setState((prev) => ({
      ...prev,
      isIRSAccountLinked: isIRSAccountLinked,
      shouldShowLinkIRSAccountButton: !isIRSAccountLinked,
    }));
  }, []);

  const watchHaveBusinessTIN = form.watch("haveBusinessTIN");

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      shouldShowLinkIRSAccountButton: true,
    }));
  }, [watchHaveBusinessTIN]);

  function onLinkIRSAccount() {
    setState((prev) => ({
      ...prev,
      shouldLinkIRSAccount: true,
      open: false,
    }));
  }

  useEffect(() => {
    if (!state.shouldLinkIRSAccount) {
      return;
    }
    localStorage.setItem("isIRSAccountLinked", "true");
    setState((prev) => ({
      ...prev,
      shouldShowLinkIRSAccountButton: false,
      shouldLinkIRSAccount: false,
      isIRSAccountLinked: localStorage.getItem("isIRSAccountLinked") === "true",
    }));
  }, [state.shouldLinkIRSAccount]);

  useEffect(() => {
    if (state.shouldShowLinkIRSAccountButton) {
      localStorage.setItem("isIRSAccountLinked", "false");
    }
    setState((prev) => ({
      ...prev,
      isIRSAccountLinked: localStorage.getItem("isIRSAccountLinked") === "true",
    }));
  }, [state.shouldShowLinkIRSAccountButton]);

  return (
    <Card className="flex flex-col min-h-[80vh]">
      <CardHeader className=" lg:mt-2">
        <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
          Trademark Owner Registation
        </CardTitle>
        <CardDescription className="sm:text-base"></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:w-[64%] py-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="fullname"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} readOnly={true} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="phone" {...field} readOnly={true} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="address" {...field} readOnly={true} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-4">
                <FormField
                  control={form.control}
                  name="haveBusinessTIN"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>
                          Bussiness Tax Identification Number
                        </FormLabel>
                        <FormDescription>
                          do you have bussiness tax identification number?
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
                {state.shouldShowLinkIRSAccountButton && (
                  <Dialog
                    open={state.open}
                    onOpenChange={function (open) {
                      setState((prev) => ({ ...prev, open: open }));
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        disabled={state.isIRSAccountLinked}
                        variant={
                          state.isIRSAccountLinked ? "outline" : "default"
                        }
                      >
                        {state.isIRSAccountLinked ? (
                          <Check className="mr-2 h-4 w-4" color="green" />
                        ) : (
                          <Link2Icon className="mr-2 h-4 w-4" />
                        )}
                        {form.watch("haveBusinessTIN")
                          ? "Link IRS Business Account"
                          : "Link IRS Individual Account"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          {" "}
                          {form.watch("haveBusinessTIN")
                            ? "Link IRS Business Account?"
                            : "Link IRS Individual Account?"}
                        </DialogTitle>
                        <DialogDescription>
                          Linking your IRS account to DCC account will way to
                          prove
                          <b>you have authorized business in US.</b>
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
                        <Button type="button" onClick={onLinkIRSAccount}>
                          Yes, Link Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              {form.watch("haveBusinessTIN") && state.isIRSAccountLinked && (
                <FormField
                  control={form.control}
                  name="businessTIN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Tax Identification Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="businessTIN"
                          {...field}
                          readOnly={true}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!form.watch("haveBusinessTIN") && state.isIRSAccountLinked && (
                <FormField
                  control={form.control}
                  name="tin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Identification Number</FormLabel>
                      <FormControl>
                        <Input placeholder="TIN" {...field} readOnly={true} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <Button
              type="submit"
              className="mt-4"
              disabled={!state.isIRSAccountLinked}
            >
              Submit & Next
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
