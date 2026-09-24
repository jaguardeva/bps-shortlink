import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Head } from "@inertiajs/react";

export default function Welcome() {
    return (
        <MainLayout>
            <Head title="Home" />

            <section className="w-full">
                <div className="w-full max-w-[1240px] mx-auto">
                    <Button>Ini Tombol</Button>

                    <Input placeholder="Input" />
                </div>
            </section>
        </MainLayout>
    );
}
