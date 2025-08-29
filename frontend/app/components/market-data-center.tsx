import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  ChartTooltip
} from "./ui/chart";

// Mock data for market indices
const usMarketData = [
  {
    name: "DJIA",
    fullName: "Dow Jones Industrial Average",
    value: "40,212.71",
    change: "+1.56%",
    points: "+619.05",
    isPositive: true,
    chartData: [
      { time: "10am", value: 39500 },
      { time: "11am", value: 39600 },
      { time: "12pm", value: 39800 },
      { time: "1pm", value: 40100 },
      { time: "2pm", value: 40200 },
      { time: "3pm", value: 40100 },
      { time: "4pm", value: 40212 },
    ],
  },
  {
    name: "COMP",
    fullName: "NASDAQ Composite",
    value: "16,724.46",
    change: "+2.06%",
    points: "+337.14",
    isPositive: true,
    chartData: [],
  },
  {
    name: "SPX",
    fullName: "S&P 500 Index",
    value: "5,363.36",
    change: "+1.81%",
    points: "+95.31",
    isPositive: true,
    chartData: [],
  },
  {
    name: "GDOW",
    fullName: "Global Dow Realtime",
    value: "4,777.54",
    change: "+0.91%",
    points: "+43.22",
    isPositive: true,
    chartData: [],
  },
  {
    name: "GC00",
    fullName: "Gold Continuous Contract",
    value: "$3,255.30",
    change: "+0.33%",
    points: "+10.70",
    isPositive: true,
    chartData: [],
  },
  {
    name: "CL1",
    fullName: "Crude Oil WTI (NYM)",
    value: "$61.48",
    change: "-0.03%",
    points: "-0.02",
    isPositive: false,
    chartData: [],
  },
];

const europeMarketData = [
  {
    name: "FTSE 100",
    value: "7,964.18",
    change: "+0.64%",
    points: "+50.93",
    isPositive: true,
    chartData: [
      { time: "9am", value: 7900 },
      { time: "10am", value: 7870 },
      { time: "11am", value: 7920 },
      { time: "12pm", value: 7950 },
      { time: "1pm", value: 7940 },
      { time: "2pm", value: 7980 },
      { time: "3pm", value: 7964 },
    ],
  },
  {
    name: "DAX",
    value: "20,374.10",
    change: "-0.92%",
    points: "-188.63",
    isPositive: false,
    chartData: [],
  },
  {
    name: "CAC 40",
    value: "7,104.80",
    change: "-0.30%",
    points: "-21.22",
    isPositive: false,
    chartData: [],
  },
  {
    name: "FTSE MIB",
    value: "34,027.83",
    change: "-0.73%",
    points: "-249.26",
    isPositive: false,
    chartData: [],
  },
  {
    name: "IBEX 35",
    value: "12,286.00",
    change: "-0.18%",
    points: "-21.60",
    isPositive: false,
    chartData: [],
  },
  {
    name: "SXXP",
    value: "486.80",
    change: "-0.10%",
    points: "-0.48",
    isPositive: false,
    chartData: [],
  },
];

const asiaMarketData = [
  {
    name: "XX:ADOW",
    value: "3,841.55",
    change: "-1.15%",
    points: "-44.56",
    isPositive: false,
    chartData: [
      { time: "12am", value: 3760 },
      { time: "2am", value: 3820 },
      { time: "4am", value: 3850 },
      { time: "6am", value: 3855 },
      { time: "8am", value: 3860 },
      { time: "10am", value: 3840 },
      { time: "12pm", value: 3841 },
    ],
  },
  {
    name: "JP:NIK",
    value: "33,585.58",
    change: "-2.96%",
    points: "-1,023.42",
    isPositive: false,
    chartData: [],
  },
  {
    name: "HK:HSI",
    value: "20,914.69",
    change: "+1.13%",
    points: "+232.91",
    isPositive: true,
    chartData: [],
  },
  {
    name: "CN:SHCOMP",
    value: "3,238.23",
    change: "+0.45%",
    points: "+14.59",
    isPositive: true,
    chartData: [],
  },
  {
    name: "IN:1",
    value: "75,157.26",
    change: "+1.77%",
    points: "+1,310.11",
    isPositive: true,
    chartData: [],
  },
  {
    name: "SG:STI",
    value: "3,512.53",
    change: "-1.83%",
    points: "-65.30",
    isPositive: false,
    chartData: [],
  },
];

const currencyData = [
  {
    name: "Euro",
    value: "$1.1361",
    change: "+0.02%",
    points: "+0.0002",
    isPositive: true,
    chartData: [
      { time: "12am", value: 1.12 },
      { time: "4am", value: 1.135 },
      { time: "8am", value: 1.14 },
      { time: "12pm", value: 1.138 },
      { time: "4pm", value: 1.136 },
    ],
  },
  {
    name: "Japanese Yen",
    value: "¥143.51",
    change: "-0.02%",
    points: "-0.02",
    isPositive: false,
    chartData: [],
  },
  {
    name: "British Pound",
    value: "$1.3082",
    change: "-0.01%",
    points: "-0.0001",
    isPositive: false,
    chartData: [],
  },
  {
    name: "Australian Dollar",
    value: "$0.6286",
    change: "-0.05%",
    points: "-0.0003",
    isPositive: false,
    chartData: [],
  },
  {
    name: "U.S. Dollar Index (DXY)",
    value: "99.78",
    change: "-1.07%",
    points: "-1.08",
    isPositive: false,
    chartData: [],
  },
  {
    name: "WSJ Dollar Index",
    value: "96.71",
    change: "-0.96%",
    points: "-0.94",
    isPositive: false,
    chartData: [],
  },
];

export function MarketDataCenter() {
  return (
    <section className="py-16 backdrop-blur-md bg-background/60">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-gradient">
          Market Data Center
        </h2>
        
        <div className="mb-12">
  <h3 className="text-2xl font-bold mb-6 text-blue-500 dark:text-blue-400">U.S.</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="col-span-1">
      <div className="glass-card h-72 rounded-xl overflow-hidden p-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={usMarketData[0].chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="colorUs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#63B3ED" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#63B3ED" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis
              domain={['dataMin - 200', 'dataMax + 200']}
              tick={{ fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#63B3ED"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUs)"
            />
            <ChartTooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background/95 border p-2 rounded shadow">
                      <p>{payload[0].payload.time}</p>
                      <p className="font-bold">{payload[0].value}</p>
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

    <div className="col-span-1 md:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usMarketData.map((market) => (
          <Card 
            key={market.name} 
            className={cn(
              "glass-card flex flex-col p-4 hover:shadow-lg transition-shadow",
              market.isPositive ? "glow-green" : "glow-red"
            )}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-sm">{market.name}</div>
              <Badge 
                variant={market.isPositive ? "success" : "destructive"} 
                className={`text-xs ${market.isPositive ? "pulse-green" : "pulse-red"}`}
              >
                {market.change}
              </Badge>
            </div>
            <div className="text-xl font-bold mb-1">{market.value}</div>
            <div className="text-xs text-muted-foreground mb-2">{market.fullName}</div>
            <div className={cn(
              "text-sm font-medium",
              market.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {market.points}
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
</div>


        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-blue-500 dark:text-blue-400">EUROPE</h3>
          <div className="flex text-sm text-muted-foreground space-x-4">
            <div>NAME</div>
            <div>LAST</div>
            <div>CHG</div>
            <div>CHG %</div>
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-3 mb-12 gap-6">
          <div className="col-span-1">
            <div className="glass-card h-72 rounded-xl overflow-hidden p-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={europeMarketData[0].chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorEurope" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4C51BF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4C51BF" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} tick={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#4C51BF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEurope)"
                  />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background/95 border p-2 rounded shadow">
                            <p>{payload[0].payload.time}</p>
                            <p className="font-bold">{payload[0].value}</p>
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

          <div className="col-span-1 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {europeMarketData.map((market) => (
              <Card 
          key={market.name} 
          className={cn(
            "glass-card flex flex-col p-4 hover:shadow-lg transition-shadow",
            market.isPositive ? "glow-green" : "glow-red"
          )}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-sm">{market.name}</div>
            <Badge 
              variant={market.isPositive ? "success" : "destructive"} 
              className={cn(
                "text-xs",
                market.isPositive ? "pulse-green" : "pulse-red" // 👈 only badge pulses
              )}
            >
              {market.change}
            </Badge>
          </div>
          <div className="text-xl font-bold">{market.value}</div>
          <div className={cn(
            "text-sm font-medium mt-2",
            market.isPositive ? "text-green-500" : "text-red-500"
          )}>
            {market.points}
          </div>
        </Card>

              ))}
            </div>
          </div>
        </div>

{/* Asia and Currencies section - Stacked on mobile */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
  {/* ASIA Section */}
  <div className="col-span-1">
    <h3 className="text-2xl font-bold mb-6 text-blue-500 dark:text-blue-400">ASIA</h3>
    <div className="glass-card h-72 rounded-xl overflow-hidden p-1 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={asiaMarketData[0].chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorAsia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ED8936" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ED8936" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis domain={['dataMin - 50', 'dataMax + 50']} tick={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ED8936"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAsia)"
          />
          <ChartTooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background/95 border p-2 rounded shadow">
                    <p>{payload[0].payload.time}</p>
                    <p className="font-bold">{payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-1 gap-3">
      {asiaMarketData.slice(0, 3).map((market) => (
        <Card
          key={market.name}
          className="relative rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
        >
          {/* Gradient border on hover */}
          <span className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="block w-full h-full rounded-xl bg-background"></span>
          </span>

          {/* Inner content */}
          <div className="relative glass-card rounded-xl p-3 bg-background w-full h-full">
            <div className="font-medium">{market.name}</div>
            <div className="text-right">
              <div>{market.value}</div>
              <div
                className={cn(
                  "text-sm",
                  market.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {market.points} ({market.change})
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>

  {/* ASIA Continued - Only visible on desktop */}
  <div className="col-span-1 hidden md:block">
    <h3 className="text-2xl font-bold mb-6 text-blue-500 dark:text-blue-400">ASIA (cont.)</h3>
    <div className="grid grid-cols-1 gap-3 mt-[72px]">
      {asiaMarketData.slice(3).map((market) => (
        <Card
          key={market.name}
          className="relative rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
        >
          <span className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="block w-full h-full rounded-xl bg-background"></span>
          </span>

          <div className="relative glass-card rounded-xl p-3 bg-background w-full h-full">
            <div className="font-medium">{market.name}</div>
            <div className="text-right">
              <div>{market.value}</div>
              <div
                className={cn(
                  "text-sm",
                  market.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {market.points} ({market.change})
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>

  {/* CURRENCIES Section */}
  <div className="col-span-1">
    <h3 className="text-2xl font-bold mb-6 text-blue-500 dark:text-blue-400">CURRENCIES</h3>
    <div className="glass-card h-72 rounded-xl overflow-hidden p-1 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={currencyData[0].chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorCurrency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38B2AC" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38B2AC" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} tick={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#38B2AC"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCurrency)"
          />
          <ChartTooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background/95 border p-2 rounded shadow">
                    <p>{payload[0].payload.time}</p>
                    <p className="font-bold">{payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-1 gap-3">
      {currencyData.slice(0, 3).map((currency) => (
        <Card
          key={currency.name}
          className="relative rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
        >
          <span className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="block w-full h-full rounded-xl bg-background"></span>
          </span>

          <div className="relative glass-card rounded-xl p-3 bg-background w-full h-full">
            <div className="font-medium">{currency.name}</div>
            <div className="text-right">
              <div>{currency.value}</div>
              <div
                className={cn(
                  "text-sm",
                  currency.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {currency.points} ({currency.change})
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>

  {/* Show ASIA (cont.) markets on mobile */}
  <div className="col-span-1 md:hidden">
    <h3 className="text-2xl font-bold mb-6 text-blue-500 dark:text-blue-400">ASIA (cont.)</h3>
    <div className="grid grid-cols-1 gap-3">
      {asiaMarketData.slice(3).map((market) => (
        <Card
          key={market.name}
          className="relative rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
        >
          <span className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="block w-full h-full rounded-xl bg-background"></span>
          </span>

          <div className="relative glass-card rounded-xl p-3 bg-background w-full h-full">
            <div className="font-medium">{market.name}</div>
            <div className="text-right">
              <div>{market.value}</div>
              <div
                className={cn(
                  "text-sm",
                  market.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {market.points} ({market.change})
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
</div>



        <div className="mt-8 flex justify-center">
          <button 
            className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 font-semibold rounded-lg transition-colors glass-card"
            onClick={() => window.scrollToPricing && window.scrollToPricing()}
          >
            View Pricing
          </button>
        </div>
      </div>
    </section>
  );
}

