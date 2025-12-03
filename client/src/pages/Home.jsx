import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'
import FeaturesSection from '../components/FeaturesSection'
import StatsSection from '../components/StatsSection'

const Home = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedSection />
      <FeaturesSection />
      <TrailersSection />
    </>
  )
}

export default Home
