import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createBooking, getBookingsByDateAndTime } from '../../services/booking';
import { getTrainCentreById } from '../../services/trainCentre';
import Spinner from '../../components/Spinner'; // Import the Spinner component

// Custom hook for fetching training center data
const useTrainCentre = (id) => {
  const [trainCentre, setTrainCentre] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const fetchTrainCentre = async () => {
      try {
        const data = await getTrainCentreById(id);
        setTrainCentre(data.trainCentre);
        const bookings = await getBookingsByDateAndTime(id, data.trainCentre.date, data.trainCentre.time);
        const bookedSeatNumbers = bookings.map(booking => booking.seat);
        setBookedSeats(bookedSeatNumbers);
      } catch (error) {
        console.error('Error fetching training center:', error);
      }
    };
    if (id) {
      fetchTrainCentre();
    }
  }, [id]);

  return { trainCentre, bookedSeats };
};

// Seat selection button component
const SeatButton = ({ seat, isSelected, isBooked, handleClick }) => (
  <button
    key={seat}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 border border-gray-300 px-2 py-1 h-10 ${
      isSelected ? 'bg-blue-500 text-white' : isBooked ? 'bg-gray-400 cursor-not-allowed' : 'bg-white hover:bg-blue-500 hover:text-white'
    }`}
    onClick={handleClick}
    disabled={isBooked}
  >
    {seat}
  </button>
);

const BookTrainingCentre = () => {
  const router = useRouter();
  const { id } = router.query;
  const { trainCentre, bookedSeats } = useTrainCentre(id);
  const [selectedSeat, setSelectedSeat] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await createBooking(id, trainCentre.date, trainCentre.time, selectedSeat, token);
      alert('Booking successful!');
      setSelectedSeat('');
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSeatSelection = (seat) => {
    if (!bookedSeats.includes(seat)) {
      setSelectedSeat(seat);
    }
  };

  if (!trainCentre) {
    return <Spinner />;
  }

  return (
    <section className="w-full py-8 md:py-16 lg:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8 text-center lg:text-left">
          <div className="space-y-4 mx-auto lg:mx-0">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm">Training Center</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{trainCentre.name}</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl lg:text-base xl:text-xl mx-auto lg:mx-0">
              Upgrade your skills with our expert-led training programs. Conveniently located in the heart of the city.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Location</h3>
                <p className="text-gray-500">{trainCentre.location}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Date &amp; Time</h3>
                <p className="text-gray-500">{new Date(trainCentre.date).toLocaleDateString()}, {trainCentre.time}</p>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Contact</h3>
              <p className="text-gray-500">Phone: {trainCentre.contactInfo}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-8 md:py-16 lg:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-8 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-6 grid gap-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Date</label>
                    <input
                      type="text"
                      value={new Date(trainCentre.date).toLocaleDateString()}
                      className="inline-flex justify-center rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 border border-gray-300 bg-gray-200 px-4 py-2 w-full flex-col h-auto items-start"
                      readOnly
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Time Slot</label>
                    <input
                      type="text"
                      value={trainCentre.time}
                      className="inline-flex justify-center rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 border border-gray-300 bg-gray-200 px-4 py-2 w-full flex-col h-auto items-start"
                      readOnly
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none">Seats</label>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: trainCentre.capacity }, (_, i) => `Seat ${i + 1}`).map((seat) => (
                        <SeatButton
                          key={seat}
                          seat={seat}
                          isSelected={selectedSeat === seat}
                          isBooked={bookedSeats.includes(seat)}
                          handleClick={() => handleSeatSelection(seat)}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={handleBooking}
                    className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 rounded-md px-8 w-full h-12"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
            <div className="grid gap-4 text-center lg:text-left">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-500">
                  About Our Exam and Training Center
                </h2>
                <p className="text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  Our state-of-the-art facility is designed to provide a comfortable and distraction-free environment for
                  your exam or training session. We offer a variety of time slots to fit your schedule and a range of
                  seating options to ensure your comfort.
                </p>
              </div>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
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
                    className="w-6 h-6 text-blue-500"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <div>
                    <div className="font-semibold">Reviews</div>
                    <div className="text-gray-500">4.9 out of 5 stars from 500+ reviews</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
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
                    className="w-6 h-6 text-blue-500"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <div>
                    <div className="font-semibold">Reviews</div>
                    <div className="text-gray-500">4.9 out of 5 stars from 500+ reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookTrainingCentre;

