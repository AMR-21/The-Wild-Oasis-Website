import { getCabin, getCabins } from "../../_lib/data-service";
import { Cabin } from "../../_components/Cabin";
import { Reservation } from "../../_components/Reservation";
import Spinner from "../../_components/Spinner";
import { Suspense } from "react";

export async function generateMetadata({ params: { cabinId } }) {
  const { name } = await getCabin(cabinId);

  return {
    title: `Cabin ${name}`,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  return cabins.map(({ id }) => ({ cabinId: `${id}` }));
}

export default async function Page({ params: { cabinId } }) {
  const cabin = await getCabin(cabinId);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center text-accent-400 mb-10">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
      </div>

      <Suspense fallback={<Spinner />}>
        <Reservation cabin={cabin} />
      </Suspense>
    </div>
  );
}
