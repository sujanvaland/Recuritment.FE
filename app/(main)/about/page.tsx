"use client"

import type React from "react"
import Link from "next/link"
import { ArrowRight, Users, Target, Award, Globe, CheckCircle, Heart, Lightbulb, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const stats = [
    { number: "25,850+", label: "Active Jobs", icon: <Target className="h-6 w-6" /> },
    { number: "10,250+", label: "Happy Candidates", icon: <Users className="h-6 w-6" /> },
    { number: "18,400+", label: "Partner Companies", icon: <Globe className="h-6 w-6" /> },
    { number: "98%", label: "Success Rate", icon: <Award className="h-6 w-6" /> },
  ]

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-[#e1bd00]" />,
      title: "Passion for Excellence",
      description: "We are driven by a passion for connecting exceptional talent with outstanding opportunities."
    },
    {
      icon: <Shield className="h-8 w-8 text-[#e1bd00]" />,
      title: "Trust & Integrity",
      description: "Building lasting relationships through transparency, honesty, and ethical business practices."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-[#e1bd00]" />,
      title: "Innovation First",
      description: "Continuously evolving our platform to provide cutting-edge solutions for modern recruitment."
    },
    {
      icon: <Users className="h-8 w-8 text-[#e1bd00]" />,
      title: "People-Centered",
      description: "Putting people at the heart of everything we do, creating meaningful career connections."
    }
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/placeholder-user.jpg",
      description: "10+ years in HR technology and talent acquisition."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/placeholder-user.jpg",
      description: "Former tech lead at major recruitment platforms."
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/placeholder-user.jpg",
      description: "Expert in scaling recruitment operations globally."
    },
    {
      name: "David Kim",
      role: "Head of Product",
      image: "/placeholder-user.jpg",
      description: "Passionate about creating user-centric experiences."
    }
  ] 

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                About <span className="text-yellow-300">Sarvha</span>
              </h1>
              <p className="mx-auto text-blue-100 max-w-3xl md:text-xl">
                We're on a mission to revolutionize the way people find careers and companies discover talent. 
                Building bridges between ambition and opportunity, one connection at a time.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Button asChild className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg">
                <Link href="/jobs">
                  Explore Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="!bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-gray-900 font-semibold px-8 py-3 rounded-lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-300 text-black">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full bg-gradient-to-br from-[#dae3ff] via-[#f0f4ff] to-[#e6f0ff] py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-gray-800">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  Founded in 2020, Sarvha emerged from a simple yet powerful vision: to create a world where 
                  every professional finds their perfect career match, and every company discovers exceptional talent.
                </p>
                <p>
                  What started as a small team of passionate technologists and HR experts has grown into a 
                  comprehensive platform serving thousands of job seekers and employers worldwide.
                </p>
                <p>
                  We believe that the right opportunity can transform lives, and the right talent can 
                  revolutionize businesses. That's why we've built more than just a job board – we've 
                  created an ecosystem that nurtures career growth and business success.
                </p>
              </div>
              <div className="flex items-start space-x-2 mt-6">
                <CheckCircle className="h-6 w-6 text-[#e1bd00] mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">AI-Powered Matching</h4>
                  <p className="text-gray-600">Smart algorithms connect the right people with the right opportunities.</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="/abstract-data-stream.png" 
                alt="Our Story" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <Target className="h-12 w-12 text-white mr-4" />
              <h3 className="text-3xl font-bold">Our Mission</h3>
            </div>
            <p className="text-lg leading-relaxed opacity-90">
              To democratize access to career opportunities by creating an intelligent, 
              user-friendly platform that connects talent with companies based on skills, 
              values, and potential – not just keywords and connections.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <Globe className="h-12 w-12 text-white mr-4" />
              <h3 className="text-3xl font-bold">Our Vision</h3>
            </div>
            <p className="text-lg leading-relaxed opacity-90">
              To become the world's most trusted career platform where every job seeker 
              finds meaningful work, every employer discovers exceptional talent, and 
              workplace diversity and inclusion are the standard, not the exception.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full bg-gradient-to-br from-[#dae3ff] via-[#f0f4ff] to-[#e6f0ff] py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and help us build a better future of work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate individuals working tirelessly to transform the future of recruitment.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-4">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
              <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-12 text-white md:py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Join Our Mission?
            </h2>
            <p className="max-w-[600px] text-slate-300 md:text-xl">
              Whether you're looking for your next career opportunity or seeking exceptional talent, 
              we're here to help you succeed.
            </p>
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <Button asChild className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-3 rounded-lg">
                <Link href="/jobs">Find Jobs</Link>
              </Button>
              <Button asChild className="!bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-gray-900 font-semibold px-8 py-3 rounded-lg">
                <Link href="/employers">Post a Job</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
