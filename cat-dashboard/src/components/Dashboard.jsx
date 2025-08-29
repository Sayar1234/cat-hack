import React, { useEffect, useState } from "react";
import AssetInputForm from "./AssetInputForm";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [machineType, setMachineType] = useState("");
  const [specs, setSpecs] = useState("");
  const [userRequirement, setUserRequirement] = useState("");
  const [apiResult, setApiResult] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showAnomalyInput, setShowAnomalyInput] = useState(false);
  const [showAnomalyTable, setShowAnomalyTable] = useState(false);
  const [anomalyFileName, setAnomalyFileName] = useState("");
  const [anomalySuccess, setAnomalySuccess] = useState(false);

  // Fetch data from backend API
  const fetchExcel = () => {
    fetch("http://localhost:5000/api/data")
      .then((res) => res.json())
      .then((jsonData) => setData(jsonData))
      .catch((err) => console.error("Error loading data from backend:", err));
  };

  useEffect(() => {
    fetchExcel();
  }, []);

  // Get the 5 most common machine types for dropdown
  const typeCounts = {};
  data.forEach((row) => {
    const type = row["Machine Type"];
    if (type) typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  const machineTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type]) => type);

  // Filter data by selected machine type (exact match)
  const filteredData = machineType
    ? data.filter((row) => row["Machine Type"] === machineType)
    : [];

  // If no data or no filtered data, show loading/empty
  if (!data.length)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading data...</p>
      </div>
    );

  const COLORS = [
    "#4ade80",
    "#60a5fa",
    "#facc15",
    "#f472b6",
    "#f87171",
    "#a78bfa",
  ];

  // 1️⃣ Pie: Geofence status (filtered)
  const pieData = Object.values(
    filteredData.reduce((acc, row) => {
      const key = row["Geofence status"] || "Unknown";
      acc[key] = acc[key] || { name: key, value: 0 };
      acc[key].value += 1;
      return acc;
    }, {})
  );

  const oilPressureData = filteredData.slice(0, 30).map((d) => ({
    date: d["Check-Out date"],
    pressure: Number(d["Oil pressure(psi)"]) || 0,
  }));

  // 8️⃣ Line: Coolant Temp (filtered)
  const coolantTempData = filteredData.slice(0, 30).map((d) => ({
    date: d["Check-Out date"],
    temp: Number(d["Coolant temp"]) || 0,
  }));

  // 9️⃣ Bar: Fuel Efficiency per equipment
  const efficiencyData = filteredData.slice(0, 20).map((d) => ({
    equipment: d["Equipment ID"],
    efficiency: Number(d["efficieny(avg)"]) || 0,
  }));

  // 2️⃣ Line: Distance per day (filtered)
  const distanceData = filteredData.slice(0, 30).map((d) => ({
    date: d["Check-Out date"],
    distance: Number(d["Distance/day"]) || 0,
  }));

  // 3️⃣ Bar: Fuel consumption per equipment (filtered)
  const fuelData = filteredData.slice(0, 20).map((d) => ({
    equipment: d["Equipment ID"],
    fuel: Number(d["Fuel consumption(l/h)"]) || 0,
  }));

  // 4️⃣ Line: Engine RPM (filtered)
  const rpmData = filteredData.slice(0, 30).map((d) => ({
    date: d["Check-Out date"],
    rpm: Number(d["Engine RPM"]) || 0,
  }));

  // 5️⃣ Line: Engine Temp (filtered)
  const tempData = filteredData.slice(0, 30).map((d) => ({
    date: d["Check-Out date"],
    temp: Number(d["engine temp(avg/day)"]) || 0,
  }));

  // 6️⃣ Bar: Battery Voltage (filtered)
  const batteryData = filteredData.slice(0, 20).map((d) => ({
    equipment: d["Equipment ID"],
    battery: Number(d["Battery Voltage"]) || 0,
  }));

  // Hardcoded anomaly data
  const anomalyRows = [
    [15, "CAT-5384"],
    [16, "CAT-9165"],
    [23, "CAT-8989"],
    [31, "CAT-4920"],
    [35, "CAT-6282"],
    [39, "CAT-2420"],
    [40, "CAT-2249"],
    [44, "CAT-5849"],
    [49, "CAT-8048"],
    [51, "CAT-9001"],
    [58, "CAT-2321"],
    [67, "CAT-1666"],
    [94, "CAT-4327"],
    [103, "CAT-4001"],
    [112, "CAT-9791"],
    [114, "CAT-6478"],
    [134, "CAT-6089"],
    [149, "CAT-6102"],
    [158, "CAT-1694"],
    [166, "CAT-3690"],
    [172, "CAT-7939"],
    [177, "CAT-4184"],
    [189, "CAT-4226"],
    [213, "CAT-3686"],
    [220, "CAT-2194"],
    [234, "CAT-8620"],
    [237, "CAT-5133"],
    [242, "CAT-4565"],
    [249, "CAT-4629"],
    [250, "CAT-3061"],
    [265, "CAT-7539"],
    [275, "CAT-2590"],
    [282, "CAT-5871"],
    [297, "CAT-3905"],
    [298, "CAT-5302"],
    [301, "CAT-3564"],
    [315, "CAT-1772"],
    [317, "CAT-8223"],
    [319, "CAT-8981"],
    [323, "CAT-1266"],
    [337, "CAT-6760"],
    [358, "CAT-1396"],
    [377, "CAT-4565"],
    [406, "CAT-9710"],
    [426, "CAT-4918"],
    [427, "CAT-1810"],
    [432, "CAT-6505"],
    [443, "CAT-2081"],
    [471, "CAT-2560"],
    [482, "CAT-6753"],
  ];

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#f9fafb] p-6 md:p-12">
      <div className="flex justify-end mb-2 gap-2">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg shadow transition"
          onClick={() => setShowAssetForm(true)}
        >
          Get user rating
        </button>
        <button
          className="bg-black hover:bg-gray-800 text-yellow-400 font-bold py-2 px-6 rounded-lg shadow transition"
          onClick={() => setShowAssetForm(false)}
        >
          Close form
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow transition"
          onClick={() => {
            setShowAnomalyInput(true);
            setShowAnomalyTable(false);
          }}
        >
          Check Anomalies
        </button>
      </div>
      {showAssetForm && <AssetInputForm />}
      {showAnomalyInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl font-bold"
              onClick={() => {
                setShowAnomalyInput(false);
                setShowAnomalyTable(false);
                setAnomalyFileName("");
                setAnomalySuccess(false);
              }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Check Anomalies
            </h2>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAnomalyFileName(e.target.files[0].name);
                  setAnomalySuccess(true);
                  setTimeout(() => {
                    setShowAnomalyTable(true);
                  }, 1200);
                }
              }}
              className="mb-2"
            />
            {anomalyFileName && (
              <div className="mb-2 text-gray-700">File: {anomalyFileName}</div>
            )}
            {anomalySuccess && !showAnomalyTable && (
              <div className="text-green-600 font-semibold mb-2 animate-fade-in">
                File submitted successfully!
              </div>
            )}
            {showAnomalyTable && (
              <div className="w-full mt-4">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Detected 50 potential anomalies
                </h2>
                <div className="overflow-x-auto max-h-[50vh] overflow-y-auto border border-gray-300 rounded-lg">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 border">Index</th>
                        <th className="px-4 py-2 border">Equipment ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anomalyRows.map(([idx, id]) => (
                        <tr key={id}>
                          <td className="px-4 py-2 border text-center">
                            {idx}
                          </td>
                          <td className="px-4 py-2 border text-center">{id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <h1 className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 drop-shadow-lg tracking-tight text-center">
        🚜 Telematics Dashboard
      </h1>

      {/* Machine Type and Specs Input Section */}
      <section className="mb-12 w-full flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white/90 border-2 border-yellow-400 rounded-2xl shadow-xl px-6 py-6 w-full max-w-3xl">
          <div className="flex flex-col items-start w-full max-w-xs">
            <label
              htmlFor="machine-type"
              className="font-bold text-black mb-2 text-lg"
            >
              Machine Type
            </label>
            <select
              id="machine-type"
              className="border-2 border-black rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black w-full"
              value={machineType}
              onChange={(e) => setMachineType(e.target.value)}
            >
              <option value="">-- Select Machine Type --</option>
              {machineTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start w-full max-w-xs">
            <label
              htmlFor="specs"
              className="font-bold text-black mb-2 text-lg"
            >
              Specifications
            </label>
            <textarea
              id="specs"
              className="border-2 border-black rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-black w-full min-h-[60px]"
              placeholder="Enter requirements/specs"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
            />
          </div>
          <button
            className="bg-green-400 hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg shadow transition text-lg mt-4 md:mt-8"
            onClick={() => {
              const reqText = `${machineType}${specs ? ` with ${specs}` : ""}.`;
              setUserRequirement(reqText);
              setApiResult(null);
              setApiError("");
              setApiLoading(true);

              // Simulate API delay
              setTimeout(() => {
                let fakeResponse;

                // Choose response based on keywords
                if (/excavator/i.test(reqText)) {
                  fakeResponse = {
                    recommendedMachine: "Excavator ZX200",
                    power: "100psi",
                    reason:
                      "Best suited for heavy digging with high efficiency.",
                    estimatedFuelConsumption: "12 L/h",
                  };
                } else if (/loader/i.test(reqText)) {
                  fakeResponse = {
                    recommendedMachine: "Loader L150",
                    power: "250psi",
                    reason:
                      "Ideal for moving materials quickly on construction sites.",
                    estimatedFuelConsumption: "10 L/h",
                  };
                } else if (/bulldozer/i.test(reqText)) {
                  fakeResponse = {
                    recommendedMachine: "Bulldozer D85",
                    power: "3200psi",
                    reason:
                      "Great for pushing large amounts of soil or rubble.",
                    estimatedFuelConsumption: "15 L/h",
                  };
                } else {
                  fakeResponse = {
                    recommendedMachine: "Machine",
                    power: "3500psi",
                    reason: "Versatile machine suitable for various tasks.",
                    estimatedFuelConsumption: "Varies",
                  };
                }

                setApiResult(fakeResponse);
                setApiLoading(false);
              }, 1000); // 1 second delay
            }}
            disabled={!machineType}
          >
            Save Requirement
          </button>
        </div>
        {userRequirement && (
          <div className="mt-6 text-lg text-gray-800 font-medium bg-white/80 rounded-xl px-6 py-4 border border-green-300 shadow">
            {userRequirement}
          </div>
        )}
        {/* API result display */}
        {/* API result display */}
        {apiLoading && (
          <div className="mt-4 text-blue-600 font-medium">
            Loading recommendation...
          </div>
        )}

        {apiError && (
          <div className="mt-4 text-red-600 font-medium">{apiError}</div>
        )}

        {apiResult && (
          <div className="mt-4 p-6 bg-white/90 border border-blue-300 rounded-xl shadow-lg max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Recommended Machine
            </h3>
            <div className="flex flex-col gap-2">
              <div>
                <span className="font-semibold text-gray-700">Machine:</span>{" "}
                <span className="text-gray-900">
                  {apiResult.recommendedMachine}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Power:</span>{" "}
                <span className="text-gray-900">{apiResult.power}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Reason:</span>{" "}
                <span className="text-gray-900">{apiResult.reason}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Estimated Fuel:
                </span>{" "}
                <span className="text-gray-900">
                  {apiResult.estimatedFuelConsumption}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Summary Cards (filtered) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          {
            title: "Total Machines",
            value: [...new Set(filteredData.map((d) => d["Equipment ID"]))]
              .length,
            color: "bg-green-100 text-green-700",
          },
          {
            title: "Avg Fuel Level",
            value:
              filteredData.length > 0
                ? (
                    filteredData.reduce(
                      (sum, d) => sum + (Number(d["Fuel level"]) || 0),
                      0
                    ) / filteredData.length
                  ).toFixed(1)
                : "-",
            color: "bg-blue-100 text-blue-700",
          },
          {
            title: "Avg Engine Temp",
            value:
              filteredData.length > 0
                ? (
                    filteredData.reduce(
                      (sum, d) =>
                        sum + (Number(d["engine temp(avg/day)"]) || 0),
                      0
                    ) / filteredData.length
                  ).toFixed(1)
                : "-",
            color: "bg-yellow-100 text-yellow-700",
          },
          {
            title: "Total Distance",
            value:
              filteredData.length > 0
                ? filteredData
                    .reduce(
                      (sum, d) =>
                        sum + (Number(d["Distance travelled(total)"]) || 0),
                      0
                    )
                    .toFixed(1)
                : "-",
            color: "bg-pink-100 text-pink-700",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`relative p-8 rounded-2xl shadow-2xl flex flex-col justify-center items-center ${card.color} bg-opacity-80 backdrop-blur-md border border-white/30 hover:scale-[1.04] transition-transform duration-200 group overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-60 group-hover:opacity-80 transition-all pointer-events-none z-0" />
            <h2 className="font-semibold text-lg z-10 drop-shadow-md">
              {card.title}
            </h2>
            <p className="text-4xl font-extrabold mt-2 z-10 drop-shadow-lg tracking-wide">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* 1 Pie */}
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/30 hover:shadow-2xl transition-all">
          <h2 className="font-bold mb-4 text-gray-700 text-xl tracking-tight">
            Geofence Status
          </h2>
          <PieChart width={350} height={250}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* 2 Line Distance */}
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/30 hover:shadow-2xl transition-all">
          <h2 className="font-bold mb-4 text-gray-700 text-xl tracking-tight">
            Distance / Day
          </h2>
          <LineChart width={350} height={250} data={distanceData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="distance"
              stroke="#4ade80"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        {/* 3 Bar Fuel */}
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/30 hover:shadow-2xl transition-all">
          <h2 className="font-bold mb-4 text-gray-700 text-xl tracking-tight">
            Fuel Consumption
          </h2>
          <BarChart width={350} height={250} data={fuelData}>
            <XAxis dataKey="equipment" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <Bar dataKey="fuel" fill="#60a5fa" />
          </BarChart>
        </div>

        {/* 4 Line RPM */}
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/30 hover:shadow-2xl transition-all">
          <h2 className="font-bold mb-4 text-gray-700 text-xl tracking-tight">
            Engine RPM
          </h2>
          <LineChart width={350} height={250} data={rpmData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="rpm"
              stroke="#f472b6"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        {/* 5 Line Engine Temp */}
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/30 hover:shadow-2xl transition-all">
          <h2 className="font-bold mb-4 text-gray-700 text-xl tracking-tight">
            Engine Temp
          </h2>
          <LineChart width={350} height={250} data={tempData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#facc15"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        {/* 6 Bar Battery */}
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/30 hover:shadow-2xl transition-all">
          <h2 className="font-bold mb-4 text-gray-700 text-xl tracking-tight">
            Battery Voltage
          </h2>
          <BarChart width={350} height={250} data={batteryData}>
            <XAxis dataKey="equipment" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <Bar dataKey="battery" fill="#f87171" />
          </BarChart>
        </div>

        <div className="p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/30 hover:shadow-2xl transition-all">
          <h2 className="font-bold mb-4 text-gray-700 text-xl tracking-tight">
            Oil Pressure
          </h2>
          <LineChart width={350} height={250} data={oilPressureData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#a78bfa"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        {/* 8 Line Coolant Temp */}
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/30 hover:shadow-2xl transition-all">
          <h2 className="font-bold mb-4 text-gray-700 text-xl tracking-tight">
            Coolant Temperature
          </h2>
          <LineChart width={350} height={250} data={coolantTempData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#f59e0b"
              strokeWidth={3}
            />
          </LineChart>
        </div>

        {/* 9 Bar Fuel Efficiency */}
        <div className="p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-white/30 hover:shadow-2xl transition-all">
          <h2 className="font-bold mb-4 text-gray-700 text-xl tracking-tight">
            Fuel Efficiency
          </h2>
          <BarChart width={350} height={250} data={efficiencyData}>
            <XAxis dataKey="equipment" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <Bar dataKey="efficiency" fill="#22c55e" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
