import Heroslider from "@/components/Heroslider";
import TopProducts from "@/components/Topproducts";
import { getTopRatedBooks } from "@/lib/get-topratedbooks";
import Authorscard from "@/components/AuthorsCard";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default async function Home() {
    const products = await getTopRatedBooks();
    
  
    return (
        <main className="min-h-[85vh] flex flex-col  justify-center items-center pt-8 bg-gray-100">
            <Heroslider />
            <TopProducts products={products} />
            <Authorscard />
     





    <section className="py-12  dark:bg-zinc-900">
      <div className="container px-4 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">
            Featured Books
          </h2>
          <Link href="/products">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                  {product.title}
                </h3>
                <p className="text-green-600 font-medium">{product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

        </main>
    );
}
