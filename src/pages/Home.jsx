import {
    Wallet,
    DollarSign,
    BarChart3,
} from "lucide-react";

import Header from "../components/Header";
import WelcomeBanner from "../components/WelcomeBanner";
import FinanceCard from "../components/FinanceCard";
import CourseCard from "../components/CourseCard";
import Notice from "../components/Notice";

const instructors = [
    {
        name: "Sarah",
        image: "https://i.pravatar.cc/100?img=47",
    },
    {
        name: "John",
        image: "https://i.pravatar.cc/100?img=12",
    },
    {
        name: "Mike",
        image: "https://i.pravatar.cc/100?img=11",
    },
];

const courses = [
    {
        name: "Object oriented\nprogramming",
        icon: "💻",
    },
    {
        name: "Fundamentals of\ndatabase systems",
        icon: "📊",
    },
];

export default function Home() {
    return (
        <div className="min-h-full bg-white">

            {/* Header ONLY ON HOME */}
            <Header />

            <div className="px-6 pb-8 md:px-8">

                {/* Welcome */}
                <WelcomeBanner />

                {/* Main Grid */}
                <div className="grid gap-6 lg:grid-cols-[1fr_200px]">

                    {/* LEFT CONTENT */}
                    <div>

                        {/* Finance */}
                        <section>

                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Finance
                                </h2>
                            </div>

                            <div className="grid grid-cols-3 gap-3">

                                <FinanceCard
                                    icon={<Wallet size={21} />}
                                    amount="$10,000"
                                    label="Total Payable"
                                />

                                <FinanceCard
                                    active
                                    icon={<DollarSign size={21} />}
                                    amount="$5,000"
                                    label="Total Paid"
                                />

                                <FinanceCard
                                    icon={<BarChart3 size={21} />}
                                    amount="$300"
                                    label="Others"
                                />

                            </div>

                        </section>

                        {/* Courses */}
                        <section className="mt-7">

                            <div className="mb-3 flex items-center justify-between">

                                <h2 className="text-sm font-semibold text-gray-900">
                                    Enrolled Courses
                                </h2>

                                <button className="text-[10px] font-medium text-purple-600">
                                    See all
                                </button>

                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">

                                {courses.map((course) => (
                                    <CourseCard
                                        key={course.name}
                                        name={course.name}
                                        icon={course.icon}
                                    />
                                ))}

                            </div>

                        </section>

                    </div>

                    {/* RIGHT CONTENT */}
                    <aside>

                        {/* Instructors */}
                        <section>

                            <div className="mb-3 flex items-center justify-between">

                                <h2 className="text-sm font-semibold text-gray-900">
                                    Course instructors
                                </h2>

                                <button className="text-[10px] font-medium text-purple-600">
                                    See all
                                </button>

                            </div>

                            <div className="flex gap-2">

                                {instructors.map((person) => (
                                    <img
                                        key={person.name}
                                        src={person.image}
                                        alt={person.name}
                                        className="h-11 w-11 rounded-full border-2 border-purple-300 object-cover"
                                    />
                                ))}

                            </div>

                        </section>

                        {/* Notices */}
                        <section className="mt-5">

                            <div className="mb-3 flex items-center justify-between">

                                <h2 className="text-sm font-semibold text-gray-900">
                                    Daily notice
                                </h2>

                                <button className="text-[10px] font-medium text-purple-600">
                                    See all
                                </button>

                            </div>

                            <div className="rounded-xl bg-gray-50 p-4 shadow-sm">

                                <Notice
                                    title="Prelim payment due"
                                    text="Some exam preparation details are available."
                                />

                                <Notice
                                    title="Exam schedule"
                                    text="Check your examination schedule and important dates."
                                />

                                <Notice
                                    title="Important notice"
                                    text="Please review the latest information from your department."
                                />

                            </div>

                        </section>

                    </aside>

                </div>

            </div>

        </div>
    );
}