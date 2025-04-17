import Heroslider from "@/components/Heroslider";
import Authorscard from "@/components/AuthorsCard";

export default function Home() {
    return (
        <main className="min-h-[85vh] bg-gray-100 pt-8">
            <div className="flex flex-col items-center gap-12">
                <Heroslider />
                <Authorscard />
            </div>
        </main>
    );
}
