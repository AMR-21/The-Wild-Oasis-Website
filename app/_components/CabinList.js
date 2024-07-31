import { getCabins } from "../_lib/data-service";
import CabinCard from "./CabinCard";

export async function CabinList({ filter }) {
  const cabins = await getCabins();

  if (!cabins.length) return null;

  let displayedCabins;

  if (filter === "all") displayedCabins = cabins;

  if (filter === "small")
    displayedCabins = cabins.filter(
      (c) => c.maxCapacity <= 3 && c.maxCapacity > 1
    );

  if (filter === "medium")
    displayedCabins = cabins.filter(
      (c) => c.maxCapacity <= 7 && c.maxCapacity > 3
    );

  if (filter === "large")
    displayedCabins = cabins.filter((c) => c.maxCapacity > 7);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
