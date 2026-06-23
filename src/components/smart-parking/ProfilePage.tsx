"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { KeyRound, Radio, Save, CheckCircle2, User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user, setUser, token } = useAuthStore();
  const [rfid, setRfid] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rfidLoading, setRfidLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    setRfid(user?.rfid_tag || "");
  }, [user]);

  async function updateRfid(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setRfidLoading(true);
    try {
      const res = await fetch("/api/users/rfid", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rfid_tag: rfid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser((prev) => (prev ? { ...prev, rfid_tag: data.rfid_tag } : prev));
      setMessage("RFID tag updated successfully");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "RFID update failed");
    } finally {
      setRfidLoading(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage("Password changed successfully");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Password change failed"
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold">Profile</h2>
        <p className="text-muted-foreground mt-1">
          Manage your account settings
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <User size={28} />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold">Account Details</h3>
              <p className="text-sm text-muted-foreground">Your personal information</p>
            </div>
          </div>

          <div className="space-y-5">
            {[
              { icon: User, label: "Name", value: user?.name },
              { icon: Mail, label: "Email", value: user?.email },
              { icon: Shield, label: "Role", value: user?.role },
              { icon: Radio, label: "RFID Tag", value: user?.rfid_tag || "Not linked" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-muted-foreground">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Messages */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 size={16} />
                {message}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* RFID Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={updateRfid}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Radio size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Update RFID</h3>
                <p className="text-sm text-muted-foreground">
                  Link your RFID tag for seamless entry
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="rfid">RFID Tag</Label>
              <motion.div whileFocusWithin={{ scale: 1.01 }}>
                <Input
                  id="rfid"
                  placeholder="e.g., 04A1B2C3"
                  value={rfid}
                  onChange={(e) => setRfid(e.target.value)}
                  className="h-11"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={rfidLoading}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                >
                  <Save size={16} className="mr-2" />
                  {rfidLoading ? "Saving..." : "Save RFID Tag"}
                </Button>
              </motion.div>
            </div>
          </motion.form>

          {/* Password Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={changePassword}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                  Update your account password
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <motion.div whileFocusWithin={{ scale: 1.01 }}>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="mt-1.5 h-11"
                    required
                  />
                </motion.div>
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <motion.div whileFocusWithin={{ scale: 1.01 }}>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        newPassword: e.target.value,
                      }))
                    }
                    className="mt-1.5 h-11"
                    required
                  />
                </motion.div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full h-11 rounded-xl"
                >
                  <KeyRound size={16} className="mr-2" />
                  {passwordLoading ? "Changing..." : "Change Password"}
                </Button>
              </motion.div>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}