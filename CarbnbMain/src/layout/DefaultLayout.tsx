import React, { ReactNode } from 'react';
import Header from '../components/Header/index';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header/>
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="container mx-auto py-4 md:py-10 2xl:py-14 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
              {children}
            </div>

            <footer className="border-t border-black/10 mt-12">
              <div className="container mx-auto px-4 pt-12 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                  <div className="lg:col-span-2 lg:pr-16">
                    <h3 className="text-xl font-bold text-[#557df4] mb-4">
                      CarBNB
                    </h3>
                    <p className="text-black/60">
                      Experience the future of parking with our easy-to-use rental service, connecting drivers and space owners for hassle-free, secure, and affordable parking solutions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                      {[
                        { label: 'About Us', href: '/about' },
                        { label: 'Contact', href: '/contact' },
                        { label: 'Locations', href: '#' },
                        { label: 'Parking', href: '#' }
                      ].map(({ label, href }) => (
                        <li key={label}>
                          <a href={href} className="text-black/60 hover:underline">
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-4">Support</h4>
                    <ul className="space-y-2">
                      {[
                        { label: 'Terms of Service', href: '/terms' },
                        { label: 'Privacy Policy', href: '/privacy' },
                        { label: 'Help Center', href: '#' }
                      ].map(({ label, href }) => (
                        <li key={label}>
                          <a href={href} className="text-black/60 hover:underline">
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-4">Connect With Us</h4>
                    <div className="flex gap-4">
                      {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                        <a
                          key={index}
                          href="#"
                          className="text-black/40 hover:text-black/60"
                        >
                          <Icon className="w-6 h-6" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-black/10 text-center text-black/60">
                  <p>© 2024 CarBNB. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
