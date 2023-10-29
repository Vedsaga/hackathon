"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckIcon,
  CopyIcon,
  FolderRoot,
  Link,
  PlusIcon,
  SeparatorHorizontalIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow, addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";

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
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  goodsName: z.string(),
  batchNo: z.string(),
  isUSBased: z.boolean().default(true),
  manufacturingPlantLocation: z.string(),
});

const goodsDrafts = [
  {
    label: "Nike ZoomX Vaporfly NEXT",
    value: "1",
    trademarkCount: 2,
  },
  {
    label: "Nike ZoomX Vaporfly NEXT",
    value: "2",
    trademarkCount: 2,
  },
] as const;

export default function Dashboard() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goodsName: "1",
      batchNo: "B1A2T3C4H5",
      isUSBased: true,
      manufacturingPlantLocation: "Grand Rapids, MI",
    },
  });
  const [state, setState] = useState({
    isTrademarkOwner: false,
    isUSPTOLinked: false,
    goodsCount: 0,
    numberOfParentNodes: 0,
    numberOfChildNodesIssued: 0,
    numberOfChildNodesReceived: 0,
    activeTab: "none",
    openSheet: false,
    opneDialog: false,
    shouldCreateParentNode: false,
    shouldIssueChildNode: false,
    isParentNodeSelected: false,
    selectedParentNodeCount: 0,
  });

  const watchIsUSBased = form.watch("isUSBased");
  useEffect(() => {
    if (!watchIsUSBased) {
      form.setValue(
        "manufacturingPlantLocation",
        "Noida - Greater Noida - Yamuna Expressway, India"
      );

      return;
    }
    form.setValue("manufacturingPlantLocation", "Grand Rapids, MI, USA");
  }, [form, watchIsUSBased]);

  useEffect(() => {
    if (!(localStorage.getItem("isIRSAccountLinked") === "true")) {
      setState((prev) => ({
        ...prev,
        isTrademarkOwner: false,
      }));
    }
    if (localStorage.getItem("isUSPTOLinked") === "true") {
      setState((prev) => ({
        ...prev,
        isUSPTOLinked: true,
        goodsCount: parseInt(localStorage.getItem("goodsCount") ?? "0"),
        numberOfParentNodes: parseInt(
          localStorage.getItem("numberOfParentNodes") ?? "0"
        ),
        numberOfChildNodesIssued: parseInt(
          localStorage.getItem("numberOfChildNodesIssued") ?? "0"
        ),
        activeTab: "parentNode",
      }));
    } else {
      setState((prev) => ({
        ...prev,
        isUSPTOLinked: false,
        numberOfChildNodesIssued: parseInt(
          localStorage.getItem("numberOfChildNodesIssued") ?? "0"
        ),
        numberOfChildNodesReceived: parseInt(
          localStorage.getItem("numberOfChildNodesReceived") ?? "0"
        ),
        activeTab: "childNode",
      }));
    }
  }, []);

  function onTabValueChange(value: string): void {
    if (value === "none") {
      return;
    }
    if (value === "parentNode" && state.isUSPTOLinked === false) {
      return;
    }

    if (value === "parentNode") {
      setState((prev) => ({
        ...prev,
        activeTab: "parentNode",
      }));
    }
    if (value === "childNode") {
      setState((prev) => ({
        ...prev,
        activeTab: "childNode",
      }));
    }
  }

  function onCreateParentNode() {
    setState((prev) => ({
      ...prev,
      shouldCreateParentNode: true,
      openSheet: false,
    }));
  }
  function onIssueChildNode() {
    setState((prev) => ({
      ...prev,
      shouldIssueChildNode: true,
      opneDialog: false,
    }));
  }

  useEffect(() => {
    if (state.shouldCreateParentNode) {
      localStorage.setItem(
        "numberOfParentNodes",
        (
          parseInt(localStorage.getItem("numberOfParentNodes") ?? "0") + 1
        ).toString()
      );
      setState((prev) => ({
        ...prev,
        shouldCreateParentNode: false,
        numberOfParentNodes: parseInt(
          localStorage.getItem("numberOfParentNodes") ?? "0"
        ),
      }));
    }
  }, [state.numberOfChildNodesIssued, state.shouldCreateParentNode]);
  useEffect(() => {
    if (state.shouldIssueChildNode) {
      const count = localStorage.getItem("numberOfChildNodesIssued") ?? "0";
      const newCount = parseInt(count) + 1;
      localStorage.setItem("numberOfChildNodesIssued", newCount.toString());
      localStorage.setItem(`numberOfChildNodesIssued-${newCount}`, uuidv4());
      setState((prev) => ({
        ...prev,
        shouldIssueChildNode: false,
        numberOfChildNodesIssued: newCount,
      }));
    }
  }, [state.numberOfChildNodesIssued, state.shouldIssueChildNode]);

  return (
    <Tabs
      defaultValue={state.activeTab}
      onValueChange={onTabValueChange}
      value={state.activeTab}
    >
      <TabsList className="flex justify-center py-6 space-x-4 max-w-sm mb-8">
        <TabsTrigger
          value="parentNode"
          className="text-sm md:text-base sm:px-4 md:px-8  py-2 flex items-center"
          disabled={!state.isUSPTOLinked}
        >
          <div className="flex items-center justify-center">
            <FolderRoot className="md:mr-2 h-5 w-5" />
            <span className="sm:block hidden">Parent Node</span>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="childNode"
          className="text-sm md:text-base sm:px-4 md:px-8  py-2 flex items-center"
        >
          <div className="flex items-center justify-center">
            <Link className="md:mr-2 h-5 w-5" />
            <span className="sm:block hidden">Child Node</span>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="parentNode">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="col-span-2">
            <Card className="flex flex-col min-h-[80vh] max-h-[80vh]">
              <CardHeader>
                <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
                  Parent Nodes
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                {state.numberOfParentNodes > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    <Sheet
                      open={state.openSheet}
                      onOpenChange={function (open) {
                        if (open && state.shouldCreateParentNode) {
                          setState((prev) => ({ ...prev, open: false }));
                        } else {
                          setState((prev) => ({ ...prev, open: open }));
                        }
                      }}
                    >
                      <SheetTrigger asChild>
                        <Button variant={"outline"}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          New Parent Node
                        </Button>
                      </SheetTrigger>
                      <SheetContent side={"bottom"} className="h-[80vh]">
                        <SheetHeader>
                          <SheetTitle>Add Goods</SheetTitle>
                          <SheetDescription></SheetDescription>
                        </SheetHeader>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onCreateParentNode)}
                            className="w-full md:w-[64%] py-2"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                              <FormField
                                control={form.control}
                                name="goodsName"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Goods Name</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                              " justify-between",
                                              !field.value &&
                                                "text-muted-foreground "
                                            )}
                                          >
                                            {goodsDrafts.find(
                                              (goods) =>
                                                goods.value === field.value
                                            )?.label ?? "Select goods"}
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
                                            No Goods found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {goodsDrafts.map((goods, index) => (
                                              <CommandItem
                                                className="w-[100%] mb-2"
                                                value={goods.label}
                                                key={index}
                                                onSelect={() => {
                                                  form.setValue(
                                                    "goodsName",
                                                    goods.value
                                                  );
                                                }}
                                              >
                                                {goods.label}
                                                <CheckIcon
                                                  className={cn(
                                                    "ml-auto h-4 w-4",
                                                    field.value === goods.value
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
                                      {goodsDrafts.find(
                                        (goods) => goods.value === field.value
                                      )?.trademarkCount +
                                        " trademarks linked to this goods" ??
                                        ""}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="batchNo"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Batch Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Batch Number"
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
                                name="isUSBased"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border px-3 shadow-sm">
                                    <div className="space-y-0.5">
                                      <FormLabel>Manufactured in USA</FormLabel>
                                      <FormDescription>
                                        does this batch of goods being produced
                                        in the USA?
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
                              <FormField
                                control={form.control}
                                name="manufacturingPlantLocation"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Manufacturing Plant Location"
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
                              <FolderRoot className="md:mr-2 h-5 w-5" />
                              Create Parent Node
                            </Button>
                          </form>
                        </Form>
                        <SheetFooter></SheetFooter>
                      </SheetContent>
                    </Sheet>
                    <ScrollArea className="h-[54vh] rounded-md mt-4">
                      {
                        <div className="flex flex-col space-y-4 my-4 px-2">
                          {Array.from(
                            { length: state.numberOfParentNodes },
                            (_, index) => {
                              return (
                                <div
                                  key={index}
                                  className={`cursor-pointer mr-4 ${
                                    state.selectedParentNodeCount ===
                                      index + 1 &&
                                    "border-4 rounded-lg border-stale-300"
                                  }`}
                                  onClick={() => {
                                    setState((prev) => ({
                                      ...prev,
                                      isParentNodeSelected: true,
                                      selectedParentNodeCount: index + 1,
                                    }));
                                  }}
                                  onKeyDown={(event) => {
                                    // Reacting to the "Enter" key for accessibility
                                    if (event.key === "Enter") {
                                      setState((prev) => ({
                                        ...prev,
                                        isParentNodeSelected: true,
                                        selectedParentNodeCount: index + 1,
                                      }));
                                    }
                                  }}
                                >
                                  <Card
                                    key={index}
                                    className="flex flex-row items-start pr-4 shadow-md hover:shadow-2xl transition-shadow duration-300"
                                  >
                                    <CardHeader className="relative items-start overflow-hidden h-[24vh] w-[24vh] ">
                                      <Image
                                        className="pb-4"
                                        src={"/nike-vapor-vertical-crop.png"}
                                        alt={"goods"}
                                        layout="fill"
                                        objectFit="contain"
                                      />
                                    </CardHeader>
                                    <CardContent className="mt-5 overflow-ellipsis">
                                      <div className="flex flex-col items-start ">
                                        <h4 className="font-bold">
                                          {form.getValues("batchNo")}
                                        </h4>
                                        <br />
                                        <span className="text-sm text-muted-foreground">
                                          {formatDistanceToNow(Date.now(), {
                                            addSuffix: true,
                                          })}
                                        </span>
                                        <span className="text-sm mt-2">
                                          Nike ZoomX Vaporfly NEXT
                                        </span>
                                        <span className="text-sm mt-1 text-muted-foreground overflow-hidden line-clamp-2">
                                          The Nike ZoomX Vaporfly NEXT is the
                                          &nbsp;fast you&apos;ve never seen—or
                                          felt—before. By combining our two most
                                          innovative technologies, Nike ZoomX
                                          foam and VaporWeave material,
                                          it&apos;s the fastest shoe we&apos;ve
                                          ever made. Scroll down to learn more
                                          about the future of racing shoes.
                                        </span>
                                      </div>
                                      <Badge className="mt-2 mr-4 bg-sky-500">
                                        2 trademarks
                                      </Badge>
                                      <Badge>
                                        {state.numberOfChildNodesIssued} node
                                        issued
                                      </Badge>
                                    </CardContent>
                                  </Card>
                                </div>
                              );
                            }
                          )}
                        </div>
                      }
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="flex flex-col min-h-[40vh] items-center justify-center">
                    <h4 className="text-center pr-4 text-muted-foreground">
                      No Parent Found <br className="mb-4" />
                      <Sheet
                        open={state.openSheet}
                        onOpenChange={function (open) {
                          if (open && state.shouldCreateParentNode) {
                            setState((prev) => ({ ...prev, openSheet: false }));
                          } else {
                            setState((prev) => ({ ...prev, openSheet: open }));
                          }
                        }}
                      >
                        <SheetTrigger asChild>
                          <Button variant={"default"}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Create Parent Node
                          </Button>
                        </SheetTrigger>
                        <SheetContent side={"bottom"} className="h-[80vh]">
                          <SheetHeader>
                            <SheetTitle>Add Goods</SheetTitle>
                            <SheetDescription></SheetDescription>
                          </SheetHeader>
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onCreateParentNode)}
                              className="w-full md:w-[64%] py-2"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <FormField
                                  control={form.control}
                                  name="goodsName"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <FormLabel>Goods Name</FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <FormControl>
                                            <Button
                                              variant="outline"
                                              role="combobox"
                                              className={cn(
                                                " justify-between",
                                                !field.value &&
                                                  "text-muted-foreground "
                                              )}
                                            >
                                              {goodsDrafts.find(
                                                (goods) =>
                                                  goods.value === field.value
                                              )?.label ?? "Select goods"}
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
                                              No Goods found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              {goodsDrafts.map(
                                                (goods, index) => (
                                                  <CommandItem
                                                    className="w-[100%] mb-2"
                                                    value={goods.label}
                                                    key={index}
                                                    onSelect={() => {
                                                      form.setValue(
                                                        "goodsName",
                                                        goods.value
                                                      );
                                                    }}
                                                  >
                                                    {goods.label}
                                                    <CheckIcon
                                                      className={cn(
                                                        "ml-auto h-4 w-4",
                                                        field.value ===
                                                          goods.value
                                                          ? "opacity-100"
                                                          : "opacity-0"
                                                      )}
                                                    />
                                                  </CommandItem>
                                                )
                                              )}
                                            </CommandGroup>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>
                                      <FormDescription>
                                        {goodsDrafts.find(
                                          (goods) => goods.value === field.value
                                        )?.trademarkCount +
                                          " trademarks linked to this goods" ??
                                          ""}
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="batchNo"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Batch Number</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Batch Number"
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
                                  name="isUSBased"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border px-3 shadow-sm">
                                      <div className="space-y-0.5">
                                        <FormLabel>
                                          Manufactured in USA
                                        </FormLabel>
                                        <FormDescription>
                                          does this batch of goods being
                                          produced in the USA?
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
                                <FormField
                                  control={form.control}
                                  name="manufacturingPlantLocation"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Manufacturing Plant Location"
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
                                <FolderRoot className="md:mr-2 h-5 w-5" />
                                Create Parent Node
                              </Button>
                            </form>
                          </Form>
                          <SheetFooter></SheetFooter>
                        </SheetContent>
                      </Sheet>
                    </h4>
                  </div>
                )}
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
          <div className="col-span-3">
            {state.numberOfParentNodes > 0 && (
              <Card className="flex flex-col min-h-[80vh] max-h-[80vh]">
                <CardHeader>
                  <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
                    Node Details
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  {state.isParentNodeSelected ? (
                    <div className="flex flex-col">
                      <Dialog
                        open={state.opneDialog}
                        onOpenChange={function (open) {
                          if (open && state.shouldIssueChildNode) {
                            setState((prev) => ({
                              ...prev,
                              opneDialog: false,
                            }));
                          } else {
                            setState((prev) => ({
                              ...prev,
                              opneDialog: open,
                            }));
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant={"outline"}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Child Node
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Create Child Node</DialogTitle>
                            <DialogDescription>
                              Please enter the DCC Unique ID of the business
                              counterpart who is buying.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                              <Label htmlFor="dccUniqueID" className="sr-only">
                                DCC Unique ID
                              </Label>
                              <Input
                                id="dccUniqueID"
                                defaultValue="BUS-123456-789"
                                readOnly
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                Close
                              </Button>
                            </DialogClose>
                            <Button
                              type="button"
                              variant="default"
                              onClick={onIssueChildNode}
                            >
                              Issue Child Node
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      {state.numberOfChildNodesIssued > 0 ? (
                        <div>
                          <ScrollArea className="h-[54vh] rounded-md mt-4">
                            {Array.from({
                              length: state.numberOfChildNodesIssued,
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
                                  <Badge className="w-max">
                                    expiring in{" "}
                                    {formatDistanceToNow(
                                      addDays(Date.now(), 29)
                                    )}{" "}
                                  </Badge>
                                </CardContent>
                              </Card>
                            ))}
                          </ScrollArea>
                        </div>
                      ) : (
                        <div className="flex flex-col min-h-[40vh] items-center justify-center">
                          <h4 className="text-center pr-4 text-muted-foreground">
                            No Child Nodes Found
                            <br className="mb-4"></br>
                            <Dialog
                              open={state.opneDialog}
                              onOpenChange={function (open) {
                                if (open && state.shouldIssueChildNode) {
                                  setState((prev) => ({
                                    ...prev,
                                    opneDialog: false,
                                  }));
                                } else {
                                  setState((prev) => ({
                                    ...prev,
                                    opneDialog: open,
                                  }));
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="default">
                                  {" "}
                                  <PlusIcon className="mr-2 h-4 w-4" />
                                  Create Child Node
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Create Child Node</DialogTitle>
                                  <DialogDescription>
                                    Please enter the DCC Unique ID of the
                                    business counterpart who is buying.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center space-x-2">
                                  <div className="grid flex-1 gap-2">
                                    <Label
                                      htmlFor="dccUniqueID"
                                      className="sr-only"
                                    >
                                      DCC Unique ID
                                    </Label>
                                    <Input
                                      id="dccUniqueID"
                                      defaultValue="BUS-123456-789"
                                      readOnly
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                      Close
                                    </Button>
                                  </DialogClose>
                                  <Button
                                    type="button"
                                    variant="default"
                                    onClick={onIssueChildNode}
                                  >
                                    Issue Child Node
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </h4>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col min-h-[40vh] items-center justify-center">
                      <h4 className="text-center pr-4 text-muted-foreground">
                        Please select a node to see details
                      </h4>
                    </div>
                  )}
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="childNode">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="col-span-2">
            <Card className="flex flex-col min-h-[80vh] max-h-[80vh]">
              <CardHeader>
                <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
                  Child Nodes
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
          <div className="col-span-3">
            <Card className="flex flex-col min-h-[80vh] max-h-[80vh]">
              <CardHeader>
                <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
                  Node Details
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
