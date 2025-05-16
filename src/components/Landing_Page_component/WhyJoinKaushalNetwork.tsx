interface Reason {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const reasons: Reason[] = [
  {
    id: 1,
    title: 'Business Growth',
    description: 'Access new markets and expand your business reach',
    icon: 'https://cdn-icons-png.flaticon.com/512/4149/4149643.png',
  },
  {
    id: 2,
    title: 'Network Expansion',
    description: 'Connect with industry leaders and potential partners',
    icon: 'https://cdn-icons-png.flaticon.com/512/1256/1256650.png',
  },
  {
    id: 3,
    title: 'Digital Presence',
    description: 'Enhance your online visibility and digital footprint',
    icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
  {
    id: 4,
    title: 'Business Resources',
    description: 'Access tools, training, and resources for success',
    icon: 'https://cdn-icons-png.flaticon.com/512/942/942748.png',
  },
];

const WhyJoinKaushalNetwork = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4">Why Join Kaushal Network?</h2>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Join a powerful ecosystem of businesses, get discovered and grow your network.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map(reason => (
          <div
            key={reason.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4">
              <img src={reason.icon} alt={reason.title} className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
            <p className="text-gray-600">{reason.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors">
          Join Now
        </button>
      </div>
    </div>
  </section>
);

export default WhyJoinKaushalNetwork;
