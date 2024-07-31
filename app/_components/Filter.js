"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Filter() {
  return (
    <div className="border border-primary-800 flex">
      <Button filter={"all"}>All cabins</Button>
      <Button filter={"small"}>2&mdash;3 guests</Button>
      <Button filter={"medium"}>4&mdash;7 guests</Button>
      <Button filter={"large"}>8&mdash;12 guests</Button>
    </div>
  );
}

function Button({ filter, children }) {
  const activeFilter = useSearchParams().get("capacity") ?? "all";
  const router = useRouter();
  const pathname = usePathname();

  function handleClick() {
    const params = new URLSearchParams();
    params.set("capacity", filter);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
