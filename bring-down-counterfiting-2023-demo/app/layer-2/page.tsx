"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  CopyIcon,
  DollarSignIcon,
  ScanLineIcon,
  ThumbsUp,
  XOctagon,
} from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Layer2() {
  const [state, setState] = useState({
    isVaildScanView: false,
    isInvalidScanView: false,
  });

  function handleValidScan() {
    setState({
      ...state,
      isVaildScanView: true,
      isInvalidScanView: false,
    });
  }

  function handleInvalidScan() {
    setState({
      ...state,
      isVaildScanView: false,
      isInvalidScanView: true,
    });
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-2">
        <Card className="flex flex-col min-h-[80vh] max-h-[80vh]">
          <CardHeader>
            <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
              Scan a UIT
              <span className=" text-xl font-mono">(QR code, NFC, RFID)</span>
            </CardTitle>
            <CardDescription>
              UIT refers to Unique Identifier Technology such as QR code, NFC,
              or RFID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[48vh] flex-col flex justify-center items-center space-y-8">
              <Button
                onClick={handleValidScan}
                variant={"outline"}
                className="hover:bg-primary hover:text-cyan-50"
              >
                <CheckCircle className="  mr-2 " />
                Vaild Scan
              </Button>
              <Button
                onClick={handleInvalidScan}
                variant={"outline"}
                className="border-red-600 hover:bg-red-600 hover:text-cyan-50"
              >
                <XOctagon className="  mr-2" />
                Invalid Scan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-3">
        {state.isVaildScanView && (
          <Card className="flex flex-col min-h-[80vh] max-h-[80vh]">
            <CardHeader>
              <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
                Vaild Scan Result
              </CardTitle>
              <CardDescription>
                Result coming from Trademark Owner Server, confirming if scan is
                valid or not.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-start  max-h-[56vh] mt-8  space-x-8 ">
              <Image
                className=" max-w-[32vh] object-cover rounded-lg"
                src="/nike-vapor-vertical-crop.png"
                alt="Nike Vapor"
                width={200}
                height={400}
              />
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold">
                  Nike ZoomX Vaporfly NEXT
                </h2>
                <Badge
                  variant="default"
                  className="text-base bg-green-100 font-bold font-mono w-max pr-4 py-2 mt-2 text-primary"
                >
                  <CheckCircle className="text-green-600  mr-4" />

                  {uuidv4()}
                </Badge>

                <span className="mt-4 text-sm text-muted-foreground">
                  The Nike ZoomX Vaporfly NEXT is the fast you&apos;ve never
                  seen—or felt—before. By combining our two most innovative
                  technologies, Nike ZoomX foam and VaporWeave material,
                  it&apos;s the fastest shoe we&apos;ve ever made. Scroll down
                  to learn more about the future of racing shoes.
                </span>
                <div className="mt-4">
                  <Badge
                    variant="outline"
                    className="text-lg font-bold font-mono text-muted-foreground"
                  >
                    <DollarSignIcon className="mr-1" />
                    199.99
                  </Badge>
                  <div className="flex flex-row space-x-4 mt-4">
                    <Button variant={"outline"}>
                      <ThumbsUp className="mr-2" /> Okay
                    </Button>
                    <Button
                      size={"default"}
                      className="bg-[#0141ff] text-white rounded-lg"
                    >
                      <ScanLineIcon className="mr-2" />
                      Next Scan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {state.isInvalidScanView && (
          <Card className="flex flex-col min-h-[80vh] max-h-[80vh]">
            <CardHeader>
              <CardTitle className="sm:text-lg md:text-2xl lg:text-3xl">
                Invaild Scan Result
              </CardTitle>
              <CardDescription>
                Result coming from Trademark Owner Server, confirming if scan is
                valid or not.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center max-h-[56vh]  mt-8 space-y-2">
              <Badge
                variant="default"
                className="text-base bg-red-100 font-bold font-mono w-max pr-4 py-2 mt-2 text-primary mb-4"
              >
                <XOctagon className="   mr-2" color="#CE3A0B" />
                {uuidv4()}
              </Badge>
              <h2 className="text-2xl font-semibold text-slate-600">
                <span className="text-[#CE3A0B]">Alert! </span> No Matching
                Record Found.
              </h2>
              <span className=" text-sm text-muted-foreground max-w-[56vh] text-center">
                Brand was not able match the record. Please immediately report
                to the enforcement agency.
              </span>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={"default"}
                    size={"lg"}
                    className="bg-[#0141ff]"
                  >
                    <svg
                      width="20"
                      height="18"
                      viewBox="0 0 20 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-4"
                    >
                      <path
                        d="M19 9.22C19 3.73 14.74 0 10 0C5.31 0 1 3.65 1 9.28C0.4 9.62 0 10.26 0 11V13C0 14.1 0.9 15 2 15C2.55 15 3 14.55 3 14V9.19C3 5.36 5.95 2.01 9.78 1.9C10.7174 1.87149 11.6509 2.03143 12.5253 2.37034C13.3997 2.70925 14.1972 3.22024 14.8705 3.87301C15.5438 4.52579 16.0792 5.30707 16.445 6.17057C16.8108 7.03407 16.9995 7.96222 17 8.9V16H10C9.45 16 9 16.45 9 17C9 17.55 9.45 18 10 18H17C18.1 18 19 17.1 19 16V14.78C19.59 14.47 20 13.86 20 13.14V10.84C20 10.14 19.59 9.53 19 9.22Z"
                        fill="white"
                      />
                      <path
                        d="M7 11C7.55228 11 8 10.5523 8 10C8 9.44772 7.55228 9 7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11Z"
                        fill="white"
                      />
                      <path
                        d="M13 11C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9C12.4477 9 12 9.44772 12 10C12 10.5523 12.4477 11 13 11Z"
                        fill="white"
                      />
                      <path
                        d="M16 8.03C15.7615 6.62414 15.0334 5.34797 13.9444 4.42738C12.8555 3.5068 11.4759 3.00117 10.05 3C7.01997 3 3.75997 5.51 4.01997 9.45C5.2531 8.94539 6.34221 8.14349 7.1902 7.11578C8.03818 6.08808 8.61869 4.86652 8.87997 3.56C10.19 6.19 12.88 8 16 8.03Z"
                        fill="white"
                      />
                    </svg>
                    Report to authority
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Location of the Invaild Scan</DialogTitle>
                    <DialogDescription>
                      Location is anonymous not link to user profile.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="latitude" autoFocus={false}>
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        defaultValue="38.07767"
                        readOnly
                        autoFocus={false}
                      />
                    </div>
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="longitude" autoFocus={false}>
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        defaultValue="-101.30536"
                        readOnly
                        autoFocus={false}
                      />
                    </div>
                  </div>
                  <DialogFooter >
                    <DialogClose asChild>
                      <Button type="button" variant="destructive">
                        <svg
                          width="20"
                          height="18"
                          viewBox="0 0 20 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-4"
                        >
                          <path
                            d="M19 9.22C19 3.73 14.74 0 10 0C5.31 0 1 3.65 1 9.28C0.4 9.62 0 10.26 0 11V13C0 14.1 0.9 15 2 15C2.55 15 3 14.55 3 14V9.19C3 5.36 5.95 2.01 9.78 1.9C10.7174 1.87149 11.6509 2.03143 12.5253 2.37034C13.3997 2.70925 14.1972 3.22024 14.8705 3.87301C15.5438 4.52579 16.0792 5.30707 16.445 6.17057C16.8108 7.03407 16.9995 7.96222 17 8.9V16H10C9.45 16 9 16.45 9 17C9 17.55 9.45 18 10 18H17C18.1 18 19 17.1 19 16V14.78C19.59 14.47 20 13.86 20 13.14V10.84C20 10.14 19.59 9.53 19 9.22Z"
                            fill="white"
                          />
                          <path
                            d="M7 11C7.55228 11 8 10.5523 8 10C8 9.44772 7.55228 9 7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11Z"
                            fill="white"
                          />
                          <path
                            d="M13 11C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9C12.4477 9 12 9.44772 12 10C12 10.5523 12.4477 11 13 11Z"
                            fill="white"
                          />
                          <path
                            d="M16 8.03C15.7615 6.62414 15.0334 5.34797 13.9444 4.42738C12.8555 3.5068 11.4759 3.00117 10.05 3C7.01997 3 3.75997 5.51 4.01997 9.45C5.2531 8.94539 6.34221 8.14349 7.1902 7.11578C8.03818 6.08808 8.61869 4.86652 8.87997 3.56C10.19 6.19 12.88 8 16 8.03Z"
                            fill="white"
                          />
                        </svg>
                        Report to authority
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
