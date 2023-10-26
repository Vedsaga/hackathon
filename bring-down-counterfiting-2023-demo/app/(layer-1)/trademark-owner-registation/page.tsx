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
              <FormField
                control={form.control}
                name="haveBusinessTIN"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Bussiness Tax Identification Number</FormLabel>
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
              {form.watch("haveBusinessTIN") && (
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
              {!form.watch("haveBusinessTIN") && (
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
            <Button type="submit" className="mt-4">
              Submit & Next
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
