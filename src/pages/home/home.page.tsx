import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";


export default function HomePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-red-400 underline">Home</h1>
            <Button>Click me</Button>
            <Label>Label</Label>
        </div>
    )
}