import { Zap, Shield, Map, Clock, Search, Calendar, Star, CarFront } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../components/ui/accordion";
import { useNavigate, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import { toast } from 'react-toastify';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [scheduleDatetime, setScheduleDatetime] = useState<string[]>([]);

  const handleHomeSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      const queryParams = new URLSearchParams();

      queryParams.set('q', searchQuery);

      if (scheduleDatetime.length === 2) {
        queryParams.set('scheduleDatetime', scheduleDatetime.join(','));
      }

      if (selected) {
        queryParams.set('vehicle', selected);
      }

      navigate(`/search?${queryParams.toString()}`);
    } else {
      toast.error('Please enter search query');
    }
  };

  return (
    <div className="min-h-[80vh] relative overflow-hidden bg-space flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-blue/20 via-transparent to-transparent " />
      
      <div className=" mx-auto">
          <div className="animate-fade-up">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white text-center mb-8">
              Simplify Your
              <span className="bg-cyber-gradient bg-clip-text text-transparent"> Parking Experience</span>
            </h1>
            <p className="max-w-[60vw] text-xl text-white/70 text-center mx-auto">
              Whether it's for a quick stop or an extended stay, discover the best spaces just for you.
            </p>

            <div className="hidden lg:block max-w-4xl mx-auto mt-16 bg-white/10 backdrop-blur-lg p-4 rounded-full border border-white/20 shadow-lg">
              <form onSubmit={handleHomeSearch}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center flex-1 gap-2.5 px-4">
                    <Search className="w-5 h-5 text-cyber-blue" />
                    <input
                      type="text"
                      name="q"
                      id="q"
                      value={searchQuery}
                      autoComplete="off"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Where do you want to drive?"
                      className="w-full bg-transparent border-none focus:outline-none text-white placeholder:text-white/60"
                    />
                  </div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="flex items-center gap-2.5 px-4">
                    <Calendar className="w-5 h-5 text-cyber-blue" />
                    <div className="home-daterange">
                      <DateRangePicker
                        name="scheduleDatetime"
                        id="scheduleDatetime"
                        onChange={(dates) => {
                          if (dates && dates.length === 2) {
                            const adjustMinutes = (date: Date) => {
                              const minutes = date.getMinutes();
                              const adjustedMinutes = Math.round(minutes / 5) * 5;
                              date.setMinutes(adjustedMinutes);
                              return date;
                            };
                      
                            const startDate = adjustMinutes(new Date(dates[0]));
                            let endDate = adjustMinutes(new Date(dates[1]));

                            const diffMs = endDate.getTime() - startDate.getTime();
                            const diffHours = Math.max(1, Math.ceil(diffMs / (60 * 60 * 1000)));
                            endDate = new Date(startDate.getTime() + diffHours * 60 * 60 * 1000);

                            setScheduleDatetime([startDate.toISOString(), endDate.toISOString()]);
                          }
                        }}
                        style={{ width: '100%' }}
                        cleanable={false}
                        format="dd/MM/yyyy HH:mm"
                        character=' - '
                        placeholder='Duration'
                        ranges={[]}
                        placement="bottomEnd"
                      />
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="flex items-center gap-2 px-4">
                    <CarFront className="w-5 h-5 text-cyber-blue" />
                    <select
                      className={`bg-transparent border-none focus:outline-none ${!selected ? 'text-[#b4b6be]' : 'text-white'}`}
                      value={selected}
                      name="vehicle"
                      id="vehicle"
                      onChange={(e) => setSelected(e.target.value)}
                    >
                      <option value="">Vehicle</option>
                      <option value="1">Car</option>
                      <option value="2">Motorcycle</option>
                    </select>
                  </div>
                  <button className="bg-cyber-gradient px-6 py-2 rounded-full text-white hover:opacity-90 transition-opacity">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Reserve your parking in seconds with our advanced booking system'
    },
    {
      icon: Shield,
      title: 'Smart Security',
      description: 'Secure authentication and advanced account protection'
    },
    {
      icon: Map,
      title: 'Global Network',
      description: 'Access parking spots from any smart-enabled location'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'AI-powered customer service available round the clock'
    }
  ];

  return (
    <section className="home-features pt-20 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gradient-to-br from-black/5 to-black/5 border border-black/10 hover:border-cyber-blue/50 transition-all group"
            >
              <feature.icon className="w-12 h-12 text-cyber-blue mb-4 group-hover:text-black transition-colors" />
              <h3 className="text-xl font-bold text-black mb-2">{feature.title}</h3>
              <p className="text-black/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PopularLocations = () => {
  const locations = [
    {
      name: "Sukhumvit Road (Bangkok)",
      keyword: "Sukhumvit",
      rating: 4.8,
      image: "/src/images/place2.jpg",
      price: "45"
    },
    {
      name: "Yaowarat, Chinatown (Bangkok)",
      keyword: "Yaowarat",
      rating: 4.6,
      image: "/src/images/place1.jpg",
      price: "29"
    },
    {
      name: "Pattaya Beach Road (Chonburi)",
      keyword: "Pattaya Beach",
      rating: 4.9,
      image: "/src/images/place3.jpg",
      price: "37"
    }
  ];

  return (
    <section className="pt-30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12">
          Popular <span className="bg-cyber-gradient bg-clip-text text-transparent">Locations</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <div
              key={index}
              className="group rounded-2xl overflow-hidden bg-black/5 border border-black/10 hover:border-cyber-blue/50 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">{location.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-cyber-yellow fill-current" />
                    <span>{location.rating}</span>
                  </div>
                </div>
                <p className="text-black/60 mb-4">Starting from ฿{location.price}/hour</p>
                <NavLink to={`/search?q=${location.keyword}`}>
                  <button className="w-full bg-cyber-gradient text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                    Book Now
                  </button>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Reviews = () => {
  const reviews = [
    {
      name: "Ahmed Johnson",
      rating: 5,
      comment: "I used CarBNB during a trip and loved how easy it was to find parking near my hotel. I’ll definitely use CarBNB again whenever I travel!",
      image: "http://localhost:9000/upload/20230511143115_642312177.jpg"
    },
    {
      name: "John Chen",
      rating: 5,
      comment: "CarBNB makes parking stress-free! I always find affordable spots near my office. It’s been a game-changer for my daily commute!",
      image: "http://localhost:9000/upload/20230511143115_642312177.jpg"
    },
    {
      name: "Sarah Williams",
      rating: 5,
      comment: "I decided to list my unused driveway on CarBNB. The process to create a listing was simple, and now I’m earning extra money every month.",
      image: "http://localhost:9000/upload/20230511143115_642312177.jpg"
    }
  ];

  return (
    <section className="pt-30 ">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Customer <span className="bg-cyber-gradient bg-clip-text text-transparent">Reviews</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gradient-to-br from-black/5 to-black/5 border border-black/10 hover:border-cyber-blue/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-black">{review.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-cyber-yellow fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-black/70">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What is CarBNB?",
      answer: "CarBNB is an innovative platform designed to connect people who need parking spaces with individuals or businesses who have unused parking spots available for rent. Think of it as an Airbnb, but specifically for parking! Whether you’re a driver looking for a convenient and affordable place to park, or a property owner wanting to earn extra income from your unused space, CarBNB provides a seamless, secure, and easy-to-use solution."
    },
    {
      question: "How do I book a parking spot?",
      answer: "Once you’ve chosen a parking space, click the “Book Now” button. Select your preferred time and duration, and follow the checkout process to confirm your booking. You can pay securely using your preferred payment method. After completing the process, you’ll receive a confirmation email with all the booking details, including directions to the parking location."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify your booking through your account. However, cancellation and modification policies vary depending on the space owner’s terms. Be sure to review these policies when booking. Refunds will be processed according to the cancellation policy"
    },
    {
      question: "How do I list my parking space?",
      answer: "Listing your parking space is easy. Click “List Your Space” on our website or app, create an account, and provide detailed information about your parking spot. This includes the address, availability, pricing, vehicle size compatibility, and any security features. Adding high-quality photos will help attract more renters. Once your listing is submitted, our team will review and approve it before it goes live."
    },
    {
      question: "How do I set the pricing for my parking space?",
      answer: "You have full control over your pricing. You can set hourly, daily, or monthly rates depending on the demand in your area. Our platform provides insights and pricing recommendations to help you set competitive rates and attract more renters."
    }
  ];

  return (
    <section className="pt-30 pb-10">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Frequently Asked <span className="bg-cyber-gradient bg-clip-text text-transparent">Questions</span>
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-black/5 border border-black/10 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-black/5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-black/60">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <main className="home-page min-h-screen text-black -my-4 md:-my-10 2xl:-my-14 -mx-[20vw]">
      <Hero />
      <Features />
      <PopularLocations />
      <Reviews />
      <FAQ />
    </main>
  );
};

export default Index;