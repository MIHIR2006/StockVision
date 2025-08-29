'use client';

import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "./ui/card";
import { ChartTooltip } from "./ui/chart";

// Mock data for treasury bills
const treasuryBills = [
  {
    name: "U.S. 1 Month Treasury Bill",
    last: "4.293%",
    change: "0.00",
    isPositive: true,
    chartData: [
      { time: "6pm", value: 4.295 },
      { time: "7pm", value: 4.29 },
      { time: "8pm", value: 4.31 },
      { time: "9pm", value: 4.306 },
      { time: "10pm", value: 4.308 },
      { time: "11pm", value: 4.305 },
      { time: "12am", value: 4.302 },
      { time: "1am", value: 4.295 },
      { time: "2am", value: 4.301 },
      { time: "3am", value: 4.3 },
      { time: "4am", value: 4.298 },
      { time: "5am", value: 4.299 },
      { time: "6am", value: 4.297 },
      { time: "7am", value: 4.295 },
      { time: "8am", value: 4.294 },
      { time: "9am", value: 4.297 },
      { time: "10am", value: 4.305 },
      { time: "11am", value: 4.302 },
      { time: "12pm", value: 4.301 },
      { time: "1pm", value: 4.3 },
      { time: "2pm", value: 4.298 },
      { time: "3pm", value: 4.293 },
    ],
  },
  {
    name: "U.S. 3 Month Treasury Bill",
    last: "4.328%",
    change: "0.00",
    isPositive: true,
  },
  {
    name: "U.S. 6 Month Treasury Bill",
    last: "4.206%",
    change: "0.00",
    isPositive: true,
  },
  {
    name: "U.S. 1 Year Treasury Bill",
    last: "4.042%",
    change: "0.00",
    isPositive: true,
  },
  {
    name: "U.S. 2 Year Treasury Note",
    last: "3.977%",
    change: "0.00",
    isPositive: true,
  },
  {
    name: "U.S. 3 Year Treasury Note",
    last: "4.021%",
    change: "0.00",
    isPositive: true,
  },
  {
    name: "U.S. 5 Year Treasury Note",
    last: "4.155%",
    change: "0.00",
    isPositive: true,
  },
  {
    name: "U.S. 7 Year Treasury Note",
    last: "4.337%",
    change: "0.00",
    isPositive: true,
  },
  {
    name: "U.S. 10 Year Treasury Note",
    last: "4.494%",
    change: "0.00",
    isPositive: true,
  },
  {
    name: "U.S. 30 Year Treasury Bond",
    last: "4.870%",
    change: "0.00",
    isPositive: true,
  },
];

// Yield curve data
const yieldCurveData = [
  { duration: "1m", current: 4.33, yearAgo: 5.42 },
  { duration: "3m", current: 4.38, yearAgo: 5.38 },
  { duration: "6m", current: 4.25, yearAgo: 5.34 },
  { duration: "1y", current: 4.08, yearAgo: 5.10 },
  { duration: "2y", current: 4.00, yearAgo: 4.95 },
  { duration: "3y", current: 4.05, yearAgo: 4.80 },
  { duration: "4y", current: 4.12, yearAgo: 4.67 },
  { duration: "5y", current: 4.18, yearAgo: 4.61 },
  { duration: "10y", current: 4.49, yearAgo: 4.59 },
  { duration: "15y", current: 4.60, yearAgo: 4.62 },
  { duration: "20y", current: 4.75, yearAgo: 4.63 },
  { duration: "30y", current: 4.87, yearAgo: 4.64 },
];

export function TreasuryBillSection() {
  return (
    <section className="py-16 backdrop-blur-md bg-background/60">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-blue-500 dark:text-blue-400">
              U.S. Treasury Bills
            </h3>
            <div className="flex gap-8">
              <div>NAME</div>
              <div>LAST</div>
              <div>CHG</div>
            </div>
          </div>

          {/* Main card with hover */}
          <Card className="glass-card p-4 mb-8 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30">
            {treasuryBills[0].name && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">
                    {treasuryBills[0].name}
                  </h4>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      {treasuryBills[0].last}
                    </div>
                    <div
                      className={cn(
                        "text-sm",
                        treasuryBills[0].isPositive
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {treasuryBills[0].change}
                    </div>
                  </div>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={treasuryBills[0].chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorTreasuryBill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2B6CB0"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2B6CB0"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis
                        domain={[4.29, 4.315]}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#2B6CB0"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTreasuryBill)"
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background/95 border p-2 rounded shadow">
                                <p>{payload[0].payload.time}</p>
                                <p className="font-bold">
                                  {payload[0].value}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </Card>

          {/* Other cards with same hover effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {treasuryBills.slice(1).map((bill) => (
              <Card
                key={bill.name}
                className="glass-card flex justify-between items-center p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
              >
                <div className="font-medium">{bill.name}</div>
                <div className="text-right">
                  <div className="font-bold">{bill.last}</div>
                  <div
                    className={cn(
                      "text-sm",
                      bill.isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {bill.change}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Yield Curve */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6 text-blue-500 dark:text-blue-400">
            YIELD CURVE - US
          </h3>
          <Card className="glass-card p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={yieldCurveData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="duration" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[3.5, 5.5]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Line
                    name="Current"
                    type="monotone"
                    dataKey="current"
                    stroke="#000000"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    name="Year Ago"
                    type="monotone"
                    dataKey="yearAgo"
                    stroke="#3182CE"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <ChartTooltip
                    formatter={(value) => [`${value}%`]}
                    labelFormatter={(label) => `Duration: ${label}`}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Year Ago</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
