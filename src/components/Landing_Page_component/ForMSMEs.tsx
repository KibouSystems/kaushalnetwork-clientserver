import React from "react";
import { Card, CardContent } from "../ui/card";
import { Building2, MapPin, Layers } from "lucide-react"; // Optional icons

const stats = [
  {
    title: "40,000+ MSMEs",
    description: "Explore business connections by sector and location.",
    icon: <Building2 className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "12+ Sectors",
    description: "Find verified businesses in Manufacturing, IT, Retail & more.",
    icon: <Layers className="w-6 h-6 text-green-600" />,
  },
  {
    title: "150+ Locations",
    description: "Search and connect with MSMEs across India.",
    icon: <MapPin className="w-6 h-6 text-red-500" />,
  },
];

const ForMSMEs = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
    {stats.map((item, index) => (
      <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="bg-gray-100 p-2 rounded-full">{item.icon}</div>
          <div>
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default ForMSMEs;
