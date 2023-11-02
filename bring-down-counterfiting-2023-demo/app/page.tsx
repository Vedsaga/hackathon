"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
export default function Home() {
  const [state, setState] = useState({
    isIRSAccountLinked: false,
    isStorageCleared: false,
  });
  const router = useRouter();
  function moveToLayer1() {
    router.push("/stakeholder-registation");
  }
  function moveToAmazon() {
    router.push("/amazon");
  }

  useEffect(() => {
    // Check if the code is running in the browser
    if (typeof window !== "undefined") {
      const isLinked = localStorage.getItem("isIRSAccountLinked") === "true";
      setState((prevState) => ({ ...prevState, isIRSAccountLinked: isLinked }));
    }
  }, []);
  useEffect(() => {
    if (state.isStorageCleared) {
      localStorage.clear();
      const isLinked = localStorage.getItem("isIRSAccountLinked") === "true";

      setState((prevState) => ({
        ...prevState,
        isStorageCleared: false,
        isIRSAccountLinked: isLinked,
      }));
    }
  }, [state.isStorageCleared]);

  function clearStorage() {
    setState((prevState) => ({
      ...prevState,
      isStorageCleared: true,
    }));
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-between p-32">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"></div>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <div className="group text-center space-y-4">
          <h1 className="text-8xl font-extrabold  leading-tight">3P2L</h1>
          <h4 className="text-4xl leading-normal mt-3 font-semibold font-mono">
            3 principles, 2 layers
            <br />
            <span className="text-xl text-[#0141ff]">
              (Distributed Responsibilty, Interconnectivity, Proactivity)
            </span>
            <br />
            <span className="text-4xl font-semibold text-gray-600">
              to Bring Down Counterfeiting
            </span>
          </h4>
        </div>
      </div>
      <div className="mt-auto grid gap-4 grid-cols-1 lg:grid-cols-4">
        <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
          onClick={moveToLayer1}
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Layer 1
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Demo of layer 1, it is record of chain of B2B trade transaction.
          </p>
        </button>
        <button
          className={`group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 ${
            !state.isIRSAccountLinked
              ? "cursor-not-allowed opacity-50 bg-gray-100"
              : ""
          }`}
          rel="noopener noreferrer"
          disabled={!state.isIRSAccountLinked}
          onClick={() => moveToAmazon()}
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Amazon
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            How DCC can be used on Marketplace
          </p>
        </button>
        <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
          onClick={moveToLayer1}
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Layer 2
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Demo of Layer 2, it is Network of Authentication App and Trademark
            Owner
          </p>
        </button>
        <button
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
          onClick={clearStorage}
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>Reset Flow</h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Reset the flow to start demo again
          </p>
        </button>
      </div>
    </main>
  );
}
