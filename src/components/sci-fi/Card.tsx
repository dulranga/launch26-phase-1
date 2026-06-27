import { Card } from "../ui/card";


function SciFiCard({
  children,
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div className="stretch-middle-only px-8 pt-4 pb-8">
      <Card {...props} className="bg-transparent border-none ring-0">
        {children}
      </Card>
    </div>
  );
}

export default SciFiCard;
