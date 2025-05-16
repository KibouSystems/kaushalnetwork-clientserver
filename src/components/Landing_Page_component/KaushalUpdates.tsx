interface Update {
  id: number;
  title: string;
  description: string;
  date: string;
  category: 'MSME' | 'Service Provider' | 'Corporate';
  image: string;
}

const updates: Update[] = [
  {
    id: 1,
    title: 'MSME Growth Program',
    description: 'Access to capital and business development resources for small enterprises',
    date: '2024-01-15',
    category: 'MSME',
    image:
      'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Add actual image path
  },
  {
    id: 2,
    title: 'Service Excellence Workshop',
    description: 'Professional development program for service providers',
    date: '2024-01-20',
    category: 'Service Provider',
    image:
      'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Add actual image path
  },
  {
    id: 3,
    title: 'Corporate Innovation Summit',
    description: 'Network with industry leaders and explore partnership opportunities',
    date: '2024-01-25',
    category: 'Corporate',
    image:
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Add actual image path
  },
];

const KaushalUpdates = () => (
  <section className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-3">
        Updates for MSMEs, Service Providers and Corporates
      </h2>
      <p className="text-gray-600 text-center mb-10">
        Stay informed about latest opportunities and industry developments
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {updates.map(update => (
          <div
            key={update.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="h-48 overflow-hidden">
              <img src={update.image} alt={update.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <span
                className={`inline-block px-3 py-1 mb-3 text-sm rounded-full
                ${
                  update.category === 'MSME'
                    ? 'bg-green-100 text-green-800'
                    : update.category === 'Service Provider'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                }`}
              >
                {update.category}
              </span>
              <h3 className="text-xl font-semibold mb-2">{update.title}</h3>
              <p className="text-gray-600 mb-4">{update.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm">
                  {new Date(update.date).toLocaleDateString()}
                </p>
                <button className="text-blue-600 hover:text-blue-800">Learn more →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default KaushalUpdates;
