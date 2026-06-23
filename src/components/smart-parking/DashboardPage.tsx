"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import {
  RefreshCw,
  Car,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slot {
  id: number;
  slot_number: number;
  status: string;
  booking_status: string;
}

const statusConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: typeof CheckCircle2; label: string }
> = {
  available: {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
    label: "Available",
  },
  occupied: {
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: AlertTriangle,
    label: "Occupied",
  },
  booked: {
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: XCircle,
    label: "Booked",
  },
};

function SlotCard({
  slot,
  index,
}: {
  slot: Slot;
  index: number;
}) {
  const config = statusConfig[slot.status] || statusConfig.available;
  const StatusIcon = config.icon;
  const isAvailable = slot.status === "available" && slot.booking_status === "not_booked";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, scale: 1.03 }}
      className={`relative rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 ${
        isAvailable
          ? "hover:shadow-lg hover:shadow-emerald-500/10 " + config.border
          : config.border
      }`}
    >
      {/* Pulse indicator for available slots */}
      {isAvailable && (
        <motion.div
          className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            animate={isAvailable ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bg} ${config.color}`}
          >
            <Car size={22} />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Slot
            </p>
            <h3 className="text-2xl font-bold">{slot.slot_number}</h3>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.color}`}
        >
          <StatusIcon size={14} />
          {config.label}
        </motion.div>
      </div>

      {/* Booking status indicator */}
      {slot.booking_status === "booked" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Timer size={12} />
          Currently reserved
        </motion.div>
      )}
    </motion.div>
  );
}

export default function DashboardPage() {
  const { token, user } = useAuthStore();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadSlots = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load slots");
      const data = await res.json();
      setSlots(data);
      setError("");
      setLastRefresh(new Date());
    } catch {
      setError("Unable to load parking slots");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    loadSlots();

    const timer = window.setInterval(() => {
      loadSlots(true);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [loadSlots]);

  const availableCount = slots.filter(
    (s) => s.status === "available" && s.booking_status === "not_booked"
  ).length;
  const occupiedCount = slots.filter((s) => s.status === "occupied").length;

  return (
    <div className="space-y-6">
      {/* Welcome & Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold">
          Welcome back, <span className="text-emerald-600 dark:text-emerald-400">{user?.name}</span>
        </h2>
        <p className="text-muted-foreground mt-1">
          Here&apos;s the current parking overview
        </p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Slots",
            value: slots.length,
            icon: MapPin,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Available",
            value: availableCount,
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Occupied",
            value: occupiedCount,
            icon: Car,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            whileHover={{ y: -3 }}
            className="rounded-xl border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Slot Grid Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">Parking Slots</h3>
          <motion.p
            key={lastRefresh?.toISOString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground flex items-center gap-1.5"
          >
            <Clock size={14} />
            Live occupancy · Auto-refreshes every 5 seconds
          </motion.p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadSlots(true)}
            className="gap-2"
          >
            <motion.div
              animate={refreshing ? { rotate: 360 } : {}}
              transition={{ duration: 0.8, repeat: refreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw size={16} />
            </motion.div>
            Refresh
          </Button>
        </motion.div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slot Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="h-[120px] rounded-2xl bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={slots.map((s) => `${s.id}-${s.status}`).join(",")}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {slots.map((slot, index) => (
              <SlotCard key={slot.id} slot={slot} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}