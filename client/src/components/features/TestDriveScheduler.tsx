import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00"
];

export default function TestDriveScheduler({ carId, carName }: { carId: string; carName: string }) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();

  const handleSchedule = () => {
    if (!date || !time) return;
    // Here we would typically make an API call to schedule the test drive
    console.log("Scheduling test drive for:", {
      carId,
      carName,
      date: format(date, "yyyy-MM-dd"),
      time,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg p-6 space-y-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <CalendarIcon className="w-5 h-5" />
        <h3 className="text-xl font-semibold">Schedule Test Drive</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => {
              const today = new Date();
              return (
                date < today ||
                date.getDay() === 0 // Disable Sundays
              );
            }}
            className="rounded-md border"
          />
        </div>

        <div>
          <Label>Select Time</Label>
          <Select onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {slot}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSchedule}
          disabled={!date || !time}
          className="w-full"
        >
          Schedule Test Drive
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          * Our team will contact you to confirm your test drive appointment
        </p>
      </div>
    </motion.div>
  );
}
