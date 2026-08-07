"use client";

import { useEffect, useState } from "react";

interface Props {
  onLocationChange: (
    latitude: number,
    longitude: number
  ) => void;
}

export default function LocationPicker({
  onLocationChange,
}: Props) {

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [message, setMessage] = useState("Finding your location…");

  useEffect(() => {

    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setAccuracy(position.coords.accuracy);
        setMessage("Location captured");

        onLocationChange(
          position.coords.latitude,
          position.coords.longitude
        );

      },

      () => {
        setMessage("Location permission was not granted. You can retry after allowing it in your browser.");
      }

    );

  }, [onLocationChange]);

  return (

    <div className="rounded-xl bg-slate-800 p-4">

      <h2 className="text-white font-bold mb-2">

        📍 Current Location

      </h2>

      <p className="text-slate-300">
        {message}
      </p>

      <p className="text-slate-300">

        Latitude:
        {" "}
        {latitude ?? "--"}

      </p>

      <p className="text-slate-300">

        Longitude:
        {" "}
        {longitude ?? "--"}

      </p>

      <p className="text-slate-300">

        Accuracy:
        {" "}
        {accuracy
          ? `${Math.round(accuracy)} m`
          : "--"}

      </p>

    </div>

  );

}
