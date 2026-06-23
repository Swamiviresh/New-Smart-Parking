"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  Car,
  ShieldCheck,
  Zap,
  Radio,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const features = [
  {
    icon: Car,
    title: "Real-Time Slot Tracking",
    description:
      "Monitor parking slot availability in real-time with automatic status updates from IoT sensors.",
  },
  {
    icon: ShieldCheck,
    title: "RFID Authentication",
    description:
      "Seamless entry with RFID tag scanning. Just drive in — the system handles everything automatically.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description:
      "Book your preferred parking slot in advance. No more circling the lot looking for a spot.",
  },
  {
    icon: Radio,
    title: "IoT Integration",
    description:
      "Hardware-integrated with Arduino and ESP8266 for reliable, always-on sensor monitoring.",
  },
  {
    icon: BarChart3,
    title: "Live Dashboard",
    description:
      "Beautiful dashboard with live occupancy data that refreshes every 5 seconds automatically.",
  },
  {
    icon: Sparkles,
    title: "Smart Scheduling",
    description:
      "Plan ahead with time-slot booking. Choose duration from 1 to 5 hours with overlap protection.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const stats = [
  { value: "3", label: "Parking Zones" },
  { value: "24/7", label: "Monitoring" },
  { value: "<2s", label: "Response Time" },
  { value: "99.9%", label: "Uptime" },
];

export default function LandingPage() {
  const setView = useAuthStore((s) => s.setView);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative overflow-hidden flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-32"
      >
        {/* Animated background gradient orbs */}
        <motion.div
          className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-600 dark:text-emerald-400 mb-8"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={14} />
            </motion.span>
            IoT-Powered Parking Intelligence
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight"
          >
            Smart Parking,{" "}
            <motion.span
              className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Simplified
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Real-time parking slot monitoring, RFID-based entry, and smart
            booking — all connected through IoT sensors for a seamless parking
            experience.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={() => setView("login")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-6 text-lg rounded-xl border-2 transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative z-10 mt-16 w-full max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-border/50"
          >
            <Image
              src="/hero-parking.png"
              alt="Smart Parking System"
              width={1536}
              height={1024}
              className="w-full h-auto object-cover"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </motion.div>

          {/* Floating stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl"
          >
            <div className="flex items-center justify-around rounded-2xl border bg-card/80 backdrop-blur-xl p-4 shadow-xl">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative px-4 py-32 mt-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Smart Parking
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete IoT-integrated parking management system built for
              modern infrastructure.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/20"
              >
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 transition-colors group-hover:bg-emerald-500/20"
                >
                  <feature.icon size={24} />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              How It{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

            {[
              {
                step: "01",
                title: "Register & Link RFID",
                desc: "Create an account and link your RFID tag for seamless entry.",
              },
              {
                step: "02",
                title: "Scan RFID to Enter",
                desc: "Drive up to the gate and scan your RFID — the system finds you a slot instantly.",
              },
              {
                step: "03",
                title: "Monitor & Book",
                desc: "View real-time slot availability on your dashboard and book slots in advance.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative flex items-start gap-6 mb-12 ${
                  i % 2 === 0
                    ? "md:flex-row-reverse md:text-right"
                    : "md:text-left"
                }`}
              >
                <div className="hidden md:block flex-1" />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-background text-emerald-600 dark:text-emerald-400 font-bold text-lg"
                >
                  {item.step}
                </motion.div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto text-center rounded-3xl border bg-card p-12 md:p-16 overflow-hidden"
        >
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: "left" }}
          />

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Park Smarter?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join the future of parking management. Get started in under a
            minute.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={() => {
                setView("login");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
            >
              <CheckCircle2 className="mr-2" size={20} />
              Start Now — It&apos;s Free
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Car size={18} className="text-emerald-500" />
            <span className="font-semibold text-foreground">
              Smart Parking
            </span>
          </div>
          <p>
            IoT-Integrated Parking Management System
          </p>
        </div>
      </footer>
    </div>
  );
}