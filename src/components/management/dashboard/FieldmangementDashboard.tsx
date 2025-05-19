import React from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

interface CardProps {
  title: string;
  value: string | number;
  change: number;
  target: string | number;
}

const Card: React.FC<CardProps> = ({ title, value, change, target }) => {
  const isPositive = change > 0;

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-sm font-medium text-[#1A439A]">{title}</h2>
      <p className="text-xs text-gray-400">{'Last month'}</p>
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-3xl">{value}</span>
        <div
          className={`flex items-center gap-4 space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}
        >
          <a className="mx-2">
            {' '}
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
          </a>
          <span className="text-sm">
            {Math.abs(change)} <a>{'%'}</a>
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {'Targets : '}
        <a className="text-black">{target}</a>{' '}
      </p>
    </div>
  );
};

const FieldmangementDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        title="Number of new clients"
        value={450}
        change={30}
        target={650}
      />
      <Card
        title="Amount of Fund disbursed"
        value="$45,000"
        change={-2}
        target="$45,6686"
      />
      <Card
        title="Number of Existing clients"
        value={20}
        change={-2}
        target={50}
      />
      <Card
        title="Amount of funds disbursed"
        value={3}
        change={30}
        target={10}
      />
    </div>
  );
};

export default FieldmangementDashboard;
