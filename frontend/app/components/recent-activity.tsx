
import { ArrowDownToLine, ArrowUpFromLine, Banknote } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Activity = {
  id: number;
  type: "buy" | "sell" | "dividend";
  symbol: string;
  shares?: number;
  price?: number;
  amount?: number;
  date: string;
};

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
  style?: React.CSSProperties;
}

export function RecentActivity({ activities, className, style }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "buy":
        return (
          <div className="rounded-full p-2 bg-green-100 dark:bg-green-900">
            <ArrowDownToLine className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        );
      case "sell":
        return (
          <div className="rounded-full p-2 bg-red-100 dark:bg-red-900">
            <ArrowUpFromLine className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
        );
      case "dividend":
        return (
          <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900">
            <Banknote className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case "buy":
        return `Bought ${activity.shares} shares of ${activity.symbol} at $${activity.price?.toFixed(2)}`;
      case "sell":
        return `Sold ${activity.shares} shares of ${activity.symbol} at $${activity.price?.toFixed(2)}`;
      case "dividend":
        return `Received $${activity.amount?.toFixed(2)} dividend from ${activity.symbol}`;
      default:
        return "";
    }
  };

  return (
    <Card className={className} style={style}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest portfolio transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              {getActivityIcon(activity.type)}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getActivityDescription(activity)}
                </p>
              </div>
              <div className="text-sm">{formatDate(activity.date)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
