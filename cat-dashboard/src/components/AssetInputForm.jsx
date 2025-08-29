import React, { useState } from "react";

const AssetInputForm = () => {
  const [form, setForm] = useState({
    totalAssetsRented: "",
    currentAssets: "",
    distancePerDay: "",
    engineTemp: "",
    coolantTemp: "",
    oilPressure: "",
    batteryVoltage: "",
    fuelLevel: "",
    fuelConsumption: "",
    efficiency: "",
    cycleCounts: "",
    environmentTemp: "",
    humidity: "",
    aqi: "",
    shockAvg: "",
    tiltSensorAvg: "",
    overloadMonth: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    setLoading(true);

    // simulate API delay
    setTimeout(() => {
      const payload = {
        totalAssetsRented: Number(form.totalAssetsRented),
        currentAssets: Number(form.currentAssets),
        distancePerDay: Number(form.distancePerDay),
        engineTemp: Number(form.engineTemp),
        coolantTemp: Number(form.coolantTemp),
        oilPressure: Number(form.oilPressure),
        batteryVoltage: Number(form.batteryVoltage),
        fuelLevel: Number(form.fuelLevel),
        fuelConsumption: Number(form.fuelConsumption),
        efficiency: Number(form.efficiency),
        cycleCounts: Number(form.cycleCounts),
        environmentTemp: Number(form.environmentTemp),
        humidity: Number(form.humidity),
        aqi: Number(form.aqi),
        shockAvg: Number(form.shockAvg),
        tiltSensorAvg: Number(form.tiltSensorAvg),
        overloadMonth: Number(form.overloadMonth),
      };

      let predictedRating;

      if (
        payload.totalAssetsRented === 50 &&
        payload.currentAssets === 25 &&
        payload.distancePerDay === 200
      ) {
        predictedRating = 5;
      } else if (
        payload.totalAssetsRented === 80 &&
        payload.currentAssets === 40 &&
        payload.distancePerDay === 150
      ) {
        predictedRating = 6;
      } else {
        predictedRating = "No exact prediction available";
      }

      setResult(predictedRating);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block font-bold mb-1">
            Total overall assets rented till now
          </label>
          <input
            name="totalAssetsRented"
            value={form.totalAssetsRented}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Total current assets</label>
          <input
            name="currentAssets"
            value={form.currentAssets}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Distance/day</label>
          <input
            name="distancePerDay"
            value={form.distancePerDay}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Engine temp (avg/day)</label>
          <input
            name="engineTemp"
            value={form.engineTemp}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Coolant temp/day</label>
          <input
            name="coolantTemp"
            value={form.coolantTemp}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Oil pressure/day</label>
          <input
            name="oilPressure"
            value={form.oilPressure}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Battery voltage/day</label>
          <input
            name="batteryVoltage"
            value={form.batteryVoltage}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            step="0.1"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Fuel level (least)/day</label>
          <input
            name="fuelLevel"
            value={form.fuelLevel}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Fuel Consumption/day</label>
          <input
            name="fuelConsumption"
            value={form.fuelConsumption}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Efficiency (avg)</label>
          <input
            name="efficiency"
            value={form.efficiency}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Cycle counts/day</label>
          <input
            name="cycleCounts"
            value={form.cycleCounts}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">
            Environment temp (avg/day)
          </label>
          <input
            name="environmentTemp"
            value={form.environmentTemp}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Humidity (avg/day)</label>
          <input
            name="humidity"
            value={form.humidity}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">AQI (avg/day)</label>
          <input
            name="aqi"
            value={form.aqi}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Shock avg/day</label>
          <input
            name="shockAvg"
            value={form.shockAvg}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            step="0.1"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Tilt sensor avg/day</label>
          <input
            name="tiltSensorAvg"
            value={form.tiltSensorAvg}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Overload/month</label>
          <input
            name="overloadMonth"
            value={form.overloadMonth}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            type="number"
            required
          />
        </div>
        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-lg shadow"
          >
            Submit
          </button>
        </div>
      </form>
      {loading && (
        <div className="text-blue-600 text-center mt-4">Loading...</div>
      )}
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
      {result && (
        <div className="text-green-700 text-center mt-4 font-bold text-xl">
          User Rating: {result}
        </div>
      )}
    </>
  );
};

export default AssetInputForm;
