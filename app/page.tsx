"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, MessageCircle, Users, Calendar, ChevronRight, Star, MapPin, Menu, X, User, LogOut, ChevronLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { WhatsAppIntegration } from "@/components/WhatsAppIntegration"
import { useAuth } from "@/components/AuthProvider"
import { usePlatformStats } from "@/lib/api/hooks"

// ClientOnly component to handle hydration mismatches
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return isClient ? children : null
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const { user, isAuthenticated, logout } = useAuth();
  const { stats, loading: statsLoading } = usePlatformStats();

  // Define carousel images
  const carouselImages = [
    {
      src: "/carousel/padel-action.jpg",
      alt: "Padel court with players in action",
      caption: "Experience Padel Like Never Before",
      subcaption: "Join Amsterdam's most vibrant sports community"
    },
    {
      src: "/carousel/social-meetup.jpg",
      alt: "Social sports meetup with diverse group of players",
      caption: "Connect With Players",
      subcaption: "Find your perfect match for skill and energy"
    },
    {
      src: "/carousel/team-celebration.jpg",
      alt: "Players celebrating after a match",
      caption: "Create Lasting Connections",
      subcaption: "Sports bring people together in Amsterdam"
    },
    {
      src: "/carousel/amsterdam-venue.jpg",
      alt: "Amsterdam padel venue at sunset",
      caption: "Discover Top Venues",
      subcaption: "Play at Amsterdam's premier padel courts"
    },
  ]

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      // Next slide
      setCurrentImageIndex(prevIndex => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }
    
    if (isRightSwipe) {
      // Previous slide
      setCurrentImageIndex(prevIndex => 
        prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
      );
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Carousel auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-white">
        {/* Sticky Navigation */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src="/socialsports.jpg"
                  alt="Social Sports Logo"
                  width={isScrolled ? 40 : 50}
                  height={isScrolled ? 40 : 50}
                  className="transition-all duration-300"
                />
                <span className={`ml-2 font-semibold text-lg ${isScrolled ? "text-primary" : "text-white"}`}>
                  Social Sports
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#how-it-works"
                  className={`transition-colors ${isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-white"}`}
                >
                  How It Works
                </a>
                <a
                  href="#courts"
                  className={`transition-colors ${isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-white"}`}
                >
                  Courts
                </a>
                <a
                  href="#benefits"
                  className={`transition-colors ${isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-white"}`}
                >
                  Benefits
                </a>
                <a
                  href="#testimonials"
                  className={`transition-colors ${isScrolled ? "text-gray-700 hover:text-primary" : "text-white/90 hover:text-white"}`}
                >
                  Testimonials
                </a>
                
                {isAuthenticated ? (
                  <>
                    <Link href="/events">
                      <Button size="sm" className="mr-2">
                        All Events
                      </Button>
                    </Link>
                    <Link href="/events/my-events">
                      <Button size="sm" variant="outline" className="ml-1">
                        My Events
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className={`${isScrolled ? "text-gray-700" : "text-white/90"} hover:text-white flex items-center gap-1 ml-4`}
                    >
                      <LogOut className="h-3 w-3" />
                      Logout
                    </Button>
                    <div className={`flex items-center text-sm ${isScrolled ? "text-gray-600" : "text-white/80"}`}>
                      <User className="h-3 w-3 mr-1" />
                      {user?.name || user?.email}
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" size="sm" className={`${isScrolled ? "bg-white" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}>
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="ml-4">
                        Start Playing
                      </Button>
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <X className={isScrolled ? "text-primary" : "text-white"} />
                ) : (
                  <Menu className={isScrolled ? "text-primary" : "text-white"} />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <nav className="md:hidden pt-4 pb-4 bg-white/95 rounded-lg shadow-lg mt-2">
                <div className="flex flex-col space-y-4">
                  <a
                    href="#how-it-works"
                    className="px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    How It Works
                  </a>
                  <a
                    href="#courts"
                    className="px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Courts
                  </a>
                  <a
                    href="#benefits"
                    className="px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Benefits
                  </a>
                  <a
                    href="#testimonials"
                    className="px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors text-gray-700 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Testimonials
                  </a>
                  
                  {isAuthenticated ? (
                    <>
                      <Link href="/events" onClick={() => setIsMenuOpen(false)}>
                        <Button size="sm" className="w-full mt-2">
                          All Events
                        </Button>
                      </Link>
                      <Link href="/events/my-events" onClick={() => setIsMenuOpen(false)}>
                        <Button size="sm" variant="outline" className="w-full mt-2">
                          My Events
                        </Button>
                      </Link>
                      <div className={`flex items-center text-sm mt-4 ${isScrolled ? "text-gray-600" : "text-white/80"}`}>
                        <User className="h-3 w-3 mr-1" />
                        {user?.name || user?.email}
                      </div>
                      <button 
                        onClick={handleLogout}
                        className={`text-left mt-2 ${isScrolled ? "text-gray-700" : "text-white/90"} hover:text-white flex items-center gap-1`}
                      >
                        <LogOut className="h-3 w-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" size="sm" className={`w-full mt-2 ${isScrolled ? "bg-white" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}>
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button size="sm" className="w-full mt-2">
                          Start Playing
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            )}
          </div>
        </header>

        {/* Hero Section - Add padding-top to account for the fixed header */}
        <section 
          className="relative h-[90vh] flex items-center overflow-hidden pt-16"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 z-0">
            {carouselImages.map((image, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
                  index === currentImageIndex 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-105"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover brightness-[0.6]"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={() => setCurrentImageIndex(prev => prev === 0 ? carouselImages.length - 1 : prev - 1)}
            className="absolute left-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors hidden sm:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button 
            onClick={() => setCurrentImageIndex(prev => prev === carouselImages.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors hidden sm:flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="absolute bottom-8 right-8 z-20 flex space-x-3 p-2 bg-black/20 rounded-full">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? "bg-primary scale-110 shadow-lg" 
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {carouselImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`transition-opacity duration-1000 absolute ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                    {image.caption} <span className="text-primary">Simplified</span>
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8">
                    {image.subcaption}
                  </p>
                </div>
              ))}
              <div style={{ height: "180px" }} className="mb-6 sm:mb-8"></div>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/events">
                      <Button size="lg" className="group">
                        Browse Events
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href="/events/my-events">
                      <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                        My Events
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/register">
                    <Button size="lg" className="group">
                      Start Playing Now
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
                {!isAuthenticated && (
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    How It Works
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="animate-bounce bg-white/10 p-2 rounded-full">
              <ChevronRight className="h-6 w-6 text-white rotate-90" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
                  {statsLoading ? '...' : `${stats?.activePlayers.toLocaleString()}+`}
                </p>
                <p className="text-gray-600">Active Players</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
                  {statsLoading ? '...' : `${stats?.gamesWeekly.toLocaleString()}+`}
                </p>
                <p className="text-gray-600">Games Weekly</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
                  {statsLoading ? '...' : `${stats?.padelVenues.toLocaleString()}+`}
                </p>
                <p className="text-gray-600">Padel Venues</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
                  {statsLoading ? '...' : stats?.playerRating.toFixed(1)}
                </p>
                <p className="text-gray-600">Player Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <Badge className="mb-4">Simple Process</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Organizing Padel games in Amsterdam has never been easier. Just a few messages and you're ready to play.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>1. Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Message our WhatsApp bot with "Create Padel game" and follow the simple prompts.
                  </p>
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="font-mono text-sm text-gray-800">
                      "Create Padel game at Padel City on Friday at 18:00, skill level 3"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>2. Find Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We'll create a WhatsApp group and help you find players of similar skill levels.
                  </p>
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="font-mono text-sm text-gray-800">
                      "3 players joined your Padel game. 1 spot remaining!"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>3. Play & Enjoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Receive reminders, court details, and connect with your new Padel community.
                  </p>
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="font-mono text-sm text-gray-800">
                      "Your Padel game starts in 2 hours. Court #3 is reserved."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Amsterdam Padel Showcase */}
        <section id="courts" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <Badge className="mb-4">Top Locations</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Amsterdam's Best Padel Courts</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the finest Padel venues across Amsterdam, all available through our service.
              </p>
            </div>

            <Tabs defaultValue="padel-city" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
                <TabsTrigger value="padel-city">Padel City</TabsTrigger>
                <TabsTrigger value="sportpark-sloten">Sportpark Sloten</TabsTrigger>
                <TabsTrigger value="tennis-padel-ijburg">Tennis & Padel IJburg</TabsTrigger>
              </TabsList>

              <TabsContent value="padel-city" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=600&width=800"
                      alt="Padel City Amsterdam"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <span className="text-gray-600">Amsterdam Noord</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Padel City Amsterdam</h3>
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">
                      Amsterdam's premier Padel facility with 8 professional courts, excellent lighting, and a vibrant
                      atmosphere. Perfect for players of all levels.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="outline" className="bg-white">
                        Indoor Courts
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Pro Shop
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Bar & Restaurant
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Coaching Available
                      </Badge>
                    </div>
                    <Button>Book Through Our Bot</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sportpark-sloten" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative h-80 rounded-xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=600&width=800"
                      alt="Sportpark Sloten"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <span className="text-gray-600">Amsterdam West</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Sportpark Sloten</h3>
                    <div className="flex mb-4">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                      <Star className="h-5 w-5 text-yellow-400" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      A spacious sports complex featuring 6 outdoor Padel courts with excellent maintenance. Popular among
                      intermediate players.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="outline" className="bg-white">
                        Outdoor Courts
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Parking
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Café
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Tournaments
                      </Badge>
                    </div>
                    <Button>Book Through Our Bot</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tennis-padel-ijburg" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative h-80 rounded-xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=600&width=800"
                      alt="Tennis & Padel IJburg"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <span className="text-gray-600">Amsterdam East</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Tennis & Padel IJburg</h3>
                    <div className="flex mb-4">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      Beautiful waterside location with 4 Padel courts. Family-friendly atmosphere and stunning views of
                      IJburg.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="outline" className="bg-white">
                        Scenic Location
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Tennis & Padel
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Beginner Friendly
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Equipment Rental
                      </Badge>
                    </div>
                    <Button>Book Through Our Bot</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <Badge className="mb-4">Why Choose Us</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Benefits of Our Padel Community</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Join Amsterdam's most active Padel community and experience these advantages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>No Extra Apps</CardTitle>
                  <CardDescription>Everything happens in WhatsApp - the app you already use daily.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Skill Matching</CardTitle>
                  <CardDescription>Find players at your level (1-5) for balanced, enjoyable games.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Court Discovery</CardTitle>
                  <CardDescription>Explore Amsterdam's best Padel courts through our recommendations.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Automatic Reminders</CardTitle>
                  <CardDescription>Never miss a game with timely WhatsApp notifications.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Community Building</CardTitle>
                  <CardDescription>Connect with Amsterdam's vibrant Padel community.</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Easy Booking</CardTitle>
                  <CardDescription>Direct links to court booking systems for seamless reservations.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Players Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hear from members of our Amsterdam Padel community.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Testimonial avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Joost van der Meer</CardTitle>
                      <CardDescription>Skill Level 4 • Amsterdam Zuid</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    "This WhatsApp bot has completely changed how I play Padel in Amsterdam. I've met so many great
                    players and discovered courts I never knew existed!"
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Testimonial avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Emma de Vries</CardTitle>
                      <CardDescription>Skill Level 3 • Amsterdam West</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    "As a beginner, I was nervous about finding the right people to play with. This service matched me
                    with other level 3 players, and now we play weekly!"
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Testimonial avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Thomas Bakker</CardTitle>
                      <CardDescription>Skill Level 5 • Amsterdam Noord</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    "I organize competitive Padel games twice a week using this service. The WhatsApp integration is
                    brilliant - no need for another app cluttering my phone!"
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Play Padel in Amsterdam?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join our WhatsApp community today and start organizing games within minutes.
              </p>

              <div className="bg-white/10 p-8 rounded-xl mb-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Scan to Start</h3>
                    <p className="mb-4">
                      Scan this QR code with your phone camera to open WhatsApp and start chatting with our bot.
                    </p>
                    <p className="text-sm text-white/70">Or message +31 6 12345678 directly</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="w-48 h-48 bg-gray-200 relative">
                        <Image
                          src="/placeholder.svg?height=200&width=200"
                          alt="WhatsApp QR Code"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button size="lg" variant="secondary" className="text-primary">
                Message Us on WhatsApp
              </Button>
            </div>
          </div>
        </section>

        {/* Add the following section before the footer */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-3">New Feature</Badge>
              <h2 className="text-3xl font-bold mb-4">Connect with WhatsApp</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We've integrated with our backend service to allow you to create and join sports events using WhatsApp.
                Link your account to receive notifications and join event groups directly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Join Events Seamlessly</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mt-1 mr-2" />
                    <span>Create events on the web and manage them from WhatsApp</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mt-1 mr-2" />
                    <span>Receive notifications about new events and reminders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mt-1 mr-2" />
                    <span>Join WhatsApp groups automatically for each event</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mt-1 mr-2" />
                    <span>Share events with friends directly through WhatsApp</span>
                  </li>
                </ul>
                
                <div className="mt-8 space-y-4">
                  <Link href="/events">
                    <Button className="w-full sm:w-auto">
                      Browse Events
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-500">
                    Our backend service makes it easy to organize and join sports activities
                  </p>
                </div>
              </div>
              
              <div>
                <WhatsAppIntegration />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-white/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="mb-4">
                  <Image
                    src="/socialsports.jpg"
                    alt="Social Sports Logo"
                    width={150}
                    height={150}
                  />
                </div>
                <p className="mb-4">Connecting the Amsterdam Padel community through WhatsApp.</p>
                <p className="text-sm">© {new Date().getFullYear()} Social Sports Amsterdam. All rights reserved.</p>
              </div>
              <div className="flex flex-col md:items-end gap-4">
                <div className="flex gap-4">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-instagram"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-facebook"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-twitter"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </Button>
                </div>
                <div>
                  <Button variant="link" className="text-white/80 hover:text-white">
                    Privacy Policy
                  </Button>
                  <Button variant="link" className="text-white/80 hover:text-white">
                    Terms of Service
                  </Button>
                  <Button variant="link" className="text-white/80 hover:text-white">
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ClientOnly>
  )
}

