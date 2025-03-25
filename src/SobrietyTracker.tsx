import { useEffect, useState } from 'react';
import background from '../src/assets/maxresdefault.jpg'

const ranks = [
    { name: "Private", days: 0 },
    { name: "Sergeant", days: 3 },
    { name: "Corporal", days: 7 },
    { name: "Lieutenant", days: 10 },
    { name: "Captain", days: 14 },
    { name: "Major", days: 21 },
    { name: "Colonel", days: 40 },
    { name: "Marshal", days: 90 },
    { name: "General", days: 180 },
    { name: "Emperor", days: 365 },
];

type Rank = {
    name: string;
    days: number;
}

const SobrietyTracker = () => {
    const [startDate, setStartDate] = useState<string>(() => {
        return localStorage.getItem("sobrietyStart") || new Date().toISOString();
    });
    const [daysSober, setDaysSober] = useState<number>(0);
    const [hoursSober, setHoursSober] = useState<number>(0);
    const [minutesSober, setMinutesSober] = useState<number>(0);
    const [secondsSober, setSecondsSober] = useState<number>(0);
    const [longestStreak, setLongestStreak] = useState<number>(0);

    useEffect(() => {
        localStorage.setItem("sobrietyStart", startDate);
        const interval = setInterval(() => {
            const diff = new Date().getTime() - new Date(startDate).getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setDaysSober(days);
            setHoursSober(hours);
            setMinutesSober(minutes);
            setSecondsSober(seconds);

            const savedLongestStreak = localStorage.getItem("longestStreak");
            const currentLongestStreak = savedLongestStreak ? parseInt(savedLongestStreak) : 0;
            if (days > currentLongestStreak) {
                setLongestStreak(days);
                localStorage.setItem("longestStreak", days.toString());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startDate]);

    const currentRank: Rank = ranks.reduce((prev, curr) => (daysSober >= curr.days ? curr : prev), ranks[0]);

    return (
        <div 
            className="flex flex-col items-center p-6 bg-gray-100 transparent rounded-xl shadow-lg max-w-sm mx-auto"
            style={{
                backgroundImage: `url(${background})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'bottom 20px center', 
                height: '100vh', 
                width: '400vw'
            }}
        >
            <h1 className="text-2xl font-bold mb-4 text-white">Lock In, Stay Stoic</h1>
            <p className="text-lg text-white">Days Sober: <strong>{daysSober}</strong></p>
            <p className="text-lg text-white">Time Sober: <strong>{hoursSober}h {minutesSober}m {secondsSober}s</strong></p>
            <p className="text-lg text-white">Current Rank: <strong>{currentRank.name}</strong></p>
            <p className="text-lg text-white">Longest Streak: <strong>{longestStreak} Days</strong></p>
            <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl"
                onClick={() => {
                    localStorage.removeItem("sobrietyStart");
                    setStartDate(new Date().toISOString());
                }}
            >
                Reset Counter
            </button>
        </div>
    );
}

export default SobrietyTracker;
