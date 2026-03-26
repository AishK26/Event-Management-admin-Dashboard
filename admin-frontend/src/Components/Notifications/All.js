import React from "react";

const events = [
  {
    id: 1,
    title: "[DEMO EVENT] TECH.CONF 2020 TOKYO",
    date: "2018/12/01 (Sat) 10:00",
    status: "Live",
    premium: true,
    received: "Executive",
    stats: "Received",
  },
  {
    id: 2,
    title: "[DEMO EVENT] Secret Premium Party",
    date: "2018/12/01 (Sat) 19:00",
    status: "completed",
    premium: true,
    received: "manager",
    stats: "Sent",
  },
  {
    id: 3,
    title: "[DEMO EVENT] Birthday Party",
    date: "2018/12/01 (Sat) 19:00",
    status: "Upcoming",
    premium: true,
    received: "client",
    stats: "Error",
  },
  {
    id: 4,
    title: "[DEMO EVENT] Anniversary",
    date: "2018/12/01 (Sat) 19:00",
    status: "Upcoming",
    premium: true,
    received: "client",
    stats: "Received",
  },
  // Add more events as necessary
];

const All = () => {
  return (
    <div className="w-full ">
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg p-2 shadow-lg bg-white"
          >
            <div className="flex justify-between">
              <div>
                <p>{event.date}</p>
                <h3 className="font-bold text-lg">{event.title}</h3>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                {/* Conditionally set background color based on `stats` */}
                <h1
                  className={`px-4 py-1 rounded-lg text-sm ${
                    event.stats === "Sent"
                      ? "bg-blue-400"
                      : event.stats === "Error"
                      ? "bg-red-400"
                      : "bg-green-400"
                  }`}
                >
                  {event.stats}
                </h1>

                {/* Conditionally set background color based on `received` */}
                <h1 className="bg-yellow-300 text-black px-4 py-1 rounded-lg   text-sm">
                  {event.received}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default All;
