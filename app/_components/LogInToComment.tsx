
import { Banner } from "flowbite-react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

export function LogInToComment() {
  return (
    <Banner>
      <div className="flex w-full flex-col justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row">
        <div className="mb-4 md:mb-0 md:mr-4">
          <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Login and tell your thoughts</h2>
          <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
            You can easily login using Google, then you can tell me what did you think about this article...
          </p>
        </div>
        <div className="flex shrink-0 items-center">
          <Link
            href="/login"
            className="mr-2 inline-flex items-center justify-center rounded-lg bg-cyan-700 px-3 py-2 text-xs font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            Login
            <HiArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </Banner>
  );
}

