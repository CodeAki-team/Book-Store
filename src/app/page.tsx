import Heroslider from "@/components/Heroslider";
import TopProducts from "@/components/Topproducts";
import { getTopRatedBooks } from "@/lib/get-topratedbooks";

export default async function Home() {
  const topRatedBooks = await getTopRatedBooks();
  return (
    <main className="min-h-[85vh] flex flex-col  justify-center items-center pt-8 bg-gray-100">
      <Heroslider />
      <TopProducts products={topRatedBooks} />
    </main>
  );
}
