import React, { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Calendar,
  Clock,
  CheckCircle2,
  PhoneOff,
  MessageSquare,
  Search,
  Star,
  Sparkles,
} from 'lucide-react';
import { Doctor } from '../../types';

interface DoctorConnectViewProps {
  doctors: Doctor[];
  onBookAppointment: (docId: string, date: string, time: string) => void;
}

export const DoctorConnectView: React.FC<DoctorConnectViewProps> = ({
  doctors,
  onBookAppointment,
}) => {
  const [activeCallDoctor, setActiveCallDoctor] = useState<Doctor | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const [bookingModalDoc, setBookingModalDoc] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-08-10');
  const [bookingTime, setBookingTime] = useState('10:00 AM');

  const handleStartCall = (doc: Doctor) => {
    setActiveCallDoctor(doc);
    setCallDuration(0);
  };

  const handleConfirmBooking = () => {
    if (bookingModalDoc) {
      onBookAppointment(bookingModalDoc.id, bookingDate, bookingTime);
      alert(`Appointment booked with ${bookingModalDoc.name} on ${bookingDate} at ${bookingTime}!`);
      setBookingModalDoc(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white border border-blue-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Video className="w-3.5 h-3.5 text-blue-400" /> WebRTC Encrypted Telehealth
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Doctor Connect & Virtual Telehealth Consults
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Connect directly with verified board-certified physicians, cardiologists, neurologists, and nutritionists for HD video consultations or instant messaging.
          </p>
        </div>
      </div>

      {/* Live Video Call Screen (If Call Active) */}
      {activeCallDoctor && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-teal-500/50 shadow-2xl space-y-4 animate-in zoom-in-95">
          <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h3 className="font-bold text-sm">{activeCallDoctor.name}</h3>
                <p className="text-[10px] text-teal-400">{activeCallDoctor.specialty}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-800">
              HD Encrypted Call
            </span>
          </div>

          <div className="relative h-80 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800">
            {/* Simulated Remote Doctor Video */}
            <img
              src={activeCallDoctor.avatarUrl}
              alt={activeCallDoctor.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <div className="text-white text-xs">
                <p className="font-bold">{activeCallDoctor.name}</p>
                <p className="text-[10px] text-slate-300">Live Telehealth Consultation</p>
              </div>
            </div>

            {/* Simulated Local User Preview Window */}
            {isVideoOn && (
              <div className="absolute top-4 right-4 w-28 h-36 rounded-xl bg-slate-800 border-2 border-teal-500 overflow-hidden shadow-xl flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">Your Video</span>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 rounded-full text-white transition-all ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-rose-500'
              }`}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-4 rounded-full text-white transition-all ${
                isVideoOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-rose-500'
              }`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveCallDoctor(null)}
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30"
            >
              <PhoneOff className="w-4 h-4" /> End Call
            </button>
          </div>
        </div>
      )}

      {/* Physician List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <img
                src={doc.avatarUrl}
                alt={doc.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{doc.name}</h3>
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">{doc.specialty}</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{doc.rating}</span>
                  <span className="text-slate-400">({doc.consultationsCount} consults)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {doc.bio}
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100">${doc.pricePerConsult} / Session</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                {doc.availabilityStatus}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStartCall(doc)}
                className="flex-1 py-2.5 rounded-2xl bg-teal-500 text-white font-bold text-xs hover:bg-teal-600 flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20"
              >
                <Video className="w-3.5 h-3.5" /> Call Now
              </button>
              <button
                onClick={() => setBookingModalDoc(doc)}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
              Book Appointment with {bookingModalDoc.name}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 font-medium text-[11px]">
                Consultation Fee: ${bookingModalDoc.pricePerConsult} (Covered under standard digital health plan)
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setBookingModalDoc(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 text-white font-bold text-xs hover:bg-teal-600"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
